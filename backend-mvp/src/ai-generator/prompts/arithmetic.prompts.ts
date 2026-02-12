import {
   OUTPUT_FORMAT_JSON,
   VISUAL_RULES_ARITHMETIC,
   VISUAL_RULES_STATISTICS
} from './common.rules';
import { getSeeds } from '../seeds';
import { GET_VARIABILITY_RULES } from './variability.manager';

export const ARITHMETIC_PROMPT = (grade: string, stage: string, difficulty: string) => `
ROL: Experto en Aritmética y Estadística (Nivel ${grade}).
ETAPA: ${stage} | DIFICULTAD: ${difficulty}

OBJETIVO: Crear problemas numéricos exactos.

${GET_VARIABILITY_RULES('ARITHMETIC', difficulty)}

INSTRUCCIONES VISUALES ESPECÍFICAS:
1. SI EL PROBLEMA ES DE DINERO (Compra/Venta/Vuelto):
   - DEBES generar "visual_data" con type: "money_diagram".
   - Define billetes y monedas coherentes con el monto.
   - REGLA: ${VISUAL_RULES_ARITHMETIC}

2. SI EL PROBLEMA ES DE ESTADÍSTICA (Tablas/Gráficos):
   - DEBES generar "visual_data" con type: "chart_bar" o "chart_pie".
   - REGLA: ${VISUAL_RULES_STATISTICS}

3. SI ES OPERACIONES COMBINADAS / FRACCIONES PURAS:
   - NO generes gráfico (visual_data: null).

SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
`;