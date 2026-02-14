// src/ai-generator/sanitizers/segments.sanitizer.ts

export function sanitizeSegments(segments: any[], xValue: number): any[] {
  return segments.map((seg: any) => {
    if (seg.coef === undefined || seg.const === undefined) {
      const label = seg.label || '';
      const match = label.match(/^([+-]?\d*\.?\d*)?([a-zA-Z])([+-]\d+)?$/);
      let coef = 1,
        constVal = 0;
      if (match) {
        coef = match[1] ? parseFloat(match[1]) : 1;
        constVal = match[3] ? parseFloat(match[3]) : 0;
      }
      const value = coef * xValue + constVal;
      return { ...seg, coef, const: constVal, value };
    }
    // Asegurar que el valor esté actualizado con el xValue actual
    const value = seg.coef * xValue + seg.const;
    return { ...seg, value };
  });
}
