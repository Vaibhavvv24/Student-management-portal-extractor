/**
 * Utility functions for color conversion and normalization.
 */

export function rgbToHex(rgbStr: string): string {
  if (!rgbStr || rgbStr === 'transparent' || rgbStr === 'rgba(0, 0, 0, 0)') {
    return 'transparent';
  }

  // Handle rgb(r, g, b) or rgba(r, g, b, a)
  const match = rgbStr.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (!match) {
    if (rgbStr.startsWith('#')) return rgbStr.toUpperCase();
    return rgbStr;
  }

  const r = Math.round(parseFloat(match[1]));
  const g = Math.round(parseFloat(match[2]));
  const b = Math.round(parseFloat(match[3]));
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  const hexR = r.toString(16).padStart(2, '0').toUpperCase();
  const hexG = g.toString(16).padStart(2, '0').toUpperCase();
  const hexB = b.toString(16).padStart(2, '0').toUpperCase();

  if (a < 1) {
    const hexA = Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase();
    return `#${hexR}${hexG}${hexB}${hexA}`;
  }

  return `#${hexR}${hexG}${hexB}`;
}

export interface ParsedShadow {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  token?: string;
}

export function parseBoxShadow(boxShadowStr: string): ParsedShadow[] {
  if (!boxShadowStr || boxShadowStr === 'none') return [];

  // Match: rgba(...) x y blur spread or x y blur spread rgb(...)
  const shadows: ParsedShadow[] = [];
  const parts = boxShadowStr.split(/,(?![^(]*\))/);

  for (const part of parts) {
    const trimmed = part.trim();
    const colorMatch = trimmed.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]+)/);
    const colorStr = colorMatch ? colorMatch[1] : 'rgba(0,0,0,0.1)';
    const color = rgbToHex(colorStr);

    const withoutColor = trimmed.replace(colorStr, '').trim();
    const dims = withoutColor.split(/\s+/).map(s => parseFloat(s) || 0);

    shadows.push({
      x: dims[0] || 0,
      y: dims[1] || 0,
      blur: dims[2] || 0,
      spread: dims[3] || 0,
      color
    });
  }

  return shadows;
}

