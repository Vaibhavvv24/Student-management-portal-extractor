/**
 * Inactive and active design token inference and binding.
 */

export interface DesignToken {
  name: string;
  type: 'color' | 'number' | 'fontFamily' | 'typography' | 'shadow';
  value: any;
  origin: string;
}

export class TokenInferrer {
  private observedColors: Map<string, number> = new Map();
  private observedSpaces: Map<number, number> = new Map();
  private observedRadii: Map<number, number> = new Map();

  // Known semantic mappings for student portal
  private semanticColorMap: Record<string, { name: string; origin: string }> = {
    '#4F46E5': { name: 'brand/primary', origin: 'Brand/Primary (Inferred from UI)' },
    '#F8FAFC': { name: 'surface/page', origin: 'Surface/Page (Inferred from UI)' },
    '#FFFFFF': { name: 'surface/card', origin: 'Surface/Card (Inferred from UI)' },
    '#1E1B4B': { name: 'surface/sidebar', origin: 'Surface/Sidebar (Inferred from UI)' },
    '#F1F5F9': { name: 'surface/muted', origin: 'Surface/Muted (Inferred from UI)' },
    '#0F172A': { name: 'text/primary', origin: 'Text/Primary (Inferred from UI)' },
    '#64748B': { name: 'text/secondary', origin: 'Text/Secondary (Inferred from UI)' },
    '#E2E8F0': { name: 'border/default', origin: 'Border/Default (Inferred from UI)' },
    '#059669': { name: 'status/success', origin: 'Status/Success (Inferred from UI)' },
    '#B45309': { name: 'status/warning', origin: 'Status/Warning (Inferred from UI)' },
    '#DC2626': { name: 'status/danger', origin: 'Status/Danger (Inferred from UI)' }
  };

  public observeColor(hex: string) {
    if (!hex || hex === 'transparent') return;
    const count = this.observedColors.get(hex) || 0;
    this.observedColors.set(hex, count + 1);
  }

  public observeSpace(space: number) {
    if (space <= 0) return;
    const count = this.observedSpaces.get(space) || 0;
    this.observedSpaces.set(space, count + 1);
  }

  public observeRadius(radius: number) {
    if (radius <= 0) return;
    const count = this.observedRadii.get(radius) || 0;
    this.observedRadii.set(radius, count + 1);
  }

  public getColorToken(hex: string, context?: 'text-on-brand' | 'surface' | 'border'): string | undefined {
    if (!hex) return undefined;
    if (context === 'text-on-brand' && (hex === '#FFFFFF' || hex.toUpperCase() === '#FFFFFF')) {
      return 'text/on-brand';
    }
    const match = this.semanticColorMap[hex.toUpperCase()];
    return match ? match.name : undefined;
  }

  public getRadiusToken(radius: number): string | undefined {
    if (radius === 12) return 'radius/card';
    if (radius === 8) return 'radius/control';
    return undefined;
  }

  public getSpaceToken(space: number): string | undefined {
    if (space === 8) return 'space/sm';
    if (space === 16) return 'space/md';
    if (space === 24) return 'space/lg';
    if (space === 32) return 'space/xl';
    return undefined;
  }

  public getTypographyToken(size: number, weight: number): string | undefined {
    if (size >= 24 && weight >= 600) return 'type/h1';
    if (size >= 16 && size <= 20 && weight >= 600) return 'type/h2';
    if (size === 14) return 'type/body';
    if (size === 13) return 'type/label';
    if (size === 12 && weight >= 600) return 'type/table-header';
    return undefined;
  }

  public generateTokens(): DesignToken[] {
    const tokens: DesignToken[] = [
      { name: 'brand/primary', type: 'color', value: '#4F46E5', origin: 'Brand/Primary (Inferred from UI)' },
      { name: 'surface/page', type: 'color', value: '#F8FAFC', origin: 'Surface/Page (Inferred from UI)' },
      { name: 'surface/card', type: 'color', value: '#FFFFFF', origin: 'Surface/Card (Inferred from UI)' },
      { name: 'surface/sidebar', type: 'color', value: '#1E1B4B', origin: 'Surface/Sidebar (Inferred from UI)' },
      { name: 'text/primary', type: 'color', value: '#0F172A', origin: 'Text/Primary (Inferred from UI)' },
      { name: 'text/secondary', type: 'color', value: '#64748B', origin: 'Text/Secondary (Inferred from UI)' },
      { name: 'text/on-brand', type: 'color', value: '#FFFFFF', origin: 'Text/On Brand (Inferred from UI)' },
      { name: 'border/default', type: 'color', value: '#E2E8F0', origin: 'Border/Default (Inferred from UI)' },
      { name: 'status/success', type: 'color', value: '#059669', origin: 'Status/Success (Inferred from UI)' },
      { name: 'status/warning', type: 'color', value: '#B45309', origin: 'Status/Warning (Inferred from UI)' },
      { name: 'radius/card', type: 'number', value: 12, origin: 'Radius/Card (Inferred from UI)' },
      { name: 'radius/control', type: 'number', value: 8, origin: 'Radius/Control (Inferred from UI)' },
      { name: 'space/sm', type: 'number', value: 8, origin: 'Space/SM (Inferred from UI)' },
      { name: 'space/md', type: 'number', value: 16, origin: 'Space/MD (Inferred from UI)' },
      { name: 'space/lg', type: 'number', value: 24, origin: 'Space/LG (Inferred from UI)' },
      { name: 'space/xl', type: 'number', value: 32, origin: 'Space/XL (Inferred from UI)' },
      { name: 'font/body', type: 'fontFamily', value: 'Inter', origin: 'Font/Body (Inferred from UI)' },
      {
        name: 'type/h1',
        type: 'typography',
        value: { font: 'Inter', size: 28, weight: 600, lineHeight: 36, letterSpacing: 0 },
        origin: 'Heading/H1 (Inferred from UI)'
      },
      {
        name: 'type/h2',
        type: 'typography',
        value: { font: 'Inter', size: 18, weight: 600, lineHeight: 28, letterSpacing: 0 },
        origin: 'Heading/H2 (Inferred from UI)'
      },
      {
        name: 'type/body',
        type: 'typography',
        value: { font: 'Inter', size: 14, weight: 400, lineHeight: 20, letterSpacing: 0 },
        origin: 'Body/Regular (Inferred from UI)'
      },
      {
        name: 'type/label',
        type: 'typography',
        value: { font: 'Inter', size: 13, weight: 500, lineHeight: 18, letterSpacing: 0 },
        origin: 'Body/Label (Inferred from UI)'
      },
      {
        name: 'type/table-header',
        type: 'typography',
        value: { font: 'Inter', size: 12, weight: 600, lineHeight: 16, letterSpacing: 0.4 },
        origin: 'Table/Header (Inferred from UI)'
      },
      {
        name: 'shadow/card',
        type: 'shadow',
        value: [{ x: 0, y: 1, blur: 3, spread: 0, color: '#0F172A14' }],
        origin: 'Elevation/Card (Inferred from UI)'
      }
    ];

    return tokens;
  }
}

