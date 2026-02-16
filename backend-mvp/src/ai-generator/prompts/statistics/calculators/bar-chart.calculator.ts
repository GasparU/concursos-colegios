import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateBarChart(
  visualData: any,
  mathData: any,
): StatisticsResult | null {
  if (!visualData || visualData.type !== 'chart_bar') return null;
  if (!mathData || mathData.type !== 'bar_chart_problem') return null;

  const { total, mean, variable } = mathData.params;
  const labels = visualData.data.labels as string[];
  const values = visualData.data.values as (number | string)[];

  // Buscar la posición de la variable
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

  // Extraer coeficiente (ej. "6k" -> 6)
  const expr = values[variableIndex] as string;
  const match = expr.match(/^(\d+)([a-zA-Z])$/);
  if (!match) return null;
  const coef = parseInt(match[1]);
  const varName = match[2];

  // Sumar valores conocidos
  let sumKnown = 0;
  for (let i = 0; i < values.length; i++) {
    if (i === variableIndex) continue;
    const v = values[i];
    if (typeof v === 'number') {
      sumKnown += v;
    } else {
      return null; // no debe haber otra string
    }
  }

  const totalCount = values.length;
  let freqCalculada: number;
  let solutionSteps: string[];

  if (total !== undefined) {
    const totalValue = parseFloat(total);
    if (isNaN(totalValue)) return null;
    freqCalculada = totalValue - sumKnown;

    solutionSteps = [
      `1. **Suma de valores conocidos:** $$ ${formatNumber(sumKnown)} $$`,
      `2. **Total dado:** $$ ${formatNumber(totalValue)} $$`,
      `3. **Valor del sector con incógnita:** $$ ${formatNumber(totalValue)} - ${formatNumber(sumKnown)} = ${formatNumber(freqCalculada)} $$`,
      `4. **Expresión del sector:** $$ ${expr} = ${formatNumber(freqCalculada)} $$`,
      `5. **Resolvemos:** $$ ${coef}${varName} = ${formatNumber(freqCalculada)} \\rightarrow ${varName} = \\frac{${formatNumber(freqCalculada)}}{${coef}} = ${formatNumber(freqCalculada / coef)} $$`,
      `6. **Respuesta:** El valor de **${varName}** es **${formatNumber(freqCalculada / coef)}**.`,
    ];
  } else if (mean !== undefined) {
    const meanValue = parseFloat(mean);
    if (isNaN(meanValue)) return null;
    const totalSumNeeded = meanValue * totalCount;
    freqCalculada = totalSumNeeded - sumKnown;

    solutionSteps = [
      `1. **Suma de valores conocidos:** $$ ${formatNumber(sumKnown)} $$`,
      `2. **Media dada:** $$ ${formatNumber(meanValue)} $$ para ${totalCount} datos`,
      `3. **Suma total necesaria:** $$ ${formatNumber(meanValue)} \\times ${totalCount} = ${formatNumber(totalSumNeeded)} $$`,
      `4. **Valor del sector con incógnita:** $$ ${formatNumber(totalSumNeeded)} - ${formatNumber(sumKnown)} = ${formatNumber(freqCalculada)} $$`,
      `5. **Expresión del sector:** $$ ${expr} = ${formatNumber(freqCalculada)} $$`,
      `6. **Resolvemos:** $$ ${coef}${varName} = ${formatNumber(freqCalculada)} \\rightarrow ${varName} = \\frac{${formatNumber(freqCalculada)}}{${coef}} = ${formatNumber(freqCalculada / coef)} $$`,
      `7. **Respuesta:** El valor de **${varName}** es **${formatNumber(freqCalculada / coef)}**.`,
    ];
  } else {
    return null;
  }

  const correctValue = freqCalculada / coef;

  // Validación: solo aseguramos que sea positivo
  if (correctValue <= 0) {
    console.warn(`📊 Valor calculado (${correctValue}) no es positivo.`);
    return null;
  }
  // Permitimos decimales, pero si es demasiado grande, rechazamos
  if (correctValue > 1000) {
    console.warn(`📊 Valor calculado (${correctValue}) demasiado grande.`);
    return null;
  }

  const solutionMarkdown = solutionSteps.join('\n');
  const visualUpdates = [{ index: variableIndex, value: freqCalculada }];

  return { solutionMarkdown, correctValue, visualUpdates };
}
