import {
    VISUAL_RULES_ARITHMETIC,
    VISUAL_RULES_STATISTICS,
    VISUAL_RULES_PHYSICS,
    OUTPUT_FORMAT_JSON
} from './common.rules';
import { getSeeds } from '../seeds';
import { GET_VARIABILITY_RULES } from './variability.manager';

export const GENERAL_PROMPT = (topic: string, grade: string, stage: string, difficulty: string) => {

    // Decidimos qué reglas visuales incluir según el tema
    let visualRules = "Genera gráficos SOLO si el problema lo requiere estrictamente.\n";
    const t = topic.toLowerCase();
    const subjectType = topic.toLowerCase().includes('álgebra') ? 'ALGEBRA' : 'ARITHMETIC';

    if (t.includes('estadística') || t.includes('gráfico')) {
        visualRules += VISUAL_RULES_STATISTICS;
    } else if (t.includes('dinero') || t.includes('billete')) {
        visualRules += VISUAL_RULES_ARITHMETIC;
    } else if (t.includes('física') || t.includes('vector')) {
        visualRules += VISUAL_RULES_PHYSICS;
    }

    return `
# ROL: Profesor experto de Matemáticas (Nivel ${grade}).
- TEMA: ${topic}
- ETAPA: ${stage}
- DIFICULTAD: ${difficulty}

${GET_VARIABILITY_RULES(subjectType, difficulty)}

## REGLAS VISUALES:
${visualRules}

## SEMILLAS DE INSPIRACIÓN:
${getSeeds(grade, stage)}

${OUTPUT_FORMAT_JSON}
`;
};