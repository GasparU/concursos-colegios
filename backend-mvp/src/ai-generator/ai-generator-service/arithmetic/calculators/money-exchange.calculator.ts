// src/ai-generator/ai-generator-service/arithmetic/calculators/money-exchange.calculator.ts
import { StatisticsResult } from 'src/ai-generator/statistics.calculator';

function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Normaliza una expresión: elimina espacios, reemplaza × por *, etc.
 */
function normalizeExpression(expr: string): string {
  return expr
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/·/g, '*')
    .replace(/÷/g, '/');
}

/**
 * Parsea una expresión que puede contener la variable.
 * Devuelve { coef: número que multiplica a la variable, const: término independiente }
 */
function parseExpression(
  expr: string,
  variable: string,
): { coef: number; const: number } {
  const normalized = normalizeExpression(expr);
  // Separar por '+' o '-' (manteniendo el signo)
  const parts = normalized.split(/(?=[+-])/);
  let coef = 0;
  let constVal = 0;
  for (let part of parts) {
    if (part === '') continue;
    if (part.includes(variable)) {
      // Extraer coeficiente, ej: "10k" -> 10, "k" -> 1, "-5k" -> -5
      const match = part.match(/([+-]?\d*)([a-zA-Z])/);
      if (match) {
        const numPart = match[1];
        const c =
          numPart === '' || numPart === '+'
            ? 1
            : numPart === '-'
              ? -1
              : parseInt(numPart);
        coef += c;
      } else {
        return { coef: 0, const: 0 }; // error
      }
    } else {
      // Evaluar parte numérica (seguro porque solo números y operadores)
      try {
        // eslint-disable-next-line no-new-func
        const num = new Function(`return ${normalizeExpression(part)}`)();
        constVal += num;
      } catch (e) {
        return { coef: 0, const: 0 };
      }
    }
  }
  return { coef, const: constVal };
}

export function calculateMoneyExchange(mathData: any): StatisticsResult | null {
  if (!mathData || mathData.type !== 'money_exchange') return null;

  const { equations, variable } = mathData.params;
  const varName = variable;

  // Convertir cada ecuación en la forma: a·x + b = c·x + d
  const parsedEquations: {
    leftCoef: number;
    leftConst: number;
    rightCoef: number;
    rightConst: number;
  }[] = [];

  for (const eq of equations) {
    const left = parseExpression(eq.left, varName);
    const right = parseExpression(eq.right, varName);
    parsedEquations.push({
      leftCoef: left.coef,
      leftConst: left.const,
      rightCoef: right.coef,
      rightConst: right.const,
    });
  }

  if (parsedEquations.length === 0) return null;

  // Resolver el sistema: buscamos la primera ecuación que tenga coeficientes diferentes
  let xValue: number | null = null;
  for (const eq of parsedEquations) {
    if (eq.leftCoef !== eq.rightCoef) {
      xValue = (eq.rightConst - eq.leftConst) / (eq.leftCoef - eq.rightCoef);
      break;
    }
  }

  if (xValue === null) return null;

  // Validar que todas las ecuaciones sean consistentes con este valor
  for (const eq of parsedEquations) {
    const left = eq.leftCoef * xValue + eq.leftConst;
    const right = eq.rightCoef * xValue + eq.rightConst;
    if (Math.abs(left - right) > 0.0001) {
      console.warn(
        `Inconsistencia detectada: ${left} ≠ ${right} para x=${xValue}`,
      );
      return null;
    }
  }

  // Validar que el resultado sea positivo y razonable
  if (xValue <= 0 || xValue > 100) return null;

  // Construir solución paso a paso
  const steps = [
    `1. **Planteamos las equivalencias como ecuaciones:**`,
    ...equations.map((eq: any, i: number) => `   - ${eq.left} = ${eq.right}`),
    ``,
    `2. **Reescribimos cada ecuación en términos de ${varName}:**`,
  ];

  for (let i = 0; i < equations.length; i++) {
    const eq = parsedEquations[i];
    const signConstIzq = eq.leftConst >= 0 ? '+' : '-';
    const signConstDer = eq.rightConst >= 0 ? '+' : '-';
    steps.push(
      `   - $${eq.leftCoef}${varName} ${signConstIzq} ${Math.abs(eq.leftConst)} = ${eq.rightCoef}${varName} ${signConstDer} ${Math.abs(eq.rightConst)}$`,
    );
  }

  steps.push(``);
  steps.push(`3. **Resolvemos el sistema:**`);

  // Usar la primera ecuación con coeficientes diferentes
  const mainEq = parsedEquations.find((e) => e.leftCoef !== e.rightCoef);
  if (mainEq) {
    steps.push(
      `   - Agrupamos términos: $(${mainEq.leftCoef} - ${mainEq.rightCoef})${varName} = ${mainEq.rightConst} - ${mainEq.leftConst}$`,
    );
    steps.push(
      `   - $${mainEq.leftCoef - mainEq.rightCoef}${varName} = ${mainEq.rightConst - mainEq.leftConst}$`,
    );
    steps.push(
      `   - $${varName} = \\frac{${mainEq.rightConst - mainEq.leftConst}}{${mainEq.leftCoef - mainEq.rightCoef}} = ${formatNumber(xValue)}$`,
    );
  }

  steps.push(``);
  steps.push(`4. **Verificamos en la otra ecuación:**`);
  for (let i = 1; i < parsedEquations.length; i++) {
    const eq = parsedEquations[i];
    const leftVal = eq.leftCoef * xValue + eq.leftConst;
    const rightVal = eq.rightCoef * xValue + eq.rightConst;
    steps.push(
      `   - $${eq.leftCoef}${varName} ${eq.leftConst >= 0 ? '+' : '-'} ${Math.abs(eq.leftConst)} = ${leftVal}$, $${eq.rightCoef}${varName} ${eq.rightConst >= 0 ? '+' : '-'} ${Math.abs(eq.rightConst)} = ${rightVal}$ → $${leftVal} = ${rightVal}$ (correcto)`,
    );
  }

  steps.push(``);
  steps.push(
    `5. **Respuesta:** El valor de **${varName}** es **${formatNumber(xValue)}**.`,
  );

  const solutionMarkdown = steps.join('\n');

  return {
    solutionMarkdown,
    correctValue: xValue,
  };
}
