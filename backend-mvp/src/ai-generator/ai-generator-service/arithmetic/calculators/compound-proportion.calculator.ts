// src/ai-generator/ai-generator-service/arithmetic/calculators/compound-proportion.calculator.ts

import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateCompoundProportion(
  mathData: any,
): StatisticsResult | null {
  if (!mathData || mathData.type !== 'compound_proportion') return null;

  const { left, right, result, target, variable } = mathData.params;

  // left y right son arrays de valores (números o strings con variable)
  let leftProduct = 1;
  for (const val of left) {
    if (typeof val === 'number') leftProduct *= val;
    else return null;
  }

  let rightProduct = 1;
  let coef = 1;
  let varName = variable;
  for (const val of right) {
    if (typeof val === 'number') {
      rightProduct *= val;
    } else if (typeof val === 'string' && val.includes(variable)) {
      const match = val.match(/^(\d+)([a-zA-Z])$/);
      if (match) {
        coef = parseInt(match[1]);
        varName = match[2];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  // Ecuación: leftProduct / result = (coef * x * rightProduct) / target
  // => leftProduct * target = result * coef * x * rightProduct
  const xValue = (leftProduct * target) / (result * coef * rightProduct);

  if (xValue <= 0) return null;

  const steps = [
    `1. **Planteamos la proporción compuesta:**`,
    `   $$ \\frac{${leftProduct}}{${result}} = \\frac{${coef}${varName} \\times ${rightProduct}}{${target}} $$`,
    `2. **Multiplicamos en cruz:**`,
    `   $$ ${leftProduct} \\times ${target} = ${result} \\times ${coef}${varName} \\times ${rightProduct} $$`,
    `   $$ ${leftProduct * target} = ${result * coef * rightProduct} ${varName} $$`,
    `3. **Despejamos ${varName}:**`,
    `   $$ ${varName} = \\frac{${leftProduct * target}}{${result * coef * rightProduct}} = ${formatNumber(xValue)} $$`,
    `4. **Respuesta:** El valor de **${varName}** es **${formatNumber(xValue)}**.`,
  ];

  const solutionMarkdown = steps.join('\n\n');
  return { solutionMarkdown, correctValue: xValue };
}
