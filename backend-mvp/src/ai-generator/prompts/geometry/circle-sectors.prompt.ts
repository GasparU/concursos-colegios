// src/ai-generator/prompts/geometry/circle-sectors.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const CIRCLE_SECTORS_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

👇 FORMATO OBLIGATORIO PARA CÍRCULO DIVIDIDO EN SECTORES (PIZZA):

5. **CÍRCULO DIVIDIDO EN SECTORES**:
   - Usa "math_data" con type "circle_sectors".
   - Parámetros: "radius", "sector_labels" (array con "angle" y opcional "label").
   - Ejemplo:
     {
       "type": "circle_sectors",
       "params": {
          "radius": 4,
          "sector_labels": [
             { "angle": 120, "label": "40°" },
             { "angle": 120, "label": "40°" },
             { "angle": 120, "label": "40°" }
          ]
       }
     }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
