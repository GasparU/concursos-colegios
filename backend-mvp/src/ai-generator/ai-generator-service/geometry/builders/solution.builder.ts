// src/ai-generator/builders/solution.builder.ts

export function buildSolution(
  type: string,
  params: any,
  totalStr: string,
  displayX: string,
): string {
  const valTotal = totalStr;
  const valXSolution = displayX;
  let solutionMarkdown = '';

  if (type === 'collinear_segments' && Array.isArray(params.segments)) {
    const varName = params.segments[0]?.label.replace(/[0-9.+\- ]/g, '') || 'x';
    const planteamientoStr = params.segments
      .map((s: any) => s.label)
      .join(' + ');
    const totalCoef = params.segments.reduce(
      (acc: number, s: any) => acc + (parseFloat(s.coef) || 0),
      0,
    );
    const totalConst = params.segments.reduce(
      (acc: number, s: any) => acc + (parseFloat(s.const) || 0),
      0,
    );
    const signConst = totalConst >= 0 ? '+' : '-';
    const absConst = Math.abs(totalConst);
    const rhsValue = parseFloat(valTotal) - totalConst;

    console.log('🔍 [solution] displayX:', displayX);
    console.log('🔍 [solution] valXSolution:', valXSolution);
    console.log('🔍 [solution] params.rays:', params.rays);

    solutionMarkdown = `
1. **Planteamiento:**
   Sumamos las longitudes de los segmentos para igualar al total:
   $$ ${planteamientoStr} = ${valTotal} $$

2. **Resolución:**
   - Agrupamos términos semejantes (${varName}):
     $$ ${totalCoef}${varName} ${signConst} ${absConst} = ${valTotal} $$
   - Pasamos el ${absConst} al otro lado:
     $$ ${totalCoef}${varName} = ${valTotal} ${totalConst >= 0 ? '-' : '+'} ${absConst} $$
     $$ ${totalCoef}${varName} = ${rhsValue} $$
   - Despejamos ${varName}:
     $$ ${varName} = ${valXSolution} $$

3. **Respuesta:**
   El valor de **${varName}** es **${valXSolution}**.
    `.trim();
  } else if (type === 'consecutive_angles' && Array.isArray(params.rays)) {
    const varName =
      params.rays[0]?.angleLabel.replace(/[0-9.+\- ]/g, '') || 'x';
    const planteamientoStr = params.rays
      .map((r: any) => r.angleLabel)
      .join(' + ');
    const valTotal = totalStr;
    const valXSolution = displayX;

    // Verificar si los rayos tienen coef/const para mostrar reducción algebraica
    const hasCoefConst = params.rays.some((r: any) => r.coef !== undefined);

    if (hasCoefConst) {
      const totalCoef = params.rays.reduce(
        (acc: number, r: any) => acc + (parseFloat(r.coef) || 0),
        0,
      );
      const totalConst = params.rays.reduce(
        (acc: number, r: any) => acc + (parseFloat(r.const) || 0),
        0,
      );
      const signConst = totalConst >= 0 ? '+' : '-';
      const absConst = Math.abs(totalConst);
      const rhsValue = parseFloat(valTotal) - totalConst;

      solutionMarkdown = `
1. **Planteamiento:** Sumamos las medidas de los ángulos consecutivos:
   $$ ${planteamientoStr} = ${valTotal}° $$

2. **Reducción:**
   $$ ${totalCoef}${varName} ${signConst} ${absConst} = ${valTotal} $$
   $$ ${totalCoef}${varName} = ${valTotal} ${totalConst >= 0 ? '-' : '+'} ${absConst} $$
   $$ ${totalCoef}${varName} = ${rhsValue} $$

3. **Despeje:**
   $$ ${varName} = ${valXSolution} $$

4. **Respuesta:**
   El valor de **${varName}** es $${valXSolution}$.
      `.trim();
    } else {
      solutionMarkdown = `
1. **Planteamiento:**
   $$ ${planteamientoStr} = ${valTotal}° $$

2. **Resolución:**
   $$ ${varName} = ${valXSolution} $$

3. **Respuesta:** El valor de **${varName}** es $${valXSolution}$$.
      `.trim();
    }
  } else {
    solutionMarkdown = `
1. **Planteamiento:**
   $$ \\text{Suma total} = ${valTotal} $$

2. **Resolución:**
   $$ x = ${valXSolution} $$

3. **Respuesta:**
   **${valXSolution}**
    `.trim();
  }
  console.log('🎯 displayX:', displayX);
  console.log('🎯 valXSolution:', valXSolution);

  return solutionMarkdown;
}

