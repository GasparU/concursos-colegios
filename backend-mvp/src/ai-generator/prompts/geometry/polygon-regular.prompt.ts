// src/ai-generator/prompts/geometry/polygon-regular.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const POLYGON_REGULAR_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

👇 FORMATOS OBLIGATORIOS PARA POLÍGONOS REGULARES:

3. **POLÍGONOS REGULARES**:
   - Usa "math_data" con type "polygon_regular".
   - Parámetros: "sides" (número de lados), "radius" (radio), "angles" (true para marcar ángulos).
   - Ejemplo (triángulo equilátero):
     {
       "type": "polygon_regular",
       "params": {
          "sides": 3,
          "radius": 4,
          "angles": true
       }
     }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
