import { rgbToHex, parseBoxShadow, ParsedShadow } from './colorUtils';

export interface NodeStyle {
  fills?: Array<{
    type: 'solid';
    color: string;
    token?: string;
  }>;
  stroke?: {
    color: string;
    width: number;
    token?: string;
    sides?: [number, number, number, number];
  };
  radius?: number;
  shadows?: ParsedShadow[];
  clips?: boolean;
  opacity?: number;
}

export function extractNodeStyle(computed: {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  boxShadow?: string;
  overflow?: string;
  opacity?: string;
}): NodeStyle | undefined {
  const style: NodeStyle = {};
  let hasStyle = false;

  // Background Fills
  const bg = computed.backgroundColor ? rgbToHex(computed.backgroundColor) : 'transparent';
  if (bg !== 'transparent') {
    style.fills = [{ type: 'solid', color: bg }];
    hasStyle = true;
  }

  // Border Stroke
  const borderW = parseFloat(computed.borderWidth || '0');
  const borderC = computed.borderColor ? rgbToHex(computed.borderColor) : 'transparent';
  if (borderW > 0 && borderC !== 'transparent') {
    style.stroke = {
      color: borderC,
      width: Math.round(borderW)
    };
    hasStyle = true;
  }

  // Border Radius
  const radius = parseFloat(computed.borderRadius || '0');
  if (radius > 0) {
    style.radius = Math.round(radius);
    hasStyle = true;
  }

  // Shadows
  const shadows = parseBoxShadow(computed.boxShadow || 'none');
  if (shadows.length > 0) {
    style.shadows = shadows;
    hasStyle = true;
  }

  // Clips / Overflow
  if (computed.overflow === 'hidden' || computed.overflow === 'clip') {
    style.clips = true;
    hasStyle = true;
  }

  // Opacity
  const opacity = parseFloat(computed.opacity || '1');
  if (opacity < 1) {
    style.opacity = Math.round(opacity * 100) / 100;
    hasStyle = true;
  }

  return hasStyle ? style : undefined;
}

