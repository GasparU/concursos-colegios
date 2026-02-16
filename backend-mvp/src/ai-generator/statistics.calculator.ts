// src/ai-generator/ai-generator-service/statistics/statistics.calculator.ts

import { calculateBarChart } from './prompts/statistics/calculators/bar-chart.calculator';
import { calculateLineChart } from './prompts/statistics/calculators/line-chart.calculator';
import { calculatePieChart } from './prompts/statistics/calculators/pie-chart.calculator';
import { calculateProbability } from './prompts/statistics/calculators/probability.calculator';


export interface StatisticsResult {
  solutionMarkdown: string;
  correctValue: number;
  visualUpdates?: Array<{ index?: number; rowIndex?: number; value: number }>;
}

// Función auxiliar para formatear números a 2 decimales (o enteros sin decimales)
function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  // Redondear a 2 decimales y eliminar ceros innecesarios
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateMeanFromTable(
  visualData: any,
  mathData: any,
): StatisticsResult | null {
  // Validaciones básicas
  if (!visualData || visualData.type !== 'frequency_table') return null;
  if (!mathData || mathData.type !== 'mean_problem') return null;

  const table = visualData.data;
  const { mean, variable } = mathData.params;

  // Convertir mean a número
  const meanValue = parseFloat(mean);
  if (isNaN(meanValue)) return null;

  if (!table || !table.rows || !Array.isArray(table.rows)) return null;

  // Tipamos las filas como tuplas de dos elementos
  const rows = table.rows as Array<[number | string, number | string]>;

  const values: number[] = [];
  const frequencies: (number | string)[] = [];

  // Extraer valores y frecuencias
  for (const row of rows) {
    if (row.length < 2) continue;
    const val = parseFloat(row[0] as string);
    if (isNaN(val)) continue; // la incógnita debe estar en frecuencias, no en valores
    values.push(val);
    frequencies.push(row[1]);
  }

  // Buscar la posición de la variable en las frecuencias
  let variableIndex = -1;
  for (let i = 0; i < frequencies.length; i++) {
    const freq = frequencies[i];
    if (typeof freq === 'string' && freq.trim() === variable) {
      variableIndex = i;
      break;
    }
  }
  if (variableIndex === -1) return null; // no se encontró la variable

  // Calcular sumas para los datos conocidos (excluyendo la fila de la variable)
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
      if (isNaN(freqNum)) return null; // frecuencia inválida
    }

    sumValuesTimesFreq += values[i] * freqNum;
    sumFreq += freqNum;
  }

  const valVar = values[variableIndex]; // valor asociado a la frecuencia variable

  // Ecuación: (sumValuesTimesFreq + valVar * variable) / (sumFreq + variable) = meanValue
  const numerator = meanValue * sumFreq - sumValuesTimesFreq;
  const denominator = valVar - meanValue;
  if (denominator === 0) return null; // evitar división por cero

  const correctValue = numerator / denominator;

  // 🔥 VALIDACIÓN ESTRICTA
  if (correctValue <= 0) {
    console.warn(
      `📊 Frecuencia calculada (${correctValue}) no es válida (debe ser > 0).`,
    );
    return null;
  }
  if (!Number.isInteger(correctValue)) {
    console.warn(`📊 Frecuencia calculada (${correctValue}) no es entera.`);
    return null;
  }
  if (correctValue > 50) {
    console.warn(
      `📊 Frecuencia calculada (${correctValue}) es demasiado grande (>50).`,
    );
    return null;
  }

  // =========================================================
  // CONSTRUCCIÓN DE LA SOLUCIÓN CON PASOS Y LATEX
  // =========================================================

  const sumValuesTimesFreqStr = formatNumber(sumValuesTimesFreq);
  const sumFreqStr = formatNumber(sumFreq);
  const valVarStr = formatNumber(valVar);
  const meanValueStr = formatNumber(meanValue);
  const numeratorStr = formatNumber(numerator);
  const denominatorStr = formatNumber(denominator);
  const correctValueStr = formatNumber(correctValue);
  const productRight = meanValue * sumFreq;
  const productRightStr = formatNumber(productRight);

  // Expresión de la suma de productos conocidos
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

  return {
    solutionMarkdown,
    correctValue,
  };
}

export function calculateStatistics(
  mathData: any,
  visualData: any,
): StatisticsResult | null {
  if (!mathData) return null;

  switch (mathData.type) {
    case 'mean_problem':
      return calculateMeanFromTable(visualData, mathData);
    case 'pie_chart_problem':
      return calculatePieChart(visualData, mathData);
    case 'bar_chart_problem':
      return calculateBarChart(visualData, mathData);
    case 'line_chart_problem':
      return calculateLineChart(visualData, mathData);
    case 'probability_problem':
      return calculateProbability(visualData, mathData);
    default:
      console.warn(
        `Tipo de problema estadístico no soportado: ${mathData.type}`,
      );
      return null;
  }
}