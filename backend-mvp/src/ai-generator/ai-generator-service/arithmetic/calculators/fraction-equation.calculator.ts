// src/ai-generator/ai-generator-service/arithmetic/calculators/fraction-equation.calculator.ts

import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateFractionEquation(
  mathData: any,
): StatisticsResult | null {
  if (!mathData || mathData.type !== 'fraction_equation') return null;

  const { left, right, variable } = mathData.params;

  const parseSide = (
    side: any,
  ): { num: number; den: string | number; varPos: 'num' | 'den' | null } => {
    const num = side.numerator;
    const den = side.denominator;
    let varPos: 'num' | 'den' | null = null;
    if (typeof num === 'string' && num.includes(variable)) varPos = 'num';
    else if (typeof den === 'string' && den.includes(variable)) varPos = 'den';
    return { num: typeof num === 'number' ? num : NaN, den, varPos };
  };

  const leftSide = parseSide(left);
  const rightSide = parseSide(right);

  let varSide: 'left' | 'right' | null = null;
  if (leftSide.varPos) varSide = 'left';
  else if (rightSide.varPos) varSide = 'right';
  else return null;

  let xValue: number;
  let coef = 1;
  let constDen = 0;

  if (varSide === 'left') {
    if (leftSide.varPos === 'num') {
      const match = (left.num as string).match(/^(\d+)([a-zA-Z])$/);
      if (!match) return null;
      coef = parseInt(match[1]);
      const numRight = right.num as number;
      const denRight = right.den as number;
      const denLeft = left.den as number;
      xValue = (numRight * denLeft) / (coef * denRight);
    } else if (leftSide.varPos === 'den') {
      const expr = left.den as string;
      const match = expr.match(/^(\d*)([a-zA-Z])\s*\+\s*(\d+)$/);
      if (!match) return null;
      coef = match[1] ? parseInt(match[1]) : 1;
      constDen = parseInt(match[3]);
      const numLeft = left.num as number;
      const numRight = right.num as number;
      const denRight = right.den as number;
      const numerator = numLeft * denRight - numRight * constDen;
      xValue = numerator / (numRight * coef);
    } else return null;
  } else {
    if (rightSide.varPos === 'num') {
      const match = (right.num as string).match(/^(\d+)([a-zA-Z])$/);
      if (!match) return null;
      coef = parseInt(match[1]);
      const numLeft = left.num as number;
      const denLeft = left.den as number;
      const denRight = right.den as number;
      xValue = (numLeft * denRight) / (coef * denLeft);
    } else if (rightSide.varPos === 'den') {
      const expr = right.den as string;
      const match = expr.match(/^(\d*)([a-zA-Z])\s*\+\s*(\d+)$/);
      if (!match) return null;
      coef = match[1] ? parseInt(match[1]) : 1;
      constDen = parseInt(match[3]);
      const numLeft = left.num as number;
      const denLeft = left.den as number;
      const numRight = right.num as number;
      const numerator = numRight * denLeft - numLeft * constDen;
      xValue = numerator / (numLeft * coef);
    } else return null;
  }

  if (xValue <= 0) return null;

  const steps = [
    `1. **Planteamos la ecuación:**`,
    `   $$ \\frac{${left.num}}{${left.den}} = \\frac{${right.num}}{${right.den}} $$`,
    `2. **Multiplicamos en cruz:**`,
    `   $$ ${left.num} \\times ${right.den} = ${right.num} \\times ${left.den} $$`,
    `3. **Resolvemos la ecuación lineal:**`,
    `   $$ ${variable} = ${formatNumber(xValue)} $$`,
    `4. **Respuesta:** El valor de **${variable}** es **${formatNumber(xValue)}**.`,
  ];

  const solutionMarkdown = steps.join('\n\n');
  return { solutionMarkdown, correctValue: xValue };
}
