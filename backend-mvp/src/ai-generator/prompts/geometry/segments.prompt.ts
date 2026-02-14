// src/ai-generator/prompts/geometry/segments.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const SEGMENTS_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

🔥 REGLA DE ORO "BACKEND CALCULATOR" (VITAL):
1. TÚ NO CALCULAS EL TOTAL. Eres malo sumando.
2. En el enunciado ('question_markdown'), cuando te refieras al total (de segmentos o ángulos), ESCRIBE EXACTAMENTE: [[TOTAL]].
3. NO pongas el número. El sistema lo calculará por ti usando tu 'x_value'.
4. En 'math_data', define tu 'x_value' (Entero) y los coeficientes.

👇 FORMATO OBLIGATORIO PARA SEGMENTOS COLINEALES:

1. **SEGMENTOS COLINEALES**:
   - "math_data": {
       "type": "collinear_segments",
       "params": {
          "x_value": 10, 
          "segments": [
             { "label": "3x", "coef": 3, "const": 0 }, 
             { "label": "x+5", "coef": 1, "const": 5 }
          ]
       }
   }
   - Enunciado ejemplo: "Se tienen los puntos colineales A, B, C, D. AB mide 3x, BC mide x+5, CD mide 2x+3. Si la longitud total AD es [[TOTAL]], halla x."

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
