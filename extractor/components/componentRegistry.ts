export interface ComponentDefinition {
  id: string;
  name: string;
  variants: Record<string, string[]>;
  description?: string;
}

export class ComponentRegistry {
  private components: Map<string, {
    id: string;
    name: string;
    variants: Map<string, Set<string>>;
    description?: string;
  }> = new Map();

  public registerInstance(name: string, variantObj?: Record<string, any>, suggestedId?: string, hint?: string): {
    componentId: string;
    variant: Record<string, string>;
  } {
    const componentId = suggestedId || `c-${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    
    if (!this.components.has(componentId)) {
      this.components.set(componentId, {
        id: componentId,
        name,
        variants: new Map(),
        description: `Reusable ${name} component`
      });
    }

    const comp = this.components.get(componentId)!;
    const normalizedVariant: Record<string, string> = {};

    if (variantObj && typeof variantObj === 'object') {
      for (const [k, v] of Object.entries(variantObj)) {
        const valStr = String(v);
        normalizedVariant[k] = valStr;
        if (!comp.variants.has(k)) {
          comp.variants.set(k, new Set());
        }
        comp.variants.get(k)!.add(valStr);
      }
    }

    return {
      componentId,
      variant: normalizedVariant
    };
  }

  public getComponentDefinitions(): ComponentDefinition[] {
    const list: ComponentDefinition[] = [];
    for (const comp of this.components.values()) {
      const variants: Record<string, string[]> = {};
      for (const [k, vSet] of comp.variants.entries()) {
        variants[k] = Array.from(vSet).sort();
      }
      list.push({
        id: comp.id,
        name: comp.name,
        variants: Object.keys(variants).length > 0 ? variants : ({} as any),
        description: comp.description
      });
    }
    return list;
  }
}

