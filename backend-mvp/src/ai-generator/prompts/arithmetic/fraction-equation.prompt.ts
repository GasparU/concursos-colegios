// src/ai-generator/prompts/arithmetic/fraction-equation.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const FRACTION_EQUATION_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Aritmética (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('ARITHMETIC', difficulty)}

====================================================================
📌 PROBLEMAS DE ECUACIONES CON FRACCIONES
====================================================================
- Debes generar ecuaciones lineales donde la incógnita aparezca en el numerador o denominador de una fracción.
- Los números deben ser enteros pequeños (adecuados para la edad).
- Incluye una incógnita (por ejemplo, "x", "y", "k").
- NO resuelvas la ecuación. Solo proporciona la ecuación en 'math_data'.

🔥 REGLA ESTRICTA DE FORMATO:
- La incógnita (variable) debe aparecer en el enunciado **entre comillas simples** o **en negrita**. Ejemplo:
  "8 monedas de **a** soles equivalen a ..."  o  "8 monedas de 'a' soles equivalen a ..."
- NO escribas la variable sin formato. El backend rechazará problemas con formato incorrecto.

====================================================================
📌 FORMATO DE MATH_DATA
====================================================================
{
  "type": "fraction_equation",
  "params": {
    "left": { "numerator": 3, "denominator": "x+2" },
    "right": { "numerator": 1, "denominator": 4 },
    "variable": "x"
  }
}

Nota: El denominador puede ser una expresión lineal como "x+2" o "2x-1". El backend la resolverá.


====================================================================
📌 EJEMPLO DE ENUNCIADO
====================================================================
"Halla el valor de x si 3/(x+2) = 1/4."

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
