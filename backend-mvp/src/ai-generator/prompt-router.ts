import { SystemMessage } from '@langchain/core/messages';
// Importar todos los prompts de geometría
import {
  SEGMENTS_PROMPT,
  ANGLES_PROMPT,
  PARALLEL_LINES_PROMPT,
  COMPOSITE_SQUARES_PROMPT,
  NET_BOX_PROMPT,
  CHAIN_LINKS_PROMPT,
  COMPOSITE_3D_PROMPT,
  POLYGON_REGULAR_PROMPT,
  CUBE_PRISM_PROMPT,
  CIRCLE_SECTORS_PROMPT,
  CIRCLE_ARC_ANGLE_PROMPT,
} from './prompts/geometry';

import { GENERAL_PROMPT } from './prompts/general.prompts';
import { SYLLABUS_DB } from './exam-syllabus';
import { ARITHMETIC_PROMPT } from './prompts/arithmetic/arithmetic.prompts';

// Mapa de palabras clave a prompts de geometría
const geometryPromptMap = [
  { keywords: ['segmento', 'colineal'], prompt: SEGMENTS_PROMPT },
  { keywords: ['ángulo', 'consecutivo'], prompt: ANGLES_PROMPT },
  { keywords: ['círculo', 'sector', 'pizza'], prompt: CIRCLE_SECTORS_PROMPT },
  {
    keywords: ['arco', 'ángulo central', 'circunferencia'],
    prompt: CIRCLE_ARC_ANGLE_PROMPT,
  },
  { keywords: ['paralela', 'bisectriz'], prompt: PARALLEL_LINES_PROMPT },
  {
    keywords: ['cuadrado', 'compuesto', 'sombreada'],
    prompt: COMPOSITE_SQUARES_PROMPT,
  },
  { keywords: ['caja', 'red', 'tapa'], prompt: NET_BOX_PROMPT },
  { keywords: ['cadena', 'eslabón'], prompt: CHAIN_LINKS_PROMPT },
  {
    keywords: ['sólido', 'compuesto', 'isométrico'],
    prompt: COMPOSITE_3D_PROMPT,
  },
  {
    keywords: ['polígono', 'regular', 'triángulo equilátero'],
    prompt: POLYGON_REGULAR_PROMPT,
  },
  { keywords: ['cubo', 'prisma', '3d'], prompt: CUBE_PRISM_PROMPT },
];

export const getSystemPrompt = (
  topic: string,
  grade: string,
  stage: string,
  difficulty: string,
) => {
  const t = topic.toLowerCase();

  // 1. Buscar en geometría
  for (const entry of geometryPromptMap) {
    if (entry.keywords.some((k) => t.includes(k))) {
      const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
      const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
      const promptText =
        entry.prompt(grade, stage, difficulty) + syllabusContext;
      return new SystemMessage(promptText);
    }
  }

  // 2. Si no es geometría, probar aritmética
  if (
    t.includes('aritmética') ||
    t.includes('dinero') ||
    t.includes('estadística') ||
    t.includes('gráfico')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      ARITHMETIC_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  // 3. Por defecto, prompt general
  const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
  const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
  return new SystemMessage(
    GENERAL_PROMPT(topic, grade, stage, difficulty) + syllabusContext,
  );
};
