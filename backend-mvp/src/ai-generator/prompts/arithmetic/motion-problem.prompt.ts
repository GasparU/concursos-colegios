// src/ai-generator/prompts/arithmetic/motion-problem.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const MOTION_PROBLEM_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Aritmética (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('ARITHMETIC', difficulty)}

====================================================================
📌 PROBLEMAS DE MÓVILES (MRU)
====================================================================
- Debes generar problemas donde dos móviles se desplazan a velocidades constantes, con una incógnita (velocidad, tiempo o distancia).
- Los datos deben ser números enteros.
- Incluye una incógnita (por ejemplo, "x", "y", "k").
- NO resuelvas el problema. Solo proporciona los datos en 'math_data'.


🔥 REGLA ESTRICTA DE FORMATO:
- La incógnita (variable) debe aparecer en el enunciado **entre comillas simples** o **en negrita**. Ejemplo:
  "8 monedas de **a** soles equivalen a ..."  o  "8 monedas de 'a' soles equivalen a ..."
- NO escribas la variable sin formato. El backend rechazará problemas con formato incorrecto.


====================================================================
📌 FORMATO DE MATH_DATA
====================================================================
{
  "type": "motion_problem",
  "params": {
    "vehicles": [
      { "speed": 60, "time": 2 },
      { "speed": "x", "time": 2 }
    ],
    "total_distance": 240,
    "variable": "x"
  }
}

Nota: La distancia total es la suma de las distancias recorridas por ambos. El backend calculará x.

====================================================================
📌 EJEMPLO DE ENUNCIADO
====================================================================
"Dos autos parten de ciudades A y B a las 8:00 a.m. El primero va a 60 km/h, el segundo a x km/h. Si se encuentran a las 10:00 a.m. y la distancia entre A y B es de 240 km, halla x."

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
