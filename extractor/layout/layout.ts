export interface NodeLayout {
  mode: 'flex';
  direction: 'row' | 'column';
  gap: number;
  padding: [number, number, number, number];
  main: 'start' | 'center' | 'end' | 'space-between';
  cross: 'start' | 'center' | 'end' | 'stretch';
  wrap: boolean;
}

export interface NodeSizing {
  h: 'fill' | 'fixed' | 'hug';
  v: 'fill' | 'fixed' | 'hug';
}

export function extractLayout(computed: {
  display: string;
  flexDirection?: string;
  gap?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  justifyContent?: string;
  alignItems?: string;
  flexWrap?: string;
}): NodeLayout | undefined {
  const isFlex = computed.display.includes('flex');
  if (!isFlex) return undefined;

  const direction = computed.flexDirection?.includes('column') ? 'column' : 'row';

  const gap = Math.round(parseFloat(computed.gap || '0')) || 0;
  const pt = Math.round(parseFloat(computed.paddingTop || '0')) || 0;
  const pr = Math.round(parseFloat(computed.paddingRight || '0')) || 0;
  const pb = Math.round(parseFloat(computed.paddingBottom || '0')) || 0;
  const pl = Math.round(parseFloat(computed.paddingLeft || '0')) || 0;

  // Main alignment
  let main: 'start' | 'center' | 'end' | 'space-between' = 'start';
  const jc = computed.justifyContent || 'flex-start';
  if (jc.includes('center')) main = 'center';
  else if (jc.includes('space-between')) main = 'space-between';
  else if (jc.includes('flex-end') || jc.includes('end')) main = 'end';

  // Cross alignment
  let cross: 'start' | 'center' | 'end' | 'stretch' = 'stretch';
  const ai = computed.alignItems || 'stretch';
  if (ai.includes('center')) cross = 'center';
  else if (ai.includes('flex-start') || ai.includes('start')) cross = 'start';
  else if (ai.includes('flex-end') || ai.includes('end')) cross = 'end';
  else if (ai.includes('stretch')) cross = 'stretch';

  const wrap = computed.flexWrap === 'wrap';

  return {
    mode: 'flex',
    direction,
    gap,
    padding: [pt, pr, pb, pl],
    main,
    cross,
    wrap
  };
}

export function extractSizing(computed: {
  width?: string;
  height?: string;
  flexGrow?: string;
  alignSelf?: string;
}): NodeSizing {
  const grow = parseFloat(computed.flexGrow || '0');
  const h = grow > 0 ? 'fill' : 'fixed';
  const v = 'fixed';

  return { h, v };
}

