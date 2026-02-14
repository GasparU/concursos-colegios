// src/ai-generator/prompts/geometry/composite-3d.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const COMPOSITE_3D_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

👇 FORMATO OBLIGATORIO PARA SÓLIDO COMPUESTO EN ISOMÉTRICO:

11. **SÓLIDO COMPUESTO EN ISOMÉTRICO**:
    - Usa "math_data" con type "composite_3d_solid".
    - Define "solid_parts" (cada uno con shape, dimensions, position).
    - Ejemplo (volumen L):
      {
         "type": "composite_3d_solid",
         "params": {
            "solid_parts": [
               { "shape": "prism", "dimensions": { "length": 10, "width": 4, "height": 5 }, "position": { "x": 0, "y": 0, "z": 0 } },
               { "shape": "prism", "dimensions": { "length": 4, "width": 8, "height": 5 }, "position": { "x": 10, "y": 0, "z": 0 } }
            ],
            "isometric_angle": 30
         }
      }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
