// src/ai-generator/prompts/arithmetic/arithmetic.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const ARITHMETIC_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Aritmética (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('ARITHMETIC', difficulty)}

====================================================================
📌 REGLAS GENERALES
====================================================================
- Los problemas pueden ser de: operaciones combinadas, fracciones, porcentajes, MCD, MCM, números primos, proporcionalidad, etc.
- La incógnita (x, y, k, etc.) debe aparecer en el enunciado.
- La solución debe tener pasos numerados, cada paso en su propia línea, con ecuaciones en $$...$$.
- Las fracciones deben escribirse como \frac{}{} dentro de $$.
- La respuesta final debe ser un número (entero o decimal simple) y debe estar entre las opciones.

🔥 REGLA ESTRICTA DE FORMATO:
- La incógnita (variable) debe aparecer en el enunciado **entre comillas simples** o **en negrita**. Ejemplo:
  "8 monedas de **a** soles equivalen a ..."  o  "8 monedas de 'a' soles equivalen a ..."
- NO escribas la variable sin formato. El backend rechazará problemas con formato incorrecto.

====================================================================
📌 EJEMPLOS DE PROBLEMAS Y SOLUCIONES
====================================================================

🔹 FRACCIONES EQUIVALENTES (4to grado)
Ejemplo: "Halla el valor de x si 2/3 = x/9"
Solución:
1. Planteamos la igualdad: $$\\frac{2}{3} = \\frac{x}{9}$$
2. Multiplicamos en cruz: $$2 \\times 9 = 3 \\times x \\rightarrow 18 = 3x$$
3. Despejamos: $$x = \\frac{18}{3} = 6$$
4. Respuesta: x = 6.

🔹 FRACCIONES DE UNA CANTIDAD
Ejemplo: "En una fábrica se producen 5k unidades. Si 2/3 son rojas y las rojas son 30, halla k."
Solución:
1. Rojas: $$\\frac{2}{3} \\times 5k = \\frac{10k}{3}$$
2. Igualamos: $$\\frac{10k}{3} = 30 \\rightarrow 10k = 90 \\rightarrow k = 9$$
3. Respuesta: k = 9.

🔹 OPERACIONES COMBINADAS
Ejemplo: "Calcula M si M = 12 + 3 × 4 – 18 ÷ 6"
Solución:
1. Primero multiplicación y división: $$3×4=12,\\; 18÷6=3$$
2. Luego suma y resta: $$12 + 12 - 3 = 21$$
3. Respuesta: M = 21.

====================================================================
📌 FORMATO DE SALIDA
====================================================================
- Incluye 'math_data' solo si es necesario (generalmente no). Puedes poner "math_data": { "type": "none" }.
- 'visual_data' puede ser { "type": "none" }.

====================================================================
📌 REGLAS PARA PROBLEMAS DE ARITMÉTICA (SIN GRÁFICOS)
====================================================================
- **NO incluyas ningún tipo de gráfico o visual_data.** Estos problemas son solo texto.
- En 'visual_data', debes poner **exactamente** { "type": "none" }.
- **NO escribas títulos como "Gráfico:" o "Diagrama:"** en el enunciado. El frontend no mostrará nada.
- El enunciado debe ser claro y contener todos los datos necesarios.




SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
