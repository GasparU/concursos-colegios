// REGLAS VISUALES ANTIGUAS (Para Aritmética y Estadística - Las de Geometría cambian a Factory)
export const VISUAL_RULES_STATISTICS = `
- PARA GRÁFICO DE BARRAS (chart_bar):
  {
    "type": "chart_bar",
    "data": {
      "labels": ["Enero", "Febrero", "Marzo"],
      "values": [130.20, 100.80, 120.40],
      "title": "Pagos de luz 2024",
      "colors": ["#4A90E2", "#4A90E2", "#4A90E2"]
    }
  }

- PARA GRÁFICO CIRCULAR (chart_pie):
  {
    "type": "chart_pie",
    "data": {
      "sectors": [
        { "label": "Facebook", "value": 6, "color": "#1877F2" },
        { "label": "Twitter", "value": 3, "color": "#1DA1F2" },
        { "label": "Instagram", "value": 4, "color": "#E1306C" },
        { "label": "TikTok", "value": 7, "color": "#000000" }
      ],
      "title": "Redes sociales preferidas (20 estudiantes)"
    }
  }
`;

export const VISUAL_RULES_ARITHMETIC = `
- PARA PROBLEMAS DE DINERO:
  {
    "type": "money_diagram",
    "data": {
      "bills": [
        { "denomination": 100, "count": 3 },
        { "denomination": 50, "count": 1 },
        { "denomination": 20, "count": 2 }
      ],
      "coins": [
        { "denomination": 5, "count": 3 },
        { "denomination": 1, "count": 2 }
      ],
      "total": "S/390",
      "operation": "paga S/150, recibe S/5.70 de vuelto"
    }
  }
`;

export const VISUAL_RULES_PHYSICS = `
- PARA FÍSICA (ariana):
  - Prioridad: Diagrama de Cuerpo Libre (DCL).
  - Usa vectores para fuerzas.
  - Estructura: { "type": "physics_ariana", "bodies": [...], "vectors": [...] }
`;

// 🔥 AGREGA ESTO AL FINAL DEL ARCHIVO:
export const OUTPUT_FORMAT_JSON = `
## 5. FORMATO DE SALIDA (JSON ESTRICTO):
Debes responder ÚNICAMENTE con este JSON válido. NO cambies los nombres de las claves.

{
  "topic": "...",
  "difficulty": "...",
  "question_markdown": "Enunciado... (Usa $x$ para fórmulas, JAMÁS uses $$)",
  "options": {
     "A": "...",
     "B": "...",
     "C": "...",
     "D": "...",
     "E": "..."
  },
  "correct_answer": "Letra (A, B, C, D o E)",
  "solution_markdown": "Resumen paso a paso en 3 a 5 líneas MÁXIMO. Sé directo pero didactico.",
  
  // IMPORTANTE:
  // - Si es Geometría: Incluye "math_data" (con params puros).
  // - Si es Aritmética/Estadística: Incluye "visual_data" (chart/money) o null.
}

🔴 REGLAS DE LAS OPCIONES:
1. Genera 1 respuesta correcta y 4 distractores plausibles (errores comunes).
2. 'solution_markdown' debe ser EXTREMADAMENTE CONCISO (Lista numerada 1, 2, 3).

🔥 REGLA DE ORO PARA LA SOLUCIÓN (solution_markdown):
- Escribe PARA UN NIÑO DE 7 a 10 AÑOS.
- MÁXIMO 5 LÍNEAS.
- ESTRUCTURA OBLIGATORIA:
  1. Planteamiento (Ecuación directa).
  2. Resolución (Pasos matemáticos mínimos).
  3. Respuesta final.
- ⛔ PROHIBIDO: "Verificando...", "Corrigiendo...", "Probemos con...", "Analizando opciones...".
- Si te equivocas, CORRIGE INTERNAMENTE y solo entrega el resultado limpio.
- Ejemplo perfecto:
  "1. Sumamos los segmentos: $$3x + 10 + x = 50$$
   2. Resolvemos: $$4x = 40 \\to x = 10$$
   3. Respuesta: El valor de x es 10."
`;