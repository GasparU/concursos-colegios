// src/ai-generator/ai-generator-service/arithmetic/calculators/successive-percentage.calculator.ts

import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateSuccessivePercentage(
  mathData: any,
): StatisticsResult | null {
  if (!mathData || mathData.type !== 'successive_percentage') return null;

  const { initial, changes, final, variable } = mathData.params;

  let current = initial;
  for (const change of changes) {
    if (change.type === 'increase') {
      current = current * (1 + change.percent / 100);
    } else if (change.type === 'decrease') {
      current = current * (1 - change.percent / 100);
    } else {
      return null;
    }
  }

  if (typeof final === 'string' && final.includes(variable)) {
    const match = final.match(/^(\d+)([a-zA-Z])$/);
    if (!match) return null;
    const coef = parseInt(match[1]);
    const varName = match[2];
    const xValue = current / coef;

    if (xValue <= 0) return null;

    const steps = [
      `1. **Precio inicial:** S/${initial}`,
      `2. **Aplicamos el primer cambio:**`,
      `   ${changes[0].type === 'increase' ? 'Aumento' : 'Descuento'} del ${changes[0].percent}%:`,
      `   $$ ${initial} \\times ${changes[0].type === 'increase' ? '(1 + ' + changes[0].percent / 100 + ')' : '(1 - ' + changes[0].percent / 100 + ')'} = ${current.toFixed(2)} $$`,
      `3. **Aplicamos el segundo cambio:**`,
      `   ${changes[1].type === 'increase' ? 'Aumento' : 'Descuento'} del ${changes[1].percent}%:`,
      `   $$ ${current.toFixed(2)} \\times ${changes[1].type === 'increase' ? '(1 + ' + changes[1].percent / 100 + ')' : '(1 - ' + changes[1].percent / 100 + ')'} = ${current.toFixed(2)} $$`,
      `4. **Este resultado es igual a ${coef}${varName}:**`,
      `   $$ ${coef}${varName} = ${current} $$`,
      `5. **Despejamos ${varName}:**`,
      `   $$ ${varName} = \\frac{${current}}{${coef}} = ${formatNumber(xValue)} $$`,
      `6. **Respuesta:** El valor de **${varName}** es **${formatNumber(xValue)}**.`,
    ];
    const solutionMarkdown = steps.join('\n\n');
    return { solutionMarkdown, correctValue: xValue };
  }
  return null;
}
