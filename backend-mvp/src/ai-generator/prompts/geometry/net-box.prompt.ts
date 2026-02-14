// src/ai-generator/prompts/geometry/net-box.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const NET_BOX_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

👇 FORMATO OBLIGATORIO PARA RED DE CAJA SIN TAPA:

9. **RED DE CAJA SIN TAPA**:
   - Usa "math_data" con type "net_box".
   - Parámetros: "net_dimensions" con "width", "height", "cut_square_side".
   - Ejemplo:
     {
       "type": "net_box",
       "params": {
          "net_dimensions": {
             "width": 28,
             "height": 24,
             "cut_square_side": 4
          }
       }
     }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
