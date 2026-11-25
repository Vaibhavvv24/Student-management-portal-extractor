/**
 * Pure JavaScript string evaluated in browser page context.
 * No esbuild / tsx helper injection.
 */

export const BROWSER_TRAVERSE_SCRIPT = `
(function(screenPrefix) {
  let counter = 0;
  function nextId() {
    return screenPrefix + ":" + (counter++);
  }

  function isVisible(el, style, rect) {
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (rect.width === 0 && rect.height === 0) return false;
    const tag = el.tagName.toLowerCase();
    if (['script', 'style', 'noscript', 'meta', 'link'].includes(tag)) return false;
    return true;
  }

  function inferIconName(svg) {
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

  function walk(el) {
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
      const iconName = inferIconName(el);
      return {
        id,
        kind: 'icon',
        name: 'icon/' + iconName,
        tagName: tag,
        box,
        computedStyles,
        svgMarkup: el.outerHTML,
        svgIconName: iconName
      };
    }

    // Check Reusable Component
    const compName = el.getAttribute('data-design-component');
    const compId = el.getAttribute('data-design-id');
    const compVariantStr = el.getAttribute('data-design-variant');
    const compHint = el.getAttribute('data-design-hint');
    let compVariant = undefined;
    if (compVariantStr) {
      try {
        compVariant = JSON.parse(compVariantStr);
      } catch (e) {
        compVariant = { type: compVariantStr };
      }
    }

    // Check Text Leaf
    const hasOnlyTextChildren = Array.from(el.childNodes).every(
      n => n.nodeType === 3 || (n.nodeType === 1 && n.nodeName === 'BR')
    );
    const directText = (el.textContent || '').trim();

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
    const children = [];
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
          id: compId || ('c-' + compName.toLowerCase()),
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

  rootNode.box = { x: 0, y: 0, w: 1440, h: 1024 };
  return rootNode;
})
`;

