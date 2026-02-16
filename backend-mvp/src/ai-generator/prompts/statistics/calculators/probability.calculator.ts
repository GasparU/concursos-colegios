import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateProbability(
  visualData: any,
  mathData: any,
): StatisticsResult | null {
  if (!mathData || mathData.type !== 'probability_problem') return null;

  const { total, favorable, variable, relation, probability, coef } =
    mathData.params;

  // Si se da la probabilidad, calcular la variable
  if (probability !== undefined) {
    const p = parseFloat(probability);
    if (isNaN(p)) return null;
    const totalNum = parseFloat(total);
    if (isNaN(totalNum)) return null;
    const casosFavorables = p * totalNum;
    const coefNum = coef || 1;
    const correctValue = casosFavorables / coefNum;

    // Validaciones
    if (correctValue <= 0) return null;
    if (!Number.isInteger(correctValue) && correctValue % 1 !== 0) return null;
    if (correctValue > 50) return null;

    const steps = [
      `1. **Total de casos:** $$ ${formatNumber(totalNum)} $$`,
      `2. **Probabilidad dada:** $$ ${p} $$`,
      `3. **Número de casos favorables:** $$ ${p} \\times ${formatNumber(totalNum)} = ${formatNumber(casosFavorables)} $$`,
      `4. **Expresión de los casos favorables:** $$ ${coefNum}${variable} = ${formatNumber(casosFavorables)} $$`,
      `5. **Resolvemos:** $$ ${variable} = \\frac{${formatNumber(casosFavorables)}}{${coefNum}} = ${formatNumber(correctValue)} $$`,
      `6. **Respuesta:** El valor de **${variable}** es **${formatNumber(correctValue)}**.`,
    ];

    const solutionMarkdown = steps.join('\n');
    return { solutionMarkdown, correctValue };
  }

  return null;
}
