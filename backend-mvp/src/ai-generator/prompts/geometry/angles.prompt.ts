// src/ai-generator/prompts/geometry/angles.prompt.ts
import { OUTPUT_FORMAT_JSON } from '../common.rules';
import { getSeeds } from '../../seeds';
import { GET_VARIABILITY_RULES } from '../variability.manager';

export const ANGLES_PROMPT = (
  grade: string,
  stage: string,
  difficulty: string,
) => {
  const baseRules = GET_VARIABILITY_RULES('GEOMETRY', difficulty);

  let extraRules = '';

  // 🔥 REGLA DE SUMA TOTAL (SIEMPRE PRESENTE)
  extraRules += `
🔥 REGLA DE SUMA TOTAL:
   - La suma de los ángulos consecutivos (el total) DEBE ser un número entre 90° y 179°.
   - **NUNCA** uses 180° como total, porque después de la rotación visual el último rayo apuntaría hacia abajo.
`;

  if (difficulty.toLowerCase().includes('avanzado')) {
    extraRules += `
🔥 PREGUNTAS DE NIVEL AVANZADO:
   - Puedes generar 3 o 4 ángulos consecutivos (es decir, 4 o 5 rayos).
   - Las letras de los puntos deben ser consecutivas: A, B, C, D, E, etc.
   - Además de hallar x, puedes pedir el complemento, suplemento, el doble, la mitad, etc.
   - Ejemplo: "En la figura, los rayos OA, OB, OC, OD y OE son consecutivos. Si ∠AOB = 2x+10, ∠BOC = 3x+20, ∠COD = 4x-5, ∠DOE = x+15, halla el complemento de x sabiendo que la suma total es [[TOTAL]]."
   - La respuesta final debe ser el resultado de esa operación (no x).
   - Asegúrate de que el valor de x sea tal que el resultado sea un número entero.
    `;
  } else if (difficulty.toLowerCase().includes('inter')) {
    extraRules += `
🔥 RANGOS PARA INTERMEDIO:
   - Genera EXACTAMENTE 3 ángulos consecutivos: AOB, BOC, COD.
   - Por lo tanto, los rayos son OA, OB, OC y OD (4 rayos).
   - Las letras de los puntos deben ser A, B, C, D.
   - La variable x debe ser un entero entre 13 y 19.
   - Ejemplo de enunciado: "En la figura, los rayos OA, OB, OC y OD son consecutivos. Si ∠AOB = 8x, ∠BOC = 3x+15, ∠COD = 2x+10, halla el valor de x sabiendo que la suma total es [[TOTAL]]."
    `;
  } else {
    extraRules += `
🔥 RANGOS PARA BÁSICO:
   - Genera EXACTAMENTE 2 ángulos consecutivos: AOB y BOC.
   - Por lo tanto, los rayos son OA, OB y OC (3 rayos).
   - Las letras de los puntos deben ser A, B, C.
   - La variable x debe ser un entero entre 2 y 12.
   - Ejemplo de enunciado: "En la figura, los rayos OA, OB y OC son consecutivos. Si ∠AOB = 6x, ∠BOC = 4x+10, halla el valor de x sabiendo que el ángulo total AOC mide [[TOTAL]]."
    `;
  }

  return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${baseRules}
${extraRules}

🔥 REGLA DE ORO "BACKEND CALCULATOR" (VITAL):
1. TÚ NO CALCULAS EL TOTAL. Eres malo sumando.
2. En el enunciado ('question_markdown'), cuando te refieras al total (de ángulos), **ESCRIBE EXACTAMENTE: [[TOTAL]]** (sin espacios).
3. NO pongas el número. El sistema lo calculará por ti usando tu 'x_value'.
4. En 'math_data', define tu 'x_value' y los coeficientes.

👇 FORMATO OBLIGATORIO PARA ÁNGULOS CONSECUTIVOS:

⚠️ IMPORTANTE: El campo "math_data.type" DEBE ser EXACTAMENTE "consecutive_angles".
⚠️ PROHIBIDO usar "geometry" como tipo.
⚠️ PROHIBIDO usar campos como "angle_AOB", "angle_BOC", etc.

✅ Estructura CORRECTA (OBLIGATORIA) para 3 ángulos (4 rayos):
"math_data": {
   "type": "consecutive_angles",
   "params": {
      "x_value": 13,
      "vertex": { "label": "O" },
      "rays": [
         { "pointLabel": "A", "angleLabel": "8y", "coef": 8, "const": 0, "value": 104 },
         { "pointLabel": "B", "angleLabel": "3y+15", "coef": 3, "const": 15, "value": 54 },
         { "pointLabel": "C", "angleLabel": "2y+10", "coef": 2, "const": 10, "value": 36 }
      ],
      "total_label": "194°"
   }
}

✅ Para 2 ángulos (3 rayos):
"math_data": {
   "type": "consecutive_angles",
   "params": {
      "x_value": 13,
      "vertex": { "label": "O" },
      "rays": [
         { "pointLabel": "A", "angleLabel": "8y", "coef": 8, "const": 0, "value": 104 },
         { "pointLabel": "B", "angleLabel": "3y+15", "coef": 3, "const": 15, "value": 54 }
      ],
      "total_label": "194°"
   }
}

🔥 REGLA DE ORO:
- NO inventes nombres de campos.
- NO uses "geometry" como type.
- SIEMPRE incluye "coef" y "const" como números.
- El backend RECHAZARÁ cualquier otro formato.

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
  `;
};
