import { RawDomNode } from '../dom/traverse';
import { IconRegistry } from '../icons/iconExtractor';
import { ComponentRegistry } from '../components/componentRegistry';
import { TokenInferrer } from '../tokens/tokenInferrer';
import { extractNodeStyle, NodeStyle } from '../styles/styles';
import { extractLayout, extractSizing, NodeLayout, NodeSizing } from '../layout/layout';
import { rgbToHex } from '../styles/colorUtils';

export interface DesignIrNode {
  id: string;
  kind: 'frame' | 'text' | 'instance' | 'icon';
  name: string;
  hint?: string;
  box: { x: number; y: number; w: number; h: number };
  style?: NodeStyle;
  layout?: NodeLayout;
  sizing?: NodeSizing;
  text?: {
    content: string;
    font: string;
    size: number;
    weight: number;
    lineHeight: number;
    letterSpacing: number;
    color: string;
    align: string;
    transform: string;
    token?: string;
    colorToken?: string;
  };
  instance?: {
    component: string;
    variant?: Record<string, string>;
  };
  icon?: string;
  children?: DesignIrNode[];
}

export interface DesignIrScreen {
  id: string;
  name: string;
  viewport: { w: number; h: number };
  root: DesignIrNode;
}

export interface DesignIR {
  schema: 'design-ir/1';
  source: {
    kind: 'browser';
    adapter: string;
    ref: string;
    exportedAt: string;
  };
  intent: {
    mode: 'global';
  };
  tokens: any[];
  components: any[];
  icons: Record<string, string>;
  tags: Record<string, any>;
  screens: DesignIrScreen[];
}

export class DesignIrAssembler {
  private iconRegistry = new IconRegistry();
  private componentRegistry = new ComponentRegistry();
  private tokenInferrer = new TokenInferrer();

  public assemble(
    screensData: Array<{ id: string; name: string; rootRaw: RawDomNode; refUrl: string }>
  ): DesignIR {
    // Pass 1: Collect tokens, components, and icons
    for (const s of screensData) {
      this.collectObservations(s.rootRaw);
    }

    // Pass 2: Build Design IR tree
    const screens: DesignIrScreen[] = screensData.map((s) => ({
      id: s.id,
      name: s.name,
      viewport: { w: 1440, h: 1024 },
      root: this.transformNode(s.rootRaw)
    }));

    // Build Component Map for tags
    const components = this.componentRegistry.getComponentDefinitions();
    const componentMap: Record<string, string> = {};
    for (const c of components) {
      componentMap[c.id] = c.name;
    }

    return {
      schema: 'design-ir/1',
      source: {
        kind: 'browser',
        adapter: 'playwright-browser-extractor@0.1.0',
        ref: screensData[0]?.refUrl || 'http://localhost:5173/dashboard',
        exportedAt: new Date().toISOString()
      },
      intent: {
        mode: 'global'
      },
      tokens: this.tokenInferrer.generateTokens(),
      components,
      icons: this.iconRegistry.getIconsRecord(),
      tags: {
        brandColor: '#4F46E5',
        cardStyle: 'cards',
        density: 'default',
        componentMap,
        notes: 'Extracted via Playwright browser DOM inspection from Student Management Portal.'
      },
      screens
    };
  }

  private collectObservations(raw: RawDomNode) {
    if (raw.computedStyles) {
      const bg = rgbToHex(raw.computedStyles.backgroundColor);
      if (bg !== 'transparent') this.tokenInferrer.observeColor(bg);

      const borderC = rgbToHex(raw.computedStyles.borderColor);
      if (borderC !== 'transparent') this.tokenInferrer.observeColor(borderC);

      const color = rgbToHex(raw.computedStyles.color);
      if (color !== 'transparent') this.tokenInferrer.observeColor(color);

      const radius = Math.round(parseFloat(raw.computedStyles.borderRadius || '0'));
      if (radius > 0) this.tokenInferrer.observeRadius(radius);
    }

    if (raw.computedLayout) {
      const gap = Math.round(parseFloat(raw.computedLayout.gap || '0'));
      if (gap > 0) this.tokenInferrer.observeSpace(gap);

      const pt = Math.round(parseFloat(raw.computedLayout.paddingTop || '0'));
      if (pt > 0) this.tokenInferrer.observeSpace(pt);
    }

    if (raw.kind === 'icon' && raw.svgMarkup) {
      this.iconRegistry.register(raw.svgMarkup, raw.svgIconName);
    }

    if (raw.kind === 'instance' && raw.componentMetadata) {
      this.componentRegistry.registerInstance(
        raw.componentMetadata.name,
        raw.componentMetadata.variant,
        raw.componentMetadata.id,
        raw.componentMetadata.hint
      );
    }

    if (raw.children) {
      for (const child of raw.children) {
        this.collectObservations(child);
      }
    }
  }

  private transformNode(raw: RawDomNode): DesignIrNode {
    const node: DesignIrNode = {
      id: raw.id,
      kind: raw.kind,
      name: raw.name,
      box: raw.box
    };

    if (raw.hint) {
      node.hint = raw.hint;
    }

    // Style
    const style = extractNodeStyle(raw.computedStyles);
    if (style) {
      // Bind tokens
      if (style.fills) {
        for (const fill of style.fills) {
          const t = this.tokenInferrer.getColorToken(fill.color, 'surface');
          if (t) fill.token = t;
        }
      }
      if (style.stroke) {
        const t = this.tokenInferrer.getColorToken(style.stroke.color, 'border');
        if (t) style.stroke.token = t;
      }
      if (style.radius) {
        // Radius token
      }
      if (style.shadows) {
        for (const s of style.shadows) {
          s.token = 'shadow/card';
        }
      }
      node.style = style;
    }

    // Layout
    if (raw.computedLayout) {
      const layout = extractLayout(raw.computedLayout);
      if (layout) {
        node.layout = layout;
      }
    }

    // Sizing
    if (raw.kind === 'instance' || raw.kind === 'frame') {
      node.sizing = extractSizing(raw.computedLayout || {});
    }

    // Text Leaf
    if (raw.kind === 'text') {
      const size = Math.round(parseFloat(raw.computedStyles.fontSize || '14'));
      const weight = parseInt(raw.computedStyles.fontWeight || '400', 10);
      const lineHeight = Math.round(parseFloat(raw.computedStyles.lineHeight || '20')) || size * 1.4;
      const letterSpacing = parseFloat(raw.computedStyles.letterSpacing || '0') || 0;
      const color = rgbToHex(raw.computedStyles.color);

      const colorToken = color === '#FFFFFF' ? 'text/on-brand' : this.tokenInferrer.getColorToken(color);
      const typoToken = this.tokenInferrer.getTypographyToken(size, weight);

      node.text = {
        content: raw.textContent || raw.name,
        font: 'Inter',
        size,
        weight,
        lineHeight: Math.round(lineHeight),
        letterSpacing: Math.round(letterSpacing * 10) / 10,
        color,
        align: raw.computedStyles.textAlign || 'left',
        transform: raw.computedStyles.textTransform || 'none',
        token: typoToken,
        colorToken
      };
    }

    // Icon Leaf
    if (raw.kind === 'icon') {
      const iconKey = this.iconRegistry.register(raw.svgMarkup || '', raw.svgIconName);
      node.icon = iconKey;
      node.name = `icon/${iconKey}`;
    }

    // Component Instance
    if (raw.kind === 'instance' && raw.componentMetadata) {
      const reg = this.componentRegistry.registerInstance(
        raw.componentMetadata.name,
        raw.componentMetadata.variant,
        raw.componentMetadata.id,
        raw.componentMetadata.hint
      );
      node.instance = {
        component: reg.componentId,
        variant: reg.variant
      };
    }

    // Children
    if (raw.children && raw.children.length > 0 && raw.kind !== 'icon' && raw.kind !== 'text') {
      node.children = raw.children.map((child) => this.transformNode(child));
    }

    return node;
  }
}

