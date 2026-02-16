import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateMeanFromTable(
  visualData: any,
  mathData: any,
): StatisticsResult | null {
  if (!visualData || visualData.type !== 'frequency_table') return null;
  if (!mathData || mathData.type !== 'mean_problem') return null;

  const table = visualData.data;
  const { mean, variable } = mathData.params;
  const meanValue = parseFloat(mean);
  if (isNaN(meanValue)) return null;

  if (!table || !table.rows || !Array.isArray(table.rows)) return null;

  const rows = table.rows as Array<[number | string, number | string]>;
  const values: number[] = [];
  const frequencies: (number | string)[] = [];

  for (const row of rows) {
    if (row.length < 2) continue;
    const val = parseFloat(row[0] as string);
    if (isNaN(val)) continue;
    values.push(val);
    frequencies.push(row[1]);
  }

  let variableIndex = -1;
  for (let i = 0; i < frequencies.length; i++) {
    const freq = frequencies[i];
    if (typeof freq === 'string' && freq.trim() === variable) {
      variableIndex = i;
      break;
    }
  }
  if (variableIndex === -1) return null;

  let sumValuesTimesFreq = 0;
  let sumFreq = 0;

  for (let i = 0; i < values.length; i++) {
    if (i === variableIndex) continue;
    const freq = frequencies[i];
    let freqNum: number;
    if (typeof freq === 'number') {
      freqNum = freq;
    } else {
      freqNum = parseFloat(freq);
      if (isNaN(freqNum)) return null;
    }
    sumValuesTimesFreq += values[i] * freqNum;
    sumFreq += freqNum;
  }

  const valVar = values[variableIndex];
  const numerator = meanValue * sumFreq - sumValuesTimesFreq;
  const denominator = valVar - meanValue;
  if (denominator === 0) return null;

  const correctValue = numerator / denominator;

  if (correctValue <= 0) return null;
  if (!Number.isInteger(correctValue)) return null;
  if (correctValue > 50) return null;

  const sumValuesTimesFreqStr = formatNumber(sumValuesTimesFreq);
  const sumFreqStr = formatNumber(sumFreq);
  const valVarStr = formatNumber(valVar);
  const meanValueStr = formatNumber(meanValue);
  const numeratorStr = formatNumber(numerator);
  const denominatorStr = formatNumber(denominator);
  const correctValueStr = formatNumber(correctValue);
  const productRight = meanValue * sumFreq;
  const productRightStr = formatNumber(productRight);

  const sumProductsParts: string[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i === variableIndex) continue;
    const freq = frequencies[i];
    const freqStr = typeof freq === 'number' ? formatNumber(freq) : freq;
    sumProductsParts.push(`${values[i]} \\times ${freqStr}`);
  }
  const sumProductsExpr = sumProductsParts.join(' + ');

  const steps = [
    `1. **Suma de productos (valor × frecuencia) para datos conocidos:**`,
    `$$ ${sumProductsExpr} = ${sumValuesTimesFreqStr} $$`,
    ``,
    `2. **Suma de frecuencias conocidas:** $$ ${sumFreqStr} $$`,
    ``,
    `3. **Planteamos la ecuación de la media:**`,
    `$$ \\frac{${sumValuesTimesFreqStr} + ${valVarStr} \\cdot ${variable}}{${sumFreqStr} + ${variable}} = ${meanValueStr} $$`,
    ``,
    `4. **Resolvemos:**`,
    `$$ ${sumValuesTimesFreqStr} + ${valVarStr}${variable} = ${meanValueStr}(${sumFreqStr} + ${variable}) $$`,
    `$$ ${sumValuesTimesFreqStr} + ${valVarStr}${variable} = ${productRightStr} + ${meanValueStr}${variable} $$`,
    `$$ ${valVarStr}${variable} - ${meanValueStr}${variable} = ${productRightStr} - ${sumValuesTimesFreqStr} $$`,
    `$$ (${valVarStr} - ${meanValueStr})${variable} = ${numeratorStr} $$`,
    `$$ ${variable} = \\frac{${numeratorStr}}{${denominatorStr}} = ${correctValueStr} $$`,
    ``,
    `5. **Respuesta:** El valor de **${variable}** es **${correctValueStr}**.`,
  ];

  const solutionMarkdown = steps.join('\n');
  const visualUpdates = [{ rowIndex: variableIndex, value: correctValue }];

  return { solutionMarkdown, correctValue, visualUpdates };
}
