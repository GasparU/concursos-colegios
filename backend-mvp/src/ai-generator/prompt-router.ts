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
import { STATISTICS_PROMPT } from './prompts/statistics/statistics.prompt';
import { MCD_MCM_PROMPT } from './prompts/arithmetic/mcd-mcm.prompt';
import { COMPOUND_PROPORTION_PROMPT } from './prompts/arithmetic/compound-proportion.prompt';
import { FRACTION_OF_FRACTION_PROMPT } from './prompts/arithmetic/fraction-of-fraction.prompt';
import { FRACTION_EQUATION_PROMPT } from './prompts/arithmetic/fraction-equation.prompt';
import { SUCCESSIVE_PERCENTAGE_PROMPT } from './prompts/arithmetic/successive-percentage.prompt';
import { MOTION_PROBLEM_PROMPT } from './prompts/arithmetic/motion-problem.prompt';
import { MONEY_EXCHANGE_PROMPT } from './prompts/arithmetic/money-exchange.prompt';


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

  // 2. Detectar estadística
  if (
    t.includes('estadística') ||
    t.includes('gráfico') ||
    t.includes('promedio') ||
    t.includes('moda') ||
    t.includes('mediana') ||
    t.includes('frecuencia')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      STATISTICS_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  // 3. Detectar problemas específicos de aritmética avanzada (con calculador propio)
  // MCD/MCM
  if (
    t.includes('mcd') ||
    t.includes('mcm') ||
    t.includes('máximo común divisor') ||
    t.includes('mínimo común múltiplo')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      MCD_MCM_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  // Proporcionalidad compuesta
  if (
    t.includes('proporcionalidad compuesta') ||
    t.includes('regla de tres compuesta')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      COMPOUND_PROPORTION_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  // Fracción de una fracción
  if (
    t.includes('fracción de una fracción') ||
    t.includes('fracción de fracción')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      FRACTION_OF_FRACTION_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  // Ecuaciones con fracciones
  if (
    t.includes('ecuaciones con fracciones') ||
    t.includes('ecuación fraccionaria')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      FRACTION_EQUATION_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  // Porcentajes sucesivos
  if (
    t.includes('porcentajes sucesivos') ||
    t.includes('descuentos y aumentos sucesivos')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      SUCCESSIVE_PERCENTAGE_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  if (
    t.includes('canje') ||
    t.includes('monedas') ||
    t.includes('billetes') ||
    t.includes('dinero') ||
    t.includes('equivalencia monetaria')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      MONEY_EXCHANGE_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  // Problemas de móviles
  if (
    t.includes('móviles') ||
    t.includes('encuentro') ||
    t.includes('alcance')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      MOTION_PROBLEM_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  // Detectar problemas de canje monetario
  if (
    t.includes('canje') ||
    t.includes('monedas') ||
    t.includes('billetes') ||
    t.includes('equivalencia monetaria')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      MONEY_EXCHANGE_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  // 4. Aritmética general (para temas que no tienen prompt específico)
  if (
    t.includes('fracciones') ||
    t.includes('aritmética') ||
    t.includes('números') ||
    t.includes('operaciones') ||
    t.includes('conjuntos') ||
    t.includes('divisibilidad') ||
    t.includes('primos') ||
    t.includes('porcentaje') ||
    t.includes('proporcionalidad') ||
    t.includes('canjes') ||
    t.includes('monedas') ||
    t.includes('billetes') ||
    t.includes('sucesiones') ||
    t.includes('decimales') ||
    t.includes('potenciación') ||
    t.includes('radicación') ||
    t.includes('razones') ||
    t.includes('regla de tres') ||
    t.includes('intereses') ||
    t.includes('impuestos') ||
    t.includes('múltiplos') ||
    t.includes('divisores') ||
    t.includes('cuadrado') ||
    t.includes('cubo') ||
    t.includes('cifras') ||
    t.includes('valor posicional') ||
    t.includes('orden') ||
    t.includes('doble') ||
    t.includes('triple') ||
    t.includes('mitad') ||
    t.includes('cuádruple') ||
    t.includes('equivalencias') ||
    t.includes('cambio monetario')
  ) {
    const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
    const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
    return new SystemMessage(
      ARITHMETIC_PROMPT(grade, stage, difficulty) + syllabusContext,
    );
  }

  // 5. Por defecto, prompt general
  const syllabus = SYLLABUS_DB[grade]?.[stage] || [];
  const syllabusContext = `\nCONTEXTO TEMÁTICO:\n${syllabus.map((s) => `- ${s}`).join('\n')}\n`;
  return new SystemMessage(
    GENERAL_PROMPT(topic, grade, stage, difficulty) + syllabusContext,
  );
};;
