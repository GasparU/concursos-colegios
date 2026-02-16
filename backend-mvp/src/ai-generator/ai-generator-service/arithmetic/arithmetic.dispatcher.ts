// ... otros imports
import { StatisticsResult } from 'src/ai-generator/statistics.calculator';
import { calculateCompoundProportion } from './calculators/compound-proportion.calculator';
import { calculateFractionEquation } from './calculators/fraction-equation.calculator';
import { calculateFractionOfFraction } from './calculators/fraction-of-fraction.calculator';
import { calculateMcdProblem } from './calculators/mcd-mcm.calculator';
import { calculateMoneyExchange } from './calculators/money-exchange.calculator';
import { calculateMotionProblem } from './calculators/motion-problem.calculator';
import { calculateSuccessivePercentage } from './calculators/successive-percentage.calculator';
import { calculateSimpleExchange } from './calculators/simple-exchange.calculator';

export function calculateArithmetic(mathData: any): StatisticsResult | null {
  if (!mathData) return null;

  switch (mathData.type) {
    case 'mcd_problem':
    case 'mcm_problem':
      return calculateMcdProblem(mathData);
    case 'compound_proportion':
      return calculateCompoundProportion(mathData);
    case 'fraction_of_fraction':
      return calculateFractionOfFraction(mathData);
    case 'fraction_equation':
      return calculateFractionEquation(mathData);
    case 'successive_percentage':
      return calculateSuccessivePercentage(mathData);
    case 'money_exchange': // <--- NUEVO
      return calculateMoneyExchange(mathData);
    case 'motion_problem':
      return calculateMotionProblem(mathData);

    case 'money_exchange_simple':
      return calculateSimpleExchange(mathData);

    default:
      console.warn(`Tipo aritmético no soportado: ${mathData.type}`);
      return null;
  }
}
