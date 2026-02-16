// src/ai-generator/prompts/arithmetic/compound-proportion.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const COMPOUND_PROPORTION_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Aritmética (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('ARITHMETIC', difficulty)}

====================================================================
📌 PROBLEMAS DE PROPORCIONALIDAD COMPUESTA
====================================================================
- Debes generar problemas donde intervengan varias magnitudes (directa o inversamente proporcionales) y una incógnita.
- Los datos deben ser números enteros positivos.
- Incluye una incógnita (por ejemplo, "x", "y", "k") en una de las cantidades.
- NO resuelvas el problema. Solo proporciona los datos en 'math_data' y el enunciado.

🔥 REGLA ESTRICTA DE FORMATO:
- La incógnita (variable) debe aparecer en el enunciado **entre comillas simples** o **en negrita**. Ejemplo:
  "8 monedas de **a** soles equivalen a ..."  o  "8 monedas de 'a' soles equivalen a ..."
- NO escribas la variable sin formato. El backend rechazará problemas con formato incorrecto.

====================================================================
📌 FORMATO DE MATH_DATA
====================================================================
{
  "type": "compound_proportion",
  "params": {
    "left": [5, 4],          // valores conocidos del lado izquierdo (producto)
    "right": ["x", 6],       // valores del lado derecho, donde uno es la variable
    "result": 120,           // resultado conocido del lado izquierdo
    "target": 180,           // resultado conocido del lado derecho
    "variable": "x"
  }
}

Explicación: La ecuación es (5 * 4) / 120 = (x * 6) / 180. El backend despejará x.


====================================================================
📌 EJEMPLO DE ENUNCIADO
====================================================================
"Si 5 obreros en 4 días construyen 120 metros de pared, ¿cuántos obreros se necesitan para construir 180 metros en 6 días? (Expresa el resultado como x)"

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
