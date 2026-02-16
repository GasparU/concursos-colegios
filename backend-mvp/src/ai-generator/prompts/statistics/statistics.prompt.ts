import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const STATISTICS_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  return `
ROL: Experto en Estadística y Probabilidad (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES('STATISTICS', difficulty)}

====================================================================
📌 REGLAS ESTRICTAS (LEER CON ATENCIÓN)
====================================================================

1. **ENUNCIADO**: Escribe solo el texto del problema. NO incluyas títulos como "Gráfico de barras" ni listas de valores. Los datos deben ir en el texto, por ejemplo:
   "Las ventas del lunes fueron 18, martes 20, miércoles 25, jueves 30, viernes 6k, sábado 15, domingo 12. Si el total de ventas de la semana fue 165 mil soles, halla k."
   - En el enunciado, cuando menciones la incógnita, escríbela entre comillas simples o en negrita para que se distinga, por ejemplo: "8 monedas de **a** soles equivalen" o "8 monedas de 'a' soles equivalen".

2. **VISUAL_DATA**: Siempre incluye 'visual_data' con el gráfico o tabla correspondiente. Usa los formatos exactos de los ejemplos abajo.

3. **SOLUCIÓN**: Debe tener PASOS NUMERADOS, cada paso en una línea separada, con ecuaciones en $$...$$. La respuesta final debe ser un **número entero**. Ejemplo:
   1. **Suma de valores conocidos:** $$18 + 20 + 25 + 30 + 15 + 12 = 120$$
   2. **Total dado:** $$165$$
   3. **Ecuación:** $$120 + 6k = 165$$
   4. **Resolvemos:** $$6k = 45 \rightarrow k = 7.5$$
   **NO uses decimales en la respuesta final** (a menos que el problema lo exija). En este ejemplo, k sería 7.5, pero para que sea entero, cambia los números: por ejemplo, que dé k=5.

4. **OPCIONES**: Genera 5 opciones (A, B, C, D, E) con el valor correcto (entero) y cuatro distractores lógicos.

====================================================================
📊 FORMATOS DE VISUAL_DATA (COPIA EXACTA)
====================================================================

📋 TABLA DE FRECUENCIA (media):
"visual_data": {
  "type": "frequency_table",
  "data": {
    "headers": ["Edad (años)", "Frecuencia"],
    "rows": [[10,4], [11,6], [12,8], [13,"m"], [14,2]],
    "caption": "Distribución de edades"
  }
}
"math_data": { "type": "mean_problem", "params": { "mean": 12.5, "variable": "m" } }

📊 GRÁFICO DE BARRAS:
"visual_data": {
  "type": "chart_bar",
  "data": {
    "labels": ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"],
    "values": [18,20,25,30,"6k",15,12],
    "title": "Ventas diarias (miles de soles)"
  }
}
"math_data": { "type": "bar_chart_problem", "params": { "total": 165, "variable": "k" } }

🍰 GRÁFICO CIRCULAR:
"visual_data": {
  "type": "chart_pie",
  "data": {
    "sectors": [
      { "label": "Fútbol", "value": "7a", "color": "#FF6B6B" },
      { "label": "Vóley", "value": 10, "color": "#4ECDC4" },
      { "label": "Básquet", "value": 8, "color": "#FFD166" },
      { "label": "Natación", "value": 5, "color": "#06D6A0" }
    ],
    "title": "Deportes favoritos"
  }
}
"math_data": { "type": "pie_chart_problem", "params": { "total": 35, "variable": "a", "angle_given": 144 } }

📈 GRÁFICO DE LÍNEAS:
"visual_data": {
  "type": "chart_line",
  "data": {
    "labels": ["Ene", "Feb", "Mar", "Abr"],
    "values": [10, "2x", 15, 12],
    "title": "Temperaturas mensuales"
  }
}
"math_data": { "type": "line_chart_problem", "params": { "mean": 12.5, "variable": "x" } }

🎲 PROBABILIDAD:
"math_data": {
  "type": "probability_problem",
  "params": {
    "total": 30,
    "variable": "k",
    "coef": 3,
    "probability": 0.2
  }
}
"visual_data": { "type": "none" }

====================================================================
🔥 REGLAS ANTI-ERRORES
====================================================================
- NO incluyas títulos en el enunciado (el frontend ya los muestra desde visual_data).
- La respuesta final debe ser un número entero (a menos que el problema sea decimal explícito).
- Los valores de la incógnita deben estar entre 1 y 50.

5. **Coherencia de resultados**: El valor de la incógnita debe ser positivo y, preferiblemente, un número entero. Si obtienes un decimal, asegúrate de que sea simple (con máximo 1 decimal) y que esté en las opciones.

====================================================================
SEMILLAS DE INSPIRACIÓN
====================================================================
${getSeeds(grade, stage)}

====================================================================
${OUTPUT_FORMAT_JSON}
  `;
};
