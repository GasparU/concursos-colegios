// src/ai-generator/prompts/arithmetic/mcd-mcm.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const MCD_MCM_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Aritmética (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('ARITHMETIC', difficulty)}

====================================================================
📌 PROBLEMAS DE MÁXIMO COMÚN DIVISOR (MCD) Y MÍNIMO COMÚN MÚLTIPLO (MCM)
====================================================================
- Debes generar problemas que involucren el cálculo del MCD o MCM con una incógnita.
- Los datos deben ser números enteros positivos, adecuados para la edad (por ejemplo, para 4to grado, números hasta 100).
- Incluye una incógnita (por ejemplo, "x", "y", "k") en las dimensiones o cantidades.
- NO resuelvas el problema. Solo proporciona los datos en 'math_data' y el enunciado en 'question_markdown'.
- El backend se encargará de calcular la solución correcta y generar los pasos.


🔥 REGLA ESTRICTA DE FORMATO:
- La incógnita (variable) debe aparecer en el enunciado **entre comillas simples** o **en negrita**. Ejemplo:
  "8 monedas de **a** soles equivalen a ..."  o  "8 monedas de 'a' soles equivalen a ..."
- NO escribas la variable sin formato. El backend rechazará problemas con formato incorrecto.


====================================================================
📌 FORMATO DE MATH_DATA
====================================================================
{
  "type": "mcd_problem",   // o "mcm_problem"
  "params": {
    "dimensions": [
      { "length": "4y", "width": 60 },
      { "length": 80, "width": "4y" }
    ],
    "total_parcels": 130,   // el número total de parcelas (dato del problema)
    "variable": "y"
  }
}

Nota: Las dimensiones pueden ser arrays de objetos con "length" y "width". También pueden ser listas de números si es un problema de MCD de varios números.

====================================================================
📌 EJEMPLOS DE ENUNCIADOS (question_markdown)
====================================================================
- "Un agricultor tiene dos terrenos rectangulares: uno de 4y metros de largo por 60 metros de ancho, y otro de 80 metros de largo por 4y metros de ancho. Quiere dividirlos en parcelas cuadradas del mayor tamaño posible, todas iguales, sin que sobre terreno. Si el número total de parcelas obtenidas es 130, halla el valor de y."

- "Se tienen tres varillas de longitudes 12, 18 y 24 cm. Se quieren cortar en trozos iguales del mayor tamaño posible. Si la longitud de cada trozo es x cm, ¿cuál es el valor de x?"

- "Dos campanas suenan cada 8 y 12 minutos respectivamente. Si hoy sonaron juntas a las 8:00 a.m., ¿cuántos minutos deben pasar para que vuelvan a sonar juntas? Expresa el resultado en términos de x."

====================================================================
📌 REGLAS DE VISUAL_DATA
====================================================================
- No incluyas gráficos. Usa "visual_data": { "type": "none" }.

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
