// src/ai-generator/ai-generator-service/arithmetic/calculators/mcd-mcm.calculator.ts

import { StatisticsResult } from "src/ai-generator/statistics.calculator";


function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

export function calculateMcdProblem(mathData: any): StatisticsResult | null {
  if (
    !mathData ||
    (mathData.type !== 'mcd_problem' && mathData.type !== 'mcm_problem')
  )
    return null;

  const { dimensions, total_parcels, variable } = mathData.params;

  // Extraer valores conocidos y detectar la variable
  let coef = 0;
  let varName = variable;
  let knownNumbers: number[] = [];
  let xCoefficient = 0;
  let totalAreaWithoutX = 0;

  for (const dim of dimensions) {
    const length = dim.length;
    const width = dim.width;

    const processDim = (val: any, other: number) => {
      if (typeof val === 'number') {
        totalAreaWithoutX += val * other;
      } else if (typeof val === 'string' && val.includes(varName)) {
        const match = val.match(/^(\d+)([a-zA-Z])$/);
        if (match) {
          coef = parseInt(match[1]);
          varName = match[2];
          xCoefficient += coef * other;
        } else {
          return null;
        }
      }
    };

    if (typeof length === 'number' && typeof width === 'number') {
      totalAreaWithoutX += length * width;
    } else if (typeof length === 'number' && typeof width === 'string') {
      processDim(width, length);
    } else if (typeof length === 'string' && typeof width === 'number') {
      processDim(length, width);
    } else {
      return null;
    }
  }

  if (xCoefficient === 0) return null;

  // Calcular MCD de las dimensiones conocidas (sin variable)
  for (const dim of dimensions) {
    if (typeof dim.length === 'number') knownNumbers.push(dim.length);
    if (typeof dim.width === 'number') knownNumbers.push(dim.width);
  }
  let gcdKnown =
    knownNumbers.length > 0
      ? knownNumbers.reduce((acc, val) => gcd(acc, val))
      : 1;

  // Asumimos que el lado de la parcela L = gcdKnown (hipótesis)
  const L = gcdKnown;

  // Ecuación: (totalAreaWithoutX + xCoefficient * x) / L^2 = total_parcels
  const numerator = total_parcels * L * L - totalAreaWithoutX;
  const xValue = numerator / xCoefficient;

  if (!Number.isInteger(xValue) || xValue <= 0) {
    console.warn('No se pudo obtener un x entero positivo');
    return null;
  }

  const steps = [
    `1. **Entendamos el problema:** Tenemos dos terrenos rectangulares. Para dividirlos en parcelas cuadradas iguales del mayor tamaño posible, el lado de cada parcela debe ser un divisor común de las dimensiones. El mayor de esos divisores es el **Máximo Común Divisor (MCD)**.`,
    `2. **Identificamos las dimensiones:**`,
    `   - Terreno 1: ${dimensions[0].length} m de largo y ${dimensions[0].width} m de ancho.`,
    `   - Terreno 2: ${dimensions[1].length} m de largo y ${dimensions[1].width} m de ancho.`,
    `3. **Calculamos el MCD de las dimensiones conocidas (sin la variable):**`,
    `   Las dimensiones conocidas son ${knownNumbers.join(', ')}. Su MCD es ${L}.`,
    `4. **El área total es:**`,
    `   $$ ${totalAreaWithoutX} + ${xCoefficient}${varName} $$`,
    `5. **Cada parcela tiene área L² = ${L}² = ${L * L}.**`,
    `6. **El número total de parcelas es ${total_parcels}, por lo tanto:**`,
    `   $$ \\frac{${totalAreaWithoutX} + ${xCoefficient}${varName}}{${L * L}} = ${total_parcels} $$`,
    `7. **Resolvemos:**`,
    `   $$ ${totalAreaWithoutX} + ${xCoefficient}${varName} = ${total_parcels * L * L} $$`,
    `   $$ ${xCoefficient}${varName} = ${total_parcels * L * L - totalAreaWithoutX} $$`,
    `   $$ ${varName} = \\frac{${total_parcels * L * L - totalAreaWithoutX}}{${xCoefficient}} = ${xValue} $$`,
    `8. **Respuesta:** El valor de **${varName}** es **${xValue}**.`,
  ];

  const solutionMarkdown = steps.join('\n\n');
  return { solutionMarkdown, correctValue: xValue };
}
