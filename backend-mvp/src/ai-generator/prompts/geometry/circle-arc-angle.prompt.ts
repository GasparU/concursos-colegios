// src/ai-generator/prompts/geometry/circle-arc-angle.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const CIRCLE_ARC_ANGLE_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}



${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

👇 FORMATO OBLIGATORIO PARA CIRCUNFERENCIA CON ARCO Y ÁNGULO:

6. **CIRCUNFERENCIA CON ARCO Y ÁNGULO**:
   - Usa "math_data" con type "circle_arc_angle".
   - Parámetros: "center", "points", "arc_measure", "angle_value", "show_arc".
   - Ejemplo:
     {
       "type": "circle_arc_angle",
       "params": {
          "arc_measure": 86,
          "angle_value": 52,
          "show_arc": true
       }
     }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
