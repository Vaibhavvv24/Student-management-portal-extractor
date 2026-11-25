import { z } from 'zod';
import { DesignIR } from '../design-ir/assembler';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  path: string;
  message: string;
}

export interface ValidationReport {
  valid: boolean;
  timestamp: string;
  schema: string;
  summary: {
    totalScreens: number;
    totalNodes: number;
    totalTokens: number;
    totalComponents: number;
    totalIcons: number;
    errorsCount: number;
    warningsCount: number;
  };
  issues: ValidationIssue[];
}

export class DesignIrValidator {
  public validate(ir: DesignIR): ValidationReport {
    const issues: ValidationIssue[] = [];

    // 1. Top-Level Required Fields
    if (ir.schema !== 'design-ir/1') {
      issues.push({ severity: 'error', path: 'schema', message: `Schema must be "design-ir/1", got "${ir.schema}"` });
    }
    if (!ir.source || typeof ir.source !== 'object') {
      issues.push({ severity: 'error', path: 'source', message: 'Missing or invalid "source" object' });
    }
    if (!ir.intent || typeof ir.intent !== 'object') {
      issues.push({ severity: 'error', path: 'intent', message: 'Missing or invalid "intent" object' });
    }
    if (!Array.isArray(ir.tokens)) {
      issues.push({ severity: 'error', path: 'tokens', message: '"tokens" must be an array' });
    }
    if (!Array.isArray(ir.components)) {
      issues.push({ severity: 'error', path: 'components', message: '"components" must be an array' });
    }
    if (!ir.icons || typeof ir.icons !== 'object') {
      issues.push({ severity: 'error', path: 'icons', message: '"icons" must be a key-value map' });
    }
    if (!ir.tags || typeof ir.tags !== 'object') {
      issues.push({ severity: 'error', path: 'tags', message: '"tags" must be an object' });
    }
    if (!Array.isArray(ir.screens) || ir.screens.length === 0) {
      issues.push({ severity: 'error', path: 'screens', message: '"screens" must be a non-empty array' });
    }

    // Registries for reference validation
    const tokenNames = new Set((ir.tokens || []).map(t => t.name));
    const componentIds = new Set((ir.components || []).map(c => c.id));
    const iconKeys = new Set(Object.keys(ir.icons || {}));

    const screenIds = new Set<string>();
    let totalNodes = 0;

    // 2. Validate Screens
    for (let sIdx = 0; sIdx < (ir.screens || []).length; sIdx++) {
      const screen = ir.screens[sIdx];
      const sPath = `screens[${sIdx}]`;

      if (!screen.id) {
        issues.push({ severity: 'error', path: `${sPath}.id`, message: 'Missing screen id' });
      } else if (screenIds.has(screen.id)) {
        issues.push({ severity: 'error', path: `${sPath}.id`, message: `Duplicate screen id: "${screen.id}"` });
      } else {
        screenIds.add(screen.id);
      }

      if (!screen.name) {
        issues.push({ severity: 'error', path: `${sPath}.name`, message: 'Missing screen name' });
      }

      if (!screen.viewport || typeof screen.viewport.w !== 'number' || typeof screen.viewport.h !== 'number') {
        issues.push({ severity: 'error', path: `${sPath}.viewport`, message: 'Invalid viewport dimensions' });
      }

      if (!screen.root) {
        issues.push({ severity: 'error', path: `${sPath}.root`, message: 'Missing root node in screen' });
      } else {
        const nodeIds = new Set<string>();
        this.validateNode(screen.root, `${sPath}.root`, nodeIds, issues, tokenNames, componentIds, iconKeys);
        totalNodes += nodeIds.size;
      }
    }

    const errorsCount = issues.filter(i => i.severity === 'error').length;
    const warningsCount = issues.filter(i => i.severity === 'warning').length;

    return {
      valid: errorsCount === 0,
      timestamp: new Date().toISOString(),
      schema: ir.schema,
      summary: {
        totalScreens: ir.screens?.length || 0,
        totalNodes,
        totalTokens: ir.tokens?.length || 0,
        totalComponents: ir.components?.length || 0,
        totalIcons: Object.keys(ir.icons || {}).length,
        errorsCount,
        warningsCount
      },
      issues
    };
  }

  private validateNode(
    node: any,
    path: string,
    nodeIds: Set<string>,
    issues: ValidationIssue[],
    tokenNames: Set<string>,
    componentIds: Set<string>,
    iconKeys: Set<string>
  ) {
    if (!node.id) {
      issues.push({ severity: 'error', path: `${path}.id`, message: 'Node is missing id' });
    } else if (nodeIds.has(node.id)) {
      issues.push({ severity: 'error', path: `${path}.id`, message: `Duplicate node id "${node.id}" in same screen` });
    } else {
      nodeIds.add(node.id);
    }

    const validKinds = ['frame', 'text', 'instance', 'icon'];
    if (!validKinds.includes(node.kind)) {
      issues.push({ severity: 'error', path: `${path}.kind`, message: `Invalid node kind "${node.kind}"` });
    }

    if (!node.name) {
      issues.push({ severity: 'warning', path: `${path}.name`, message: 'Node name is empty' });
    }

    if (!node.box || typeof node.box.x !== 'number' || typeof node.box.y !== 'number' || typeof node.box.w !== 'number' || typeof node.box.h !== 'number') {
      issues.push({ severity: 'error', path: `${path}.box`, message: 'Invalid box coordinates' });
    }

    // Text Node Checks
    if (node.kind === 'text') {
      if (!node.text || typeof node.text.content !== 'string') {
        issues.push({ severity: 'error', path: `${path}.text`, message: 'Text node missing content object' });
      }
      if (node.text?.token && !tokenNames.has(node.text.token)) {
        issues.push({ severity: 'warning', path: `${path}.text.token`, message: `Unresolved typography token "${node.text.token}"` });
      }
      if (node.text?.colorToken && !tokenNames.has(node.text.colorToken)) {
        issues.push({ severity: 'warning', path: `${path}.text.colorToken`, message: `Unresolved color token "${node.text.colorToken}"` });
      }
    }

    // Icon Node Checks
    if (node.kind === 'icon') {
      if (!node.icon) {
        issues.push({ severity: 'error', path: `${path}.icon`, message: 'Icon node missing icon reference' });
      } else if (!iconKeys.has(node.icon)) {
        issues.push({ severity: 'error', path: `${path}.icon`, message: `Unresolved icon reference "${node.icon}"` });
      }
    }

    // Instance Node Checks
    if (node.kind === 'instance') {
      if (!node.instance || !node.instance.component) {
        issues.push({ severity: 'error', path: `${path}.instance`, message: 'Instance node missing component reference' });
      } else if (!componentIds.has(node.instance.component)) {
        issues.push({ severity: 'warning', path: `${path}.instance.component`, message: `Component "${node.instance.component}" not in components catalog` });
      }
    }

    // Children Recursive
    if (node.children) {
      if (!Array.isArray(node.children)) {
        issues.push({ severity: 'error', path: `${path}.children`, message: 'Children must be an array' });
      } else {
        for (let cIdx = 0; cIdx < node.children.length; cIdx++) {
          this.validateNode(node.children[cIdx], `${path}.children[${cIdx}]`, nodeIds, issues, tokenNames, componentIds, iconKeys);
        }
      }
    }
  }
}

