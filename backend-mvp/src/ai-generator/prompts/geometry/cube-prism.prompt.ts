// src/ai-generator/prompts/geometry/cube-prism.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const CUBE_PRISM_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

👇 FORMATOS OBLIGATORIOS PARA SÓLIDOS (CUBOS Y PRISMAS):

2. **CUBOS Y PRISMAS (3D)**:
   - Usa "math_data" con type "solid_cube" o "solid_prism".
   - Define el lado o dimensiones.
   - Ejemplo para cubo:
     {
       "type": "solid_cube",
       "params": { "side": 4, "label": "L" }
     }
   - Ejemplo para prisma:
     {
       "type": "solid_prism",
       "params": { "length": 5, "width": 3, "height": 2 }
     }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
