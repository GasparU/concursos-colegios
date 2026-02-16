// src/ai-generator/ai-generator-service/arithmetic/calculators/motion-problem.calculator.ts

import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

export function calculateMotionProblem(mathData: any): StatisticsResult | null {
  if (!mathData || mathData.type !== 'motion_problem') return null;

  const { vehicles, total_distance, variable } = mathData.params;

  let knownDistance = 0;
  let varCoef = 0;
  let varName = variable;
  let knownTime = 0;

  for (const v of vehicles) {
    if (typeof v.speed === 'number') {
      knownDistance += v.speed * v.time;
    } else if (typeof v.speed === 'string' && v.speed.includes(variable)) {
      const match = v.speed.match(/^(\d+)([a-zA-Z])$/);
      if (match) {
        varCoef = parseInt(match[1]);
        varName = match[2];
        knownTime = v.time;
      } else {
        return null;
      }
    }
  }

  if (varCoef === 0) return null;

  const xValue = (total_distance - knownDistance) / (varCoef * knownTime);

  if (xValue <= 0) return null;

  const steps = [
    `1. **Distancia recorrida por el vehículo con velocidad conocida:**`,
    `   $$ ${knownDistance} \\text{ km} $$`,
    `2. **Distancia que debe recorrer el otro vehículo:**`,
    `   $$ \\text{Total} - \\text{conocida} = ${total_distance} - ${knownDistance} = ${total_distance - knownDistance} \\text{ km} $$`,
    `3. **Velocidad del segundo vehículo:**`,
    `   $$ v = \\frac{\\text{distancia}}{\\text{tiempo}} = \\frac{${total_distance - knownDistance}}{${knownTime}} = ${(total_distance - knownDistance) / knownTime} \\text{ km/h} $$`,
    `4. **Pero esta velocidad es igual a ${varCoef}${varName}:**`,
    `   $$ ${varCoef}${varName} = ${(total_distance - knownDistance) / knownTime} $$`,
    `5. **Despejamos ${varName}:**`,
    `   $$ ${varName} = \\frac{${(total_distance - knownDistance) / knownTime}}{${varCoef}} = ${formatNumber(xValue)} $$`,
    `6. **Respuesta:** El valor de **${varName}** es **${formatNumber(xValue)}**.`,
  ];

  const solutionMarkdown = steps.join('\n\n');
  return { solutionMarkdown, correctValue: xValue };
}
