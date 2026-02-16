import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculatePieChart(
  visualData: any,
  mathData: any,
): StatisticsResult | null {
  if (!visualData || visualData.type !== 'chart_pie') return null;
  if (!mathData || mathData.type !== 'pie_chart_problem') return null;

  const { total, variable, angle_given } = mathData.params;
  const sectors = visualData.data.sectors as Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;

  // Buscar el índice del sector que contiene la variable
  let variableIndex = -1;
  for (let i = 0; i < sectors.length; i++) {
    if (
      typeof sectors[i].value === 'string' &&
      (sectors[i].value as string).includes(variable)
    ) {
      variableIndex = i;
      break;
    }
  }
  if (variableIndex === -1) return null;

  const expr = sectors[variableIndex].value as string;
  const match = expr.match(/^(\d+)([a-zA-Z])$/);
  if (!match) return null;
  const coef = parseInt(match[1]);
  const varName = match[2];

  // Calcular la frecuencia del sector a partir del ángulo
  const freqCalculada = (angle_given * total) / 360;
  const correctValue = freqCalculada / coef;

  // Validaciones
  if (correctValue <= 0) return null;
  if (!Number.isInteger(correctValue) && correctValue % 1 !== 0) return null;
  if (correctValue > 50) return null;

  const steps = [
    `1. **Total de estudiantes:** $$ ${formatNumber(total)} $$`,
    `2. **Ángulo del sector que contiene la incógnita:** $$ ${angle_given}° $$`,
    `3. **Frecuencia de ese sector:** $$ \\frac{${angle_given}}{360} \\times ${total} = ${formatNumber(freqCalculada)} $$`,
    `4. **Expresión del sector:** $$ ${expr} = ${formatNumber(freqCalculada)} $$`,
    `5. **Resolvemos:** $$ ${coef}${varName} = ${formatNumber(freqCalculada)} \\rightarrow ${varName} = \\frac{${formatNumber(freqCalculada)}}{${coef}} = ${formatNumber(correctValue)} $$`,
    `6. **Respuesta:** El valor de **${varName}** es **${formatNumber(correctValue)}**.`,
  ];

  const solutionMarkdown = steps.join('\n');
  const visualUpdates = [{ index: variableIndex, value: freqCalculada }];

  return { solutionMarkdown, correctValue, visualUpdates };
}
