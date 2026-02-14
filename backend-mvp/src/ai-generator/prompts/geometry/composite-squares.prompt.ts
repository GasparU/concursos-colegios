// src/ai-generator/prompts/geometry/composite-squares.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const COMPOSITE_SQUARES_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

👇 FORMATO OBLIGATORIO PARA CUADRADOS COMPUESTOS:

8. **CUADRADOS COMPUESTOS**:
   - Usa "math_data" con type "composite_squares".
   - Define "squares": cada uno con label (ej "ABCD"), side, position (x,y).
   - Para región sombreada, usa "shaded_region" con "type": "polygon" y points.
   - Ejemplo:
     {
       "type": "composite_squares",
       "params": {
          "squares": [
             { "label": "ABCD", "side": 6, "position": { "x": 0, "y": 0 } },
             { "label": "EFGH", "side": 5, "position": { "x": 0.5, "y": 0.5 } },
             { "label": "IJKL", "side": 3, "position": { "x": 1.5, "y": 1.5 } }
          ],
          "shaded_region": {
             "type": "polygon",
             "points": [[0,6], [6,6], [6,0], [0,0], [1.5,1.5], [4.5,1.5], [4.5,4.5], [1.5,4.5]]
          }
       }
     }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
