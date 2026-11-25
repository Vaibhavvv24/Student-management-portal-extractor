/**
 * Browser-side DOM traversal logic executed inside Playwright page context.
 */

export interface RawDomNode {
  id: string;
  kind: 'frame' | 'text' | 'instance' | 'icon';
  name: string;
  hint?: string;
  tagName: string;
  box: { x: number; y: number; w: number; h: number };
  computedStyles: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
    borderRadius: string;
    boxShadow: string;
    overflow: string;
    opacity: string;
    color: string;
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string;
    textTransform: string;
  };
  computedLayout?: {
    display: string;
    flexDirection: string;
    gap: string;
    paddingTop: string;
    paddingRight: string;
    paddingBottom: string;
    paddingLeft: string;
    justifyContent: string;
    alignItems: string;
    flexWrap: string;
    flexGrow: string;
  };
  textContent?: string;
  svgMarkup?: string;
  svgIconName?: string;
  componentMetadata?: {
    name: string;
    id: string;
    variant?: Record<string, any>;
    hint?: string;
  };
  children?: RawDomNode[];
}

export function browserTraverseScript(screenPrefix: number): RawDomNode {
  let counter = 0;
  function nextId(): string {
    return `${screenPrefix}:${counter++}`;
  }

  function rgbToHexStr(rgbStr: string): string {
    if (!rgbStr || rgbStr === 'transparent' || rgbStr === 'rgba(0, 0, 0, 0)') return 'transparent';
    const m = rgbStr.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if (!m) return rgbStr;
    const r = Math.round(parseFloat(m[1])).toString(16).padStart(2, '0').toUpperCase();
    const g = Math.round(parseFloat(m[2])).toString(16).padStart(2, '0').toUpperCase();
    const b = Math.round(parseFloat(m[3])).toString(16).padStart(2, '0').toUpperCase();
    const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    if (a < 1) {
      const aHex = Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase();
      return `#${r}${g}${b}${aHex}`;
    }
    return `#${r}${g}${b}`;
  }

  function isVisible(el: Element, style: CSSStyleDeclaration, rect: DOMRect): boolean {
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (rect.width === 0 && rect.height === 0) return false;
    const tag = el.tagName.toLowerCase();
    if (['script', 'style', 'noscript', 'meta', 'link'].includes(tag)) return false;
    return true;
  }

  function inferIconName(svg: SVGSVGElement): string {
    const parent = svg.closest('[data-design-component]');
    const cls = svg.getAttribute('class') || '';
    const match = cls.match(/lucide-([a-z0-9-]+)/);
    if (match) return match[1];

    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (svg.parentElement) {
      const pClass = svg.parentElement.className || '';
      if (typeof pClass === 'string') {
        const pMatch = pClass.match(/icon-([a-z0-9-]+)/);
        if (pMatch) return pMatch[1];
      }
    }

    return 'icon';
  }

  function walk(el: Element): RawDomNode | null {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    if (!isVisible(el, style, rect)) {
      return null;
    }

    const tag = el.tagName.toLowerCase();
    const id = nextId();
    const box = {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      w: Math.round(rect.width),
      h: Math.round(rect.height)
    };

    const computedStyles = {
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      borderWidth: style.borderWidth,
      borderRadius: style.borderRadius,
      boxShadow: style.boxShadow,
      overflow: style.overflow,
      opacity: style.opacity,
      color: style.color,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontFamily: style.fontFamily,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      textAlign: style.textAlign,
      textTransform: style.textTransform
    };

    const isFlex = style.display.includes('flex');
    const computedLayout = isFlex ? {
      display: style.display,
      flexDirection: style.flexDirection,
      gap: style.gap,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      paddingLeft: style.paddingLeft,
      justifyContent: style.justifyContent,
      alignItems: style.alignItems,
      flexWrap: style.flexWrap,
      flexGrow: style.flexGrow
    } : undefined;

    // Check SVG Icon
    if (tag === 'svg') {
      const svgEl = el as SVGSVGElement;
      const iconName = inferIconName(svgEl);
      return {
        id,
        kind: 'icon',
        name: `icon/${iconName}`,
        tagName: tag,
        box,
        computedStyles,
        svgMarkup: svgEl.outerHTML,
        svgIconName: iconName
      };
    }

    // Check Reusable Component
    const compName = el.getAttribute('data-design-component');
    const compId = el.getAttribute('data-design-id');
    const compVariantStr = el.getAttribute('data-design-variant');
    const compHint = el.getAttribute('data-design-hint');
    let compVariant: Record<string, any> | undefined = undefined;
    if (compVariantStr) {
      try {
        compVariant = JSON.parse(compVariantStr);
      } catch {
        compVariant = { type: compVariantStr };
      }
    }

    // Check Text Leaf
    const hasOnlyTextChildren = Array.from(el.childNodes).every(
      n => n.nodeType === Node.TEXT_NODE || (n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'BR')
    );
    const directText = el.textContent?.trim() || '';

    if (hasOnlyTextChildren && directText.length > 0 && !compName) {
      return {
        id,
        kind: 'text',
        name: directText.length > 30 ? directText.slice(0, 27) + '…' : directText,
        tagName: tag,
        box,
        computedStyles,
        textContent: directText
      };
    }

    // Process Children
    const children: RawDomNode[] = [];
    for (let i = 0; i < el.children.length; i++) {
      const childNode = walk(el.children[i]);
      if (childNode) {
        children.push(childNode);
      }
    }

    // Node is an instance
    if (compName) {
      return {
        id,
        kind: 'instance',
        name: compName,
        hint: compHint || compName.toLowerCase(),
        tagName: tag,
        box,
        computedStyles,
        computedLayout,
        componentMetadata: {
          name: compName,
          id: compId || `c-${compName.toLowerCase()}`,
          variant: compVariant,
          hint: compHint || compName.toLowerCase()
        },
        children
      };
    }

    // General Frame Container
    let frameName = el.getAttribute('aria-label') || el.id || '';
    if (!frameName) {
      if (tag === 'header') frameName = 'Header';
      else if (tag === 'aside') frameName = 'Sidebar';
      else if (tag === 'nav') frameName = 'Navigation';
      else if (tag === 'main') frameName = 'Main';
      else if (tag === 'table') frameName = 'Table';
      else if (tag === 'tr') frameName = 'Row';
      else frameName = tag.charAt(0).toUpperCase() + tag.slice(1);
    }

    return {
      id,
      kind: 'frame',
      name: frameName,
      tagName: tag,
      box,
      computedStyles,
      computedLayout,
      children
    };
  }

  const rootElement = document.querySelector('.app-shell') || document.body;
  const rootNode = walk(rootElement);

  if (!rootNode) {
    throw new Error('Failed to extract root node from document');
  }

  // Ensure root node is the full screen frame (1440x1024)
  rootNode.box = { x: 0, y: 0, w: 1440, h: 1024 };
  return rootNode;
}

