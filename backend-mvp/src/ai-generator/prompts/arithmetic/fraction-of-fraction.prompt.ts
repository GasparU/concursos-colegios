// src/ai-generator/prompts/arithmetic/fraction-of-fraction.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const FRACTION_OF_FRACTION_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Aritmética (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('ARITHMETIC', difficulty)}

====================================================================
📌 PROBLEMAS DE FRACCIÓN DE UNA FRACCIÓN
====================================================================
- Debes generar problemas donde una cantidad sea una fracción de otra, y esta a su vez sea fracción de un total, con una incógnita.
- Los datos deben ser números enteros positivos.
- Incluye una incógnita (por ejemplo, "x", "y", "k") en alguna de las cantidades.
- NO resuelvas el problema. Solo proporciona los datos en 'math_data'.


🔥 REGLA ESTRICTA DE FORMATO:
- La incógnita (variable) debe aparecer en el enunciado **entre comillas simples** o **en negrita**. Ejemplo:
  "8 monedas de **a** soles equivalen a ..."  o  "8 monedas de 'a' soles equivalen a ..."
- NO escribas la variable sin formato. El backend rechazará problemas con formato incorrecto.


====================================================================
📌 FORMATO DE MATH_DATA
====================================================================
{
  "type": "fraction_of_fraction",
  "params": {
    "total": 300,               // número total (puede ser un número)
    "fraction1": "3/5",         // primera fracción
    "fraction2": "2/3",         // segunda fracción
    "result": "4x",             // el resultado de aplicar las dos fracciones (expresado con variable)
    "variable": "x"
  }
}

Explicación: (3/5)*(2/3)*total = 4x. El backend calculará x.

====================================================================
📌 EJEMPLO DE ENUNCIADO
====================================================================
"En una escuela, 3/5 de los estudiantes son mujeres. De ellas, 2/3 usan lentes. Si el número de mujeres que usan lentes es 4x, ¿cuántos estudiantes hay en total?"

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
