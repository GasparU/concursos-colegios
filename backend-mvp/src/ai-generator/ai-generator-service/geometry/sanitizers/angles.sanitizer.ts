// src/ai-generator/sanitizers/angles.sanitizer.ts

export function sanitizeAngles(
  rays: any[],
  xValue: number,
  logger?: any,
): any[] {
  if (logger) {
    console.log(
      `🟡 [SANITIZE] Procesando ${rays.length} rayos, x_value=${xValue}`,
    );
  }

  // Primero, sanitizamos cada rayo (calculamos coef, const, value)
  const sanitizedRays = rays.map((ray: any, idx: number) => {
    if (logger) {
      console.log(`  - Rayo ${idx}: angleLabel="${ray.angleLabel}"`, ray);
    }
    if (ray.coef === undefined || ray.const === undefined) {
      const label = ray.angleLabel || '';
      const match = label.match(/^([+-]?\d*\.?\d*)?([a-zA-Z])([+-]\d+)?$/);
      let coef = 1,
        constVal = 0;
      if (match) {
        coef = match[1] ? parseFloat(match[1]) : 1;
        constVal = match[3] ? parseFloat(match[3]) : 0;
      }
      const value = coef * xValue + constVal;
      if (logger) {
        console.log(
          `    → extraído: coef=${coef}, const=${constVal}, value=${value}`,
        );
      }
      return { ...ray, coef, const: constVal, value };
    } else {
      if (logger) {
        console.log(`    → ya tenía: coef=${ray.coef}, const=${ray.const}`);
      }
      const value = ray.coef * xValue + ray.const;
      return { ...ray, value };
    }
  });

  // 🔥 FILTRAR RAYOS CON VALOR <= 0 (ángulos nulos o negativos)
  const rayosValidos = sanitizedRays.filter((ray) => ray.value > 0);

  if (logger) {
    console.log(
      `🟡 [SANITIZE] Rayos válidos después de filtrar: ${rayosValidos.length}`,
    );
  }

  return rayosValidos;
}
