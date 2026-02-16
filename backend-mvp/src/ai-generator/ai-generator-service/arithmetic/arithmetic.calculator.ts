// src/ai-generator/ai-generator-service/arithmetic/arithmetic.calculator.ts

import { StatisticsResult } from 'src/ai-generator/statistics.calculator';
import { calculateMcdProblem } from './calculators/mcd-mcm.calculator';

export function calculateArithmetic(mathData: any): StatisticsResult | null {
  if (!mathData) return null;

  switch (mathData.type) {
    case 'mcd_problem':
    case 'mcm_problem':
      return calculateMcdProblem(mathData);
    // otros casos (fracciones, etc.) se pueden añadir después
    default:
      console.warn(
        `Tipo de problema aritmético no soportado: ${mathData.type}`,
      );
      return null;
  }
}
