// src/ai-generator/ai-generator-service/arithmetic/calculators/simple-exchange.calculator.ts
import { StatisticsResult } from 'src/ai-generator/statistics.calculator';

function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateSimpleExchange(
  mathData: any,
): StatisticsResult | null {
  if (!mathData || mathData.type !== 'money_exchange_simple') return null;

  const { equation, variable } = mathData.params;
  const left = equation.left;
  const right = equation.right;

  // Parsear left: debe ser de la forma "ax" donde a es un número
  const match = left.match(/^(\d+)([a-zA-Z])$/);
  if (!match) return null;

  const coef = parseInt(match[1]);
  const varName = match[2];
  const rightNum = parseFloat(right);
  if (isNaN(rightNum)) return null;

  const correctValue = rightNum / coef;

  // Validaciones
  if (correctValue <= 0 || correctValue > 100) return null;

  // Construir solución paso a paso
  const steps = [
    `1. **Planteamos la ecuación:** $${coef}${varName} = ${rightNum}$`,
    `2. **Despejamos:** $${varName} = \\frac{${rightNum}}{${coef}} = ${formatNumber(correctValue)}$`,
    `3. **Respuesta:** El valor de **${varName}** es **${formatNumber(correctValue)}**.`,
  ];

  const solutionMarkdown = steps.join('\n\n');

  return {
    solutionMarkdown,
    correctValue,
  };
}
