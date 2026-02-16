// src/ai-generator/ai-generator-service/arithmetic/calculators/fraction-of-fraction.calculator.ts

import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateFractionOfFraction(
  mathData: any,
): StatisticsResult | null {
  if (!mathData || mathData.type !== 'fraction_of_fraction') return null;

  const { total, fraction1, fraction2, result, variable } = mathData.params;

  const parseFraction = (frac: string) => {
    const parts = frac.split('/');
    return { num: parseInt(parts[0]), den: parseInt(parts[1]) };
  };

  const f1 = parseFraction(fraction1);
  const f2 = parseFraction(fraction2);

  let coef = 1;
  let varName = variable;

  if (typeof result === 'string' && result.includes(variable)) {
    const match = result.match(/^(\d+)([a-zA-Z])$/);
    if (!match) return null;
    coef = parseInt(match[1]);
    varName = match[2];
  } else {
    return null;
  }

  const totalNum = typeof total === 'number' ? total : parseFloat(total);
  if (isNaN(totalNum)) return null;

  const left = (f1.num * f2.num * totalNum) / (f1.den * f2.den);
  const xValue = left / coef;

  if (xValue <= 0) return null;

  const steps = [
    `1. **Calculamos la fracción del total que representa la cantidad resultante:**`,
    `   $$ \\frac{${f1.num}}{${f1.den}} \\times \\frac{${f2.num}}{${f2.den}} = \\frac{${f1.num * f2.num}}{${f1.den * f2.den}} $$`,
    `2. **Aplicamos esta fracción al total de estudiantes (${totalNum}):**`,
    `   $$ \\frac{${f1.num * f2.num}}{${f1.den * f2.den}} \\times ${totalNum} = ${left} $$`,
    `3. **Este resultado es igual a ${coef}${varName}:**`,
    `   $$ ${coef}${varName} = ${left} $$`,
    `4. **Despejamos ${varName}:**`,
    `   $$ ${varName} = \\frac{${left}}{${coef}} = ${formatNumber(xValue)} $$`,
    `5. **Respuesta:** El valor de **${varName}** es **${formatNumber(xValue)}**.`,
  ];

  const solutionMarkdown = steps.join('\n\n');
  return { solutionMarkdown, correctValue: xValue };
}
