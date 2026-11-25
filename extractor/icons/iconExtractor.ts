/**
 * Manages extracted SVG icons and ensures canonical registration in Design IR.
 */

export class IconRegistry {
  private icons: Map<string, string> = new Map();
  private nameCounters: Map<string, number> = new Map();

  /**
   * Register an SVG element markup and return its registered name.
   */
  public register(svgMarkup: string, suggestedName?: string): string {
    // Clean and normalize SVG
    const cleanSvg = this.cleanSvgMarkup(svgMarkup);
    const existing = this.findExistingByContent(cleanSvg);
    if (existing) {
      return existing;
    }

    let name = (suggestedName || 'icon').toLowerCase().replace(/^icon[-_]/, '');
    name = name.replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!name) name = 'icon';

    if (this.icons.has(name)) {
      const count = (this.nameCounters.get(name) || 1) + 1;
      this.nameCounters.set(name, count);
      name = `${name}-${count}`;
    } else {
      this.nameCounters.set(name, 1);
    }

    this.icons.set(name, cleanSvg);
    return name;
  }

  public getIconsRecord(): Record<string, string> {
    const record: Record<string, string> = {};
    for (const [k, v] of this.icons.entries()) {
      record[k] = v;
    }
    return record;
  }

  private findExistingByContent(cleanedSvg: string): string | undefined {
    for (const [name, content] of this.icons.entries()) {
      if (content === cleanedSvg) return name;
    }
    return undefined;
  }

  private cleanSvgMarkup(markup: string): string {
    // Strip React comments or data attributes
    return markup
      .replace(/\s+data-[a-z0-9-]+="[^"]*"/gi, '')
      .replace(/\s+class="[^"]*"/gi, '')
      .replace(/\s+style="[^"]*"/gi, '')
      .trim();
  }
}

