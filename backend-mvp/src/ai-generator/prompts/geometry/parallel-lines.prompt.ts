// src/ai-generator/prompts/geometry/parallel-lines.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const PARALLEL_LINES_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

👇 FORMATO OBLIGATORIO PARA RECTAS PARALELAS Y BISECTRICES:

7. **RECTAS PARALELAS Y BISECTRICES**:
   - Usa "math_data" con type "parallel_lines_bisector".
   - Define "lines" (cada una con label, direction, offset).
   - Opcional "bisector".
   - Ejemplo:
     {
       "type": "parallel_lines_bisector",
       "params": {
          "lines": [
             { "label": "P", "direction": "horizontal", "offset": 1 },
             { "label": "Q", "direction": "horizontal", "offset": -1 }
          ],
          "bisector": {
             "vertex": "B",
             "lines": ["AB", "BC"],
             "angle_label": "x"
          }
       }
     }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
