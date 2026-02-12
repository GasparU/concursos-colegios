import { SystemMessage } from "@langchain/core/messages";
import { GEOMETRY_PROMPT } from './prompts/geometry.prompts';
import { ARITHMETIC_PROMPT } from './prompts/arithmetic.prompts';
import { GENERAL_PROMPT } from './prompts/general.prompts';
import { SYLLABUS_DB } from './exam-syllabus';

export const getSystemPrompt = (topic: string, grade: string, stage: string, difficulty: string) => {
    const t = topic.toLowerCase();

    // 1. INYECTAR TEMARIO
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map(s => `- ${s}`).join('\n')}\n`;

    // 2. DETECTOR DE EXPERTOS
    // Si es geometría que requiere precisión visual (Factory)
    if (
        t.includes('geometr') || t.includes('segment') || t.includes('cubo') || t.includes('triángul') || t.includes('prisma')) {
        return new SystemMessage(GEOMETRY_PROMPT(grade, stage, difficulty) + syllabusContext);
    }

    if (t.includes('aritmética') || t.includes('dinero') || t.includes('estadística') || t.includes('gráfico')) {
        return new SystemMessage(ARITHMETIC_PROMPT(grade, stage, difficulty) + syllabusContext);
    }

    // 3. DEFAULT (Aritmética, Álgebra, Estadística)
    return new SystemMessage(GENERAL_PROMPT(topic, grade, stage, difficulty) + syllabusContext);
};