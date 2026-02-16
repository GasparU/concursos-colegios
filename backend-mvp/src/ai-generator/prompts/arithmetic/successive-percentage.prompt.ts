// src/ai-generator/prompts/arithmetic/successive-percentage.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const SUCCESSIVE_PERCENTAGE_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Aritmética (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('ARITHMETIC', difficulty)}

====================================================================
📌 PROBLEMAS DE PORCENTAJES SUCESIVOS
====================================================================
- Debes generar problemas donde se apliquen aumentos o descuentos porcentuales en cadena, con una incógnita.
- Los porcentajes deben ser números enteros (10%, 20%, etc.).
- Incluye una incógnita en algún valor (precio inicial, final, o porcentaje).
- NO resuelvas el problema. Solo proporciona los datos en 'math_data'.


🔥 REGLA ESTRICTA DE FORMATO:
- La incógnita (variable) debe aparecer en el enunciado **entre comillas simples** o **en negrita**. Ejemplo:
  "8 monedas de **a** soles equivalen a ..."  o  "8 monedas de 'a' soles equivalen a ..."
- NO escribas la variable sin formato. El backend rechazará problemas con formato incorrecto.

====================================================================
📌 FORMATO DE MATH_DATA
====================================================================
{
  "type": "successive_percentage",
  "params": {
    "initial": 200,
    "changes": [
      { "type": "increase", "percent": 10 },
      { "type": "decrease", "percent": 10 }
    ],
    "final": "x",          // el resultado final es una incógnita (ej. "x")
    "variable": "x"
  }
}

Nota: El backend calculará el valor de x después de aplicar los cambios.

====================================================================
📌 EJEMPLO DE ENUNCIADO
====================================================================
"Un artículo cuesta S/200. Primero aumenta un 10% y luego se descuenta un 10%. ¿Cuál es el precio final? (Expresado como x)"

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
