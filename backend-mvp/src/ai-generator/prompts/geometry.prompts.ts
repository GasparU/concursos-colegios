import { OUTPUT_FORMAT_JSON } from './common.rules';
import { getSeeds } from '../seeds';
import { GET_VARIABILITY_RULES } from './variability.manager';

export const GEOMETRY_PROMPT = (grade: string, stage: string, difficulty: string) => {
const allowDecimals = difficulty === 'Avanzado' || difficulty === 'Concurso';
const numberTypeRule = allowDecimals
  ? "OBJETIVO: Problemas desafiantes. La respuesta 'x' PUEDE SER DECIMAL (ej: 4.5, 7.2) o Entera."
  : "OBJETIVO: Problemas didácticos. La respuesta 'x' DEBE SER ENTERA (Integer Only).";

return `
ROL: Experto en Geometría Euclidiana (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

${numberTypeRule}

${GET_VARIABILITY_RULES('GEOMETRY', difficulty)}

🔥 REGLA DE ORO "BACKEND CALCULATOR" (VITAL):
1. TÚ NO CALCULAS EL TOTAL. Eres malo sumando.
2. En el enunciado ('question_markdown'), cuando te refieras al total (de segmentos o ángulos), ESCRIBE EXACTAMENTE: [[TOTAL]].
3. NO pongas el número. El sistema lo calculará por ti usando tu 'x_value'.
4. En 'math_data', define tu 'x_value' (Entero) y los coeficientes.

👇 FORMATOS OBLIGATORIOS (JSON):

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
   - Enunciado ejemplo: "Se tienen los puntos... AB mide 3x, BC mide x+5. Si la longitud total es [[TOTAL]], halla x."

2. CUBOS Y PRISMAS (3D):
   - Usa "math_data" con type "solid_cube" o "solid_prism".
   - Define el lado o dimensiones.
   - Ejemplo: { "type": "solid_cube", "params": { "side": 4, "label": "L" } }

3. POLÍGONOS REGULARES:
   - Ejemplo: { "type": "polygon_regular", "params": { "sides": 5, "radius": 4 } }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

4. ÁNGULOS CONSECUTIVOS ALREDEDOR DE UN PUNTO:
   - Estructura OBLIGATORIA: Define 'x_value' y coeficientes.
   - Ejemplo (Si eliges x=10):
     "math_data": {
        "type": "consecutive_angles",
        "params": {
           "x_value": 10,
           "vertex": { "label": "O" },
           "rays": [
              { "pointLabel": "A", "angleLabel": "4x", "coef": 4, "const": 0 }, // 40°
              { "pointLabel": "B", "angleLabel": "x+10", "coef": 1, "const": 10 } // 20°
           ],
           "total_label": "60°"
        }
     }

5. CÍRCULO DIVIDIDO EN SECTORES (PIZZA):
   - Usa "circle_sectors".
   - Define "radius" y "sector_labels": cada sector tiene "angle" y opcional "label".
   - Ejemplo:
     "math_data": {
        "type": "circle_sectors",
        "params": {
           "radius": 4,
           "sector_labels": [
              { "angle": 120, "label": "40°" },
              { "angle": 120, "label": "40°" },
              { "angle": 120, "label": "40°" }
           ]
        }
     }

6. CIRCUNFERENCIA CON ARCO Y ÁNGULO:
   - Usa "circle_arc_angle".
   - Parámetros: "center", "points", "arc_measure", "angle_value".
   - Ejemplo: 
     "math_data": {
        "type": "circle_arc_angle",
        "params": {
           "arc_measure": 86,
           "angle_value": 52,
           "show_arc": true
        }
     }

7. RECTAS PARALELAS Y BISECTRICES:
   - Usa "parallel_lines_bisector".
   - Define "lines" (cada una con label, direction, offset).
   - Opcional "bisector".
   - Ejemplo (problema de la imagen):
     "math_data": {
        "type": "parallel_lines_bisector",
        "params": {
           "lines": [
              { "label": "P", "direction": "horizontal", "offset": 1 },
              { "label": "Q", "direction": "horizontal", "offset": -1 }
           ],
           "bisector": {
              "vertex": "B",
              "lines": ["AB", "BC"],
              "angle_label": "x"
           }
        }
     }

8. CUADRADOS COMPUESTOS:
   - Usa "composite_squares".
   - Define "squares": cada uno con label (ej "ABCD"), side, position (x,y).
   - Para región sombreada, usa "shaded_region" con "type": "polygon" y points.
   - Ejemplo (3 cuadrados):
     "math_data": {
        "type": "composite_squares",
        "params": {
           "squares": [
              { "label": "ABCD", "side": 6, "position": { "x": 0, "y": 0 } },
              { "label": "EFGH", "side": 5, "position": { "x": 0.5, "y": 0.5 } },
              { "label": "IJKL", "side": 3, "position": { "x": 1.5, "y": 1.5 } }
           ],
           "shaded_region": {
              "type": "polygon",
              "points": [[0,6], [6,6], [6,0], [0,0], [1.5,1.5], [4.5,1.5], [4.5,4.5], [1.5,4.5]]
           }
        }
     }

9. RED DE CAJA SIN TAPA:
   - Usa "net_box".
   - Parámetros: "net_dimensions" con "width", "height", "cut_square_side".
   - Ejemplo:
     "math_data": {
        "type": "net_box",
        "params": {
           "net_dimensions": {
              "width": 28,
              "height": 24,
              "cut_square_side": 4
           }
        }
     }

10. CADENA DE ESLABONES:
    - Usa "chain_links".
    - Parámetros: "link_length", "link_width", "num_links".
    - Ejemplo:
      "math_data": {
         "type": "chain_links",
         "params": {
            "link_length": 2,
            "link_width": 1.5,
            "num_links": 5,
            "total_length_label": "22 cm"
         }
      }

11. SÓLIDO COMPUESTO EN ISOMÉTRICO:
    - Usa "composite_3d_solid".
    - Define "solid_parts" (cada uno con shape, dimensions, position).
    - Ejemplo (volumen L):
      "math_data": {
         "type": "composite_3d_solid",
         "params": {
            "solid_parts": [
               { "shape": "prism", "dimensions": { "length": 10, "width": 4, "height": 5 }, "position": { "x": 0, "y": 0, "z": 0 } },
               { "shape": "prism", "dimensions": { "length": 4, "width": 8, "height": 5 }, "position": { "x": 10, "y": 0, "z": 0 } }
            ],
            "isometric_angle": 30
         }
      }

12. POLÍGONO REGULAR (TRIÁNGULO EQUILÁTERO):
    - Usa "polygon_regular".
    - Parámetros: "sides", "radius", "angles" (true para marcar ángulos).
    - Ejemplo:
      "math_data": {
         "type": "polygon_regular",
         "params": {
            "sides": 3,
            "radius": 4,
            "angles": true
         }
      }

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}

🔥 REGLA ESTRICTA DE BACKEND:
- El backend FORZARÁ que el resultado sea entero en Básico/Intermedio y decimal/fracción en Avanzad

`;

}