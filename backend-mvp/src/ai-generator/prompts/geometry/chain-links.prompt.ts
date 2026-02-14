// src/ai-generator/prompts/geometry/chain-links.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const CHAIN_LINKS_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

👇 FORMATO OBLIGATORIO PARA CADENA DE ESLABONES:

10. **CADENA DE ESLABONES**:
    - Usa "math_data" con type "chain_links".
    - Parámetros: "link_length", "link_width", "num_links", opcional "total_length_label".
    - Ejemplo:
      {
         "type": "chain_links",
         "params": {
            "link_length": 2,
            "link_width": 1.5,
            "num_links": 5,
            "total_length_label": "22 cm"
         }
      }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
