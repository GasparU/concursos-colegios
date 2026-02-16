import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateLineChart(
  visualData: any,
  mathData: any,
): StatisticsResult | null {
  if (!visualData || visualData.type !== 'chart_line') return null;
  if (!mathData || mathData.type !== 'line_chart_problem') return null;

  const { mean, variable } = mathData.params;
  const labels = visualData.data.labels as string[];
  const values = visualData.data.values as (number | string)[];

  let variableIndex = -1;
  for (let i = 0; i < values.length; i++) {
    if (
      typeof values[i] === 'string' &&
      (values[i] as string).includes(variable)
    ) {
      variableIndex = i;
      break;
    }
  }
  if (variableIndex === -1) return null;

  const expr = values[variableIndex] as string;
  const match = expr.match(/^(\d+)([a-zA-Z])$/);
  if (!match) return null;
  const coef = parseInt(match[1]);
  const varName = match[2];

  let sumKnown = 0;
  for (let i = 0; i < values.length; i++) {
    if (i === variableIndex) continue;
    const v = values[i];
    if (typeof v === 'number') sumKnown += v;
    else return null;
  }

  const totalCount = values.length;
  const meanValue = parseFloat(mean);
  if (isNaN(meanValue)) return null;

  const totalSumNeeded = meanValue * totalCount;
  const freqCalculada = totalSumNeeded - sumKnown;
  const correctValue = freqCalculada / coef;

  if (correctValue <= 0) return null;
  if (correctValue > 50) return null;

  const steps = [
    `1. **Suma de valores conocidos:** $$ ${formatNumber(sumKnown)} $$`,
    `2. **Media dada:** $$ ${formatNumber(meanValue)} $$ para ${totalCount} datos`,
    `3. **Suma total necesaria:** $$ ${formatNumber(meanValue)} \\times ${totalCount} = ${formatNumber(totalSumNeeded)} $$`,
    `4. **Valor del punto con incógnita:** $$ ${formatNumber(totalSumNeeded)} - ${formatNumber(sumKnown)} = ${formatNumber(freqCalculada)} $$`,
    `5. **Expresión del punto:** $$ ${expr} = ${formatNumber(freqCalculada)} $$`,
    `6. **Resolvemos:** $$ ${coef}${varName} = ${formatNumber(freqCalculada)} \\rightarrow ${varName} = \\frac{${formatNumber(freqCalculada)}}{${coef}} = ${formatNumber(correctValue)} $$`,
    `7. **Respuesta:** El valor de **${varName}** es **${formatNumber(correctValue)}**.`,
  ];

  const solutionMarkdown = steps.join('\n');
  const visualUpdates = [{ index: variableIndex, value: freqCalculada }];

  return { solutionMarkdown, correctValue, visualUpdates };
}
