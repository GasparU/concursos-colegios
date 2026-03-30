import { Injectable, Logger } from '@nestjs/common';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { MathProblemSchema } from './ai-schemas';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { EXAM_BLUEPRINT, SYLLABUS_DB } from './exam-syllabus';
import { getSystemPrompt } from './prompt-router';
import { VisualFactory } from './visual-factory';
import { calculateGeometryTotal } from './geometry.calculator';
import {
  buildOptions,
  buildSolution,
  formatByDifficulty,
  generateDistractors,
  normalizeConsecutiveAngles,
  sanitizeAngles,
  sanitizeSegments,
} from './ai-generator-service/geometry';
import { calculateStatistics } from './statistics.calculator';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// 🔥 Limpiador Definitivo Nivel CONAMAT
const cleanAlgebraicExpression = (text: string): string => {
  return (
    text
      // 🔥 Borra el 1 si está pegado a letra o LaTeX: $1m, +1n, (1x, =1a
      .replace(/([$+\-\s(=])1(?=[a-zA-Z\\])/g, '$1')
      // 🔥 Caso especial: inicio del string o bloque LaTeX $1x -> $x
      .replace(/^1(?=[a-zA-Z\\])/, '')
      .replace(/\$1(?=[a-zA-Z\\])/g, '$')
      .replace(/\s+/g, ' ')
      .trim()
  );
};

const SEMANTIC_SCENARIOS = [
  // --- CIENCIA Y NATURALEZA ---
  'Biodiversidad de la selva peruana (flora y fauna)', 'Misterios de las profundidades marinas', 
  'El mundo de los microbios y células', 'Fenómenos climáticos y El Niño', 
  'Ecosistemas de la Cordillera de los Andes', 'Astronomía y galaxias lejanas',
  
  // --- HISTORIA Y CULTURA (Contexto Local e Internacional) ---
  'El Imperio de los Incas y su ingeniería', 'Grandes culturas preíncas (Chavín, Nasca, Paracas)',
  'La independencia del Perú y sus héroes', 'Civilizaciones antiguas (Egipto, Roma, Mesopotamia)',
  'Mitología Griega, Nórdica y deidades', 'Grandes inventores de la historia',
  
  // --- FUTURISMO Y AVENTURA ---
  'La vida en estaciones espaciales', 'Viajes en el tiempo y paradojas temporales',
  'Inteligencia artificial y robots amigos', 'Arquitectura de ciudades perdidas (Machu Picchu, Atlántida)',
  'Exploradores de la Antártida', 'Colonización de Marte y Marteformación',
  
  // --- LITERATURA Y ARTE ---
  'Personajes de novelas clásicas', 'El mundo de los cuentos de hadas originales',
  'Artistas del Renacimiento y sus obras', 'Instrumentos musicales del mundo'
];

const LETTER_TOPOLOGIES = {
  GRAMATICA: {
    nombre: 'Análisis Estructural',
    enfoque: 'Se centra en la arquitectura de las palabras, silabeo, acentuación y categorías gramaticales.',
    instruccion: 'Obligatorio realizar un silabeo mental previo para asegurar la respuesta.'
  },
  VERBAL: {
    nombre: 'Razonamiento Lógico-Verbal',
    enfoque: 'Analogías, series verbales y términos excluidos con relaciones semánticas complejas.',
    instruccion: 'Busca relaciones que no sean obvias, usa distractores que pertenezcan al mismo campo semántico.'
  },
  COMPRENSION: {
    nombre: 'Lectura Crítica e Inferencial',
    enfoque: 'Análisis de textos complejos (4-5 párrafos) con preguntas de nivel literal, inferencial y crítico.',
    instruccion: 'El texto debe ser rico en información y datos, no genérico.'
  },
  LITERATURA: {
    nombre: 'Análisis Literario y Figuras Retóricas',
    enfoque: 'Identificación de metáforas, hipérboles y análisis de fragmentos de obras clásicas.',
    instruccion: 'Usa fragmentos que parezcan reales o crea poemas cortos para analizar.'
  },
  ETIMOLOGIA: {
    nombre: 'Raíces Griegas y Latinas',
    enfoque: 'Estudio del origen de las palabras para deducir significados complejos.',
    instruccion: 'Plantea retos donde deba descomponer prefijos y sufijos.'
  }
};

@Injectable()
export class AiGeneratorService {
  private readonly logger = new Logger(AiGeneratorService.name);
  private cache = new Map<string, any>();

  constructor(
    private deepSeekProvider: DeepSeekProvider,
    private geminiProvider: GeminiProvider,
  ) {}

  // 🔥 CORREGIDO: Recibe (Tema, Grado, Etapa, Dificultad)
  async generateProblem(
    topic: string,
    grade: string,
    stage: string, // Antes 'level', ahora explícito 'stage' (clasificatoria/final)
    difficulty: string, // Nuevo parámetro (Básico/Intermedio/Avanzado)
    forceModel?: 'deepseek' | 'gemini',
    styleConstraint?: string,
  ) {
    // Valores por defecto de seguridad
    const safeGrade = grade || '6to';
    const safeStage = stage || 'clasificatoria';
    const safeDifficulty = difficulty || 'Intermedio';

    // 🔥 GENERAR CACHE KEY (ÚNICO LUGAR)
    const cacheKey = `${topic}|${safeGrade}|${safeStage}|${safeDifficulty}|${forceModel || 'none'}|${styleConstraint || ''}`;

    // 🔥 1. VERIFICAR CACHÉ
    if (this.cache.has(cacheKey)) {
      this.logger.log(`🎯 Usando problema en caché para: ${topic}`);
      return this.cache.get(cacheKey);
    }

    // const isGeometry = /geometr|ángul|triángul|polígon|segment|recta/i.test(topic);
    let selectedProvider =
      forceModel === 'gemini' ? this.geminiProvider : this.deepSeekProvider;

    if (forceModel === 'gemini') {
      selectedProvider = this.geminiProvider;
    } else if (forceModel === 'deepseek') {
      selectedProvider = this.deepSeekProvider;
    }

    try {
      return await this.executeGeneration(
        selectedProvider,
        topic,
        safeGrade,
        safeStage,
        safeDifficulty,
        styleConstraint,
      );
    } catch (error) {
      this.logger.error(
        `🔥 Fallo Principal (${selectedProvider.providerName})...`,
      );
      // Si falla DeepSeek, solo queda llorar o probar Gemini rezando
      const backupProvider =
        forceModel === 'gemini' ? this.deepSeekProvider : this.geminiProvider;

      const backupResult = await this.executeGeneration(
        backupProvider,
        topic,
        safeGrade,
        safeStage,
        safeDifficulty,
        styleConstraint,
      );

      // 🔥 5. GUARDAR EN CACHÉ (BACKUP)
      this.cache.set(cacheKey, backupResult);
      return backupResult;
    }
  }

  // 🔥 IA PARAFRASEADORA: ESTRICTA, DIRECTA Y SIN NOVELAS
  async restyleCreativeText(
    baseText: string,
    topic: string,
    grade: string,
    modelName: string = 'deepseek',
    isSimulacro: boolean = false,
  ): Promise<string> {
    // 1. Detección del área para saber cuánta libertad darle a la IA
    const topicLower = topic.toLowerCase();
    const esGeometria = /geometr|ángul|triángul|polígon|segment|recta/i.test(
      topicLower,
    );

    const esOperadores = topicLower.includes('operador');

    // 2. Arsenal de contextos creativos (Para que nunca se repita)
    const contextos = [
      'Chefs preparando banquetes o pasteles',
      'Astronautas explorando planetas o calculando combustible',
      'Jardineros diseñando parques o plantando árboles',
      'Ingenieros construyendo puentes o robots',
      'Gamers ganando puntos o superando niveles',
      'Científicos mezclando pociones o analizando bacterias',
      'Piratas repartiendo tesoros o navegando millas',
      'Deportistas en entrenamiento o rompiendo récords',
      'Magos en una academia de hechicería',
      'Rescatistas de animales en misiones épicas',
    ];
    const contextoAleatorio =
      contextos[Math.floor(Math.random() * contextos.length)];

    // 3. Prompt Dinámico
    const prompt = `
    Actúa como un creador de exámenes de olimpiadas matemáticas (CONAMAT) para estudiantes de ${grade} de primaria, PERO TIENES PROHIBIDO ALTERAR LA NOTACIÓN MATEMÁTICA.
    "Si el modo NO es simulacro, el enunciado debe ser DIRECTO Y OPERATIVO (máximo 18 palabras). 
    Prohibido historias o personajes. Ejemplo: 'Halla el término que sigue: 2, 4, 8...'"
    Tema: "${topic}"
    Texto original: "${baseText}"

    Tu misión es REESCRIBIR el texto siguiendo estas reglas según el MODO seleccionado:

    ${
      isSimulacro && !esGeometria
        ? `
    🌟 MODO SIMULACRO (NARRATIVO):
    - Crea una historia breve basada en el contexto: "${contextoAleatorio}".
    - Adapta los personajes y acciones para que el problema parezca un reto de la vida real.
    `
        : `
    ⚡ MODO ENTRENAMIENTO (DIRECTO):
    - PROHIBIDO inventar historias o personajes.
    - SÉ DIRECTO, frío y operativo. 
    - Usa frases como: "Halla el valor de...", "Calcula...", "Si se sabe que...".
    - El inicio debe ser matemático (ej: "Si $A * B = ...$").
    `
    }

    ${
      esGeometria
        ? `
    📐 REGLA DE GEOMETRÍA: 
    - Independiente del modo, mantén el lenguaje puro y formal. Nada de cuentos.
    `
        : ''
    }

    ${
      esOperadores
        ? `
    🔥 REGLA DE OPERADORES:
    - Es OBLIGATORIO mostrar el símbolo de operación (ej. $a \\triangle b$).
    - Asegúrate de que los símbolos LaTeX estén entre $.
    `
        : ''
    }

    REGLAS INQUEBRANTABLES:
    1. BREVEDAD: Máximo 2 líneas para entrenamiento, 3 para simulacro.
    2. NÚMEROS INTACTOS: No alteres valores ni fórmulas.
    3. FORMATO LATEX OBLIGATORIO: Todo símbolo o número entre $.
    4. CERO PISTAS: No expliques cómo resolver.
    5. Devuelve ÚNICAMENTE el texto redactado.
    6. PROHIBIDO EXPLICAR EL PATRÓN: No digas "se suma 2" o "se multiplica por x". 
    7. 🚨 LENGUAJE DE PRIMARIA OBLIGATORIO: ESTÁ ESTRICTAMENTE PROHIBIDO usar notación modular como (mod 5), congruencias o símbolos universitarios. Usa SIEMPRE frases simples como "al dividirlo entre 5 deja residuo 2". 🚨
   El estudiante debe descubrirlo solo. Solo presenta la secuencia: 2, 4, 6...
  `;

    try {
      let response;

      // 🎯 SELECCIÓN DE MOTOR DINÁMICA
      if (modelName === 'gemini') {
        const model = new ChatGoogleGenerativeAI({
          apiKey: process.env.GOOGLE_API_KEY,
          model: 'gemini-2.0-flash',
          temperature: 0.6, // 🔥 Temperatura baja para que no invente locuras
        });
        response = await model.invoke(prompt);
      } else {
        const model = new ChatOpenAI({
          configuration: { baseURL: 'https://api.deepseek.com' },
          apiKey: process.env.DEEPSEEK_API_KEY,
          model: 'deepseek-chat',
          temperature: 0.6, // 🔥 Temperatura baja para evitar alucinaciones
        });
        response = await model.invoke(prompt);
      }

      const textoFinal = response.content.toString().trim();

      const resultadoLimpio = cleanAlgebraicExpression(textoFinal || baseText);
      return resultadoLimpio;
    } catch (error: any) {
      this.logger.error(
        `Error en IA Narrativa: ${error?.message || 'Desconocido'}`,
      );
      return baseText; // Si falla, devuelve el original sin romper nada
    }
  }

  private readonly MATH_STYLES = [
    'Usa números PARES y resultados exactos.',
    'Usa números IMPARES y situaciones de reparto.',
    'Usa FRACCIONES o partes (mitad, tercia, cuarto).',
    'Usa números GRANDES (centenas o miles) si el grado lo permite.',
    'Plantea el problema de forma INVERSA (dando el total primero).',
    'Usa una incógnita o valor desconocido al INICIO de la operación.',
    'Usa paréntesis o agrupaciones en el planteamiento.',
    "Incluye una condición extra (ej: 'y luego le regalan 5 más').",
    'Usa DECIMALES sencillos (ej: 0.5, 2.5) si aplica al tema.',
    'La respuesta debe requerir dos pasos para hallarse.',
  ];

  private readonly NARRATIVE_STYLES = [
    "ESTILO DIRECTO: 'Calcula x si: ...' (Sin introducción).",
    "ESTILO CONTEXTUAL: 'Un arquitecto diseña...'.",
    "ESTILO GEOMÉTRICO: 'En la figura mostrada...'.",
    "ESTILO FORMAL: 'Dados los puntos colineales...'.",
    "ESTILO INVERSO: 'Si el total es X, halla el segmento menor...'.",
    "ESTILO PREGUNTA: '¿Cuál es el valor de BC si...?'",
  ];

  // Este método orquesta la creación de múltiples problemas en paralelo.
  async generateBatch(dto: any, quantity: number) {
    // 1. Limite de seguridad (Max 20 preguntas)
    const safeQty = Math.min(quantity, 20);
    this.logger.log(
      `🚀 BATCH START: Generando ${safeQty} problemas para ${dto.grade} (${dto.stage})...`,
    );

    let gradeKey = '6to'; // Default
    if (dto.grade.includes('3')) gradeKey = '3ro';
    else if (dto.grade.includes('4')) gradeKey = '4to';
    else if (dto.grade.includes('5')) gradeKey = '5to';
    else if (dto.grade.includes('6')) gradeKey = '6to';
    const stageKey = dto.stage === 'final' ? 'final' : 'clasificatoria';

    // Si no encuentra la config, usa un fallback seguro
    const blueprint = EXAM_BLUEPRINT?.[gradeKey]?.[stageKey] || [];
    const tasks: Promise<any>[] = [];
    const topicsLog: string[] = [];

    let globalIndex = 0;

    if (blueprint.length > 0 && quantity > 1) {
      for (const subject of blueprint) {
        const count = Math.max(
          1,
          Math.round((subject.quantity / 20) * safeQty),
        );
        const availableTopics = SYLLABUS_DB[subject.course] || [subject.course];

        for (let i = 0; i < count; i++) {
          const randomTopic =
            availableTopics[Math.floor(Math.random() * availableTopics.length)];
          const fullTopic = `${subject.course}: ${randomTopic}`;
          const mathStyle =
            this.MATH_STYLES[globalIndex % this.MATH_STYLES.length];
          const narrativeStyle =
            this.NARRATIVE_STYLES[globalIndex % this.NARRATIVE_STYLES.length];
          const combinedStyle = `1. MATEMÁTICA: ${mathStyle}\n2. NARRATIVA: ${narrativeStyle}`;
          globalIndex++;

          topicsLog.push(fullTopic);
          tasks.push(
            this.generateProblem(
              fullTopic,
              dto.grade,
              dto.stage,
              dto.difficulty,
              undefined,
              combinedStyle,
            ),
          );
        }
      }
    } else {
      const mathStyle = this.MATH_STYLES[globalIndex % this.MATH_STYLES.length];
      const narrativeStyle =
        this.NARRATIVE_STYLES[globalIndex % this.NARRATIVE_STYLES.length];
      const combinedStyle = `1. MATEMÁTICA: ${mathStyle}\n2. NARRATIVA: ${narrativeStyle}`;
      globalIndex++;

      topicsLog.push(dto.topic);
      tasks.push(
        this.generateProblem(
          dto.topic,
          dto.grade,
          dto.stage,
          dto.difficulty,
          undefined,
          combinedStyle,
        ),
      );
    }

    // 3. Ejecutar en paralelo
    this.logger.log(`📋 Plan de Examen: ${topicsLog.join(' | ')}`);

    // Promise.allSettled es mejor que Promise.all porque si falla una, no cancela las demás
    const results = await Promise.allSettled(tasks);

    // 4. Filtrar éxitos
    const validProblems = results
      .filter((r) => r.status === 'fulfilled' && r.value.success)
      .map((r: any) => r.value.data);

    this.logger.log(
      `✅ BATCH END: ${validProblems.length}/${safeQty} generados correctamente.`,
    );

    return {
      success: true,
      count: validProblems.length,
      data: validProblems,
    };
  }

  // En ai-generator.service.ts

  private async executeGeneration(
    provider: any,
    topic: string,
    grade: string,
    stage: string,
    difficulty: string,
    styleConstraint: string = '',
  ) {
    // 🔄 INTENTOS MÁXIMOS (Quality Gate)
    const MAX_RETRIES = 2;
    let lastError: any = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        this.logger.log(
          `🔄 Intento ${attempt}/${MAX_RETRIES} - Generando problema...`,
        );
        const topicLower = topic.toLowerCase();
        const normalizedTopic = topic
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const esLetras =
          /comunic|lenguaj|verbal|lect|gramat|comprensi|texto|ortograf|acento|tono|fonema|silaba|hiato|diptongo|triptongo|sustantivo|adjetivo|verbo|pronombre|articulo|oracion|sujeto|predicado|mayuscula|punto|coma|sintaxis|semant|sinon|anton|paron|homon|analo|termino|excluid|series|conector|plan|redacc|literat|histor|geog|civic|psicol|pobl|americ|litic|arcaic|chavin|paracas|mochica|nasca|wari|tiahua|chimu|chincha|inca|tahuant|invasion|conquist|virrein|coloni|reformas|precurs|independ|libertad|militarism|guano|salitre|guerra/i.test(
            normalizedTopic,
          );

        // 1. PREPARAR PROMPT (Igual que antes)
        let systemPrompt = getSystemPrompt(topic, grade, difficulty);

        let topologia = LETTER_TOPOLOGIES.VERBAL; // Default
        if (/lect|comprensi|texto/i.test(normalizedTopic)) topologia = LETTER_TOPOLOGIES.COMPRENSION;
        if (/ortograf|acento|silaba|gramat|sustantivo|verbo/i.test(normalizedTopic)) topologia = LETTER_TOPOLOGIES.GRAMATICA;

        const escenarioAzar = SEMANTIC_SCENARIOS[Math.floor(Math.random() * SEMANTIC_SCENARIOS.length)];

        // 🔥 CORRECCIÓN CRÍTICA: Si es letras, el sistema NO PUEDE ser un profesor de matemáticas
        if (esLetras) {
          systemPrompt = new SystemMessage(
            `Eres un EXAMINADOR DE LENGUAJE Y HUMANIDADES (Nivel 5to/6to Primaria CONAMAT). 
            OLVIDA TODO LO RELACIONADO A MATEMÁTICAS, GEOMETRÍA O "PROPIEDADES".

            REGLAS DE SOLUCIÓN (solution_markdown):
            1. EMPATÍA INICIAL: Empieza con una frase como "Entiendo que pensaste en esta opción porque [COL]palabra[/COL] parece correcta, pero..."
            2. EXPLICACIÓN DEL RETO: Explica la regla gramatical o el dato histórico de forma directa y seca (Estilo Olimpiada 369).
            3. REGLA DE ORO: Incluye exactamente DOS ejemplos didácticos fuera de la pregunta original. 
            4. FORMATO: Solo usa [COL] para resaltar. PROHIBIDO usar asteriscos (**).
            
            REGLA DE VARIEDAD: Usa el contexto de "${escenarioAzar}" para todas las palabras o ejemplos.`
          );
        } else if (!systemPrompt) {
          systemPrompt = new SystemMessage(
            'Eres un profesor de matemáticas experto en olimpiadas.',
          );
        }

        // 🔥 ESCENARIOS CREATIVOS PARA EVITAR "MÁQUINAS"
        const escenarios = [
          'viajes espaciales (naves, combustible)',
          'entrenamiento de dragones (fuego, gemas)',
          'pociones mágicas (ingredientes, calderos)',
          'reino animal (comida, rescatistas)',
          'misiones de exploradores (brújulas, mapas)',
          'deportes extremos (saltos, energía)',
        ];
        const contextoAzar =
          escenarios[Math.floor(Math.random() * escenarios.length)];

        // 🔥 PRE-CALCULADOR PARA PROPORCIONALIDAD (Proceso Inverso)
        let guiaMatematica = '';
        if (
          topicLower.includes('proporcion') ||
          topicLower.includes('regla de tres')
        ) {
          let a = Math.floor(Math.random() * 12) + 2;
          let b = Math.floor(Math.random() * 50) + 10;
          let c = Math.floor(Math.random() * 20) + 4;
          while ((b * c) % a !== 0) {
            a++;
          } // Aseguramos resultado entero
          const x = (b * c) / a;
          guiaMatematica = `DATOS OBLIGATORIOS: ValorA=${a}, ValorB=${b}, ValorC=${c}. RESPUESTA: ${x}.`;
        }

        const uniqueSeed =
          Math.random().toString(36).substring(7) + Date.now().toString();

        if (!systemPrompt)
          systemPrompt = new SystemMessage('Eres un profesor de matemáticas.');

        const esComprensionLectora =
          /^(?=.*lect)(?=.*comprensi)|^(?=.*texto)|^(?=.*jerarquia text)/i.test(
            normalizedTopic,
          );

        const promptCuerpo = esLetras
          ? `Genera un reto de "${topic}" para ${grade} primaria.
             NIVEL: ${difficulty}. Escenario: "${escenarioAzar}".

             FORMATO OBLIGATORIO:
             - question_markdown: Escribe PRIMERO la instrucción (ej: "Señala el término que no pertenece:") y DEBAJO los elementos de la serie.
             - PROHIBIDO usar corchetes [] o etiquetas como "PREMISA".
             - solution_markdown: Redacta la mentoría con los 2 ejemplos aquí mismo.

             ESTRUCTURA JSON:
             - question_markdown: Enunciado limpio.
             - options: {A, B, C, D, E}.
             - correct_answer: Letra.
             - solution_markdown: Explicación didáctica.`
          : `Genera un problema de "${topic}" para ${grade}.
             CONTEXTO: ${contextoAzar}.
             ${guiaMatematica}

             "REGLA DE FORMATO OBLIGATORIA: Debes usar LaTeX para TODA expresión matemática, números, variables, fórmulas y fracciones. 
              Enciérralo siempre entre símbolos de dólar (ejemplo: $x^2$, $\\\\frac{1}{2}$, $\\\\sqrt{144}$).
             
              ⚠️ IMPORTANTE PARA EL JSON: Para que el sistema no rompa, usa DOBLE BARRA INVERTIDA en los comandos LaTeX (ejemplo: usa \\\\frac en lugar de \\frac, y \\\\overline en lugar de \\overline). Para numerales con barra superior usa $\\\\overline{abcd}$."
             
              REGLAS ESTRICTAS:
              1. PROHIBIDO usar máquinas, fábricas, obreros o grifos.
              2. NO calcules nada, usa los DATOS OBLIGATORIOS provistos.
              3. solution_markdown: Pon solo "Cálculo pendiente".
              4. Sé breve y directo.
             
              REQUISITO DE ESTILO: ${styleConstraint}
              SEMILLA DE SEGURIDAD: ${uniqueSeed}`;

        const messages = [systemPrompt, new HumanMessage(promptCuerpo)];

        // 2. LLAMADA A LA IA
        const result = await provider.generateStructured(
          messages,
          MathProblemSchema,
        );

        if (esLetras) {
          result.visual_data = null;
          result.math_data = null;
          return {
            success: true,
            data: result,
            provider: provider.providerName,
          };
        }

        const arithmeticKeywords = [
          'fracciones',
          'aritmética',
          'operaciones',
          'descomposición',
          'polinómica',
          'divisibilidad',
          'mcd',
          'mcm',
          'primos',
          'porcentaje',
          'proporcion',
          'reparto',
          'canjes',
          'monedas',
          'z',
          'enteros',
          'multiplicación',
          'división',
          'billetes',
          'sucesiones',
          'progresión',
          'ecuaciones',
          'decimales',
          'potenciación',
          'radicación',
          'razones',
          'regla de tres',
          'intereses',
          'impuestos',
          'múltiplos',
          'divisores',
          'cuadrado',
          'cubo',
          'cifras',
          'valor posicional',
          'orden',
          'doble',
          'triple',
          'mitad',
          'cuádruple',
          'equivalencias',
          'cambio monetario',
          'conjuntos',
          'numeración',
        ];

        const esAritmetica =
          arithmeticKeywords.some((keyword) => topicLower.includes(keyword)) ||
          result.math_data?.type === 'fraction_problem' ||
          result.math_data?.type === 'arithmetic_problem' ||
          result.math_data?.type === 'mcd_problem' ||
          result.math_data?.type === 'mcm_problem' ||
          result.math_data?.type === 'compound_proportion' ||
          result.math_data?.type === 'proportionality' ||
          result.math_data?.type === 'fraction_of_fraction' ||
          result.math_data?.type === 'fraction_equation' ||
          result.math_data?.type === 'successive_percentage' ||
          result.math_data?.type === 'motion_problem' || // 🔥 Aquí tenía un ; y ahora tiene ||
          result.math_data?.type === 'money_exchange_simple';

        // =============================================================
        // 🔥 CONTROL DE ALUCINACIONES POR LONGITUD DE SOLUCIÓN
        // =============================================================
        const SOLUTION_MAX_LENGTH = 800; // Número máximo de caracteres permitido en la solución
        if (
          result.solution_markdown &&
          result.solution_markdown.length > SOLUTION_MAX_LENGTH
        ) {
          this.logger.warn(
            `🚨 Solución demasiado larga (${result.solution_markdown.length} caracteres), posible alucinación. Reintentando...`,
          );
          throw new Error('Solución demasiado larga');
        }

        // 🔥 NORMALIZAR ESTRUCTURAS ERRÓNEAS DE DEEPSEEK
        if (provider.providerName.includes('DeepSeek')) {
          // Si no hay math_data en la raíz, intentar normalizar desde visual_data
          if (!result.math_data && result.visual_data) {
            const normalized = normalizeConsecutiveAngles(
              null,
              result.visual_data,
            );
            if (normalized) {
              result.math_data = normalized;
              // Limpiar visual_data para evitar duplicación
              delete result.visual_data.math_data;
            }
          }

          // Si ya hay math_data pero con tipo incorrecto, normalizarlo
          if (result.math_data) {
            const normalized = normalizeConsecutiveAngles(result.math_data);
            if (normalized) {
              result.math_data = normalized;
            }
          }
        }

        // Si después de todo sigue sin haber math_data, lanzar error
        if (!result.math_data && !esLetras) {
          throw new Error('La IA no generó math_data');
        }

        const params = result.math_data?.params || {};
        const type = result.math_data?.type || 'ia_pura';

        if (
          type === 'consecutive_angles' &&
          (!params.rays || params.rays.length < 2)
        ) {
          throw new Error('El problema de ángulos requiere al menos 2 rayos.');
        }

        // 🔥 CAMBIO QUIRÚRGICO: Búsqueda flexible (DeepSeek a veces lo pone fuera de params)
        const mathData = result.math_data || {};
        const xSource =
          mathData.params?.x_value !== undefined
            ? mathData.params.x_value
            : mathData.x_value;

        console.log('🔍 [DEBUG] x_value detectado:', xSource);

        if (xSource === null || xSource === undefined) {
          throw new Error(
            'La IA devolvió un x_value nulo o ausente. Reintentando...',
          );
        }

        let rawX: number;

        if (typeof xSource === 'string') {
          // 4 líneas después
          const match = xSource.match(/-?\d+(\.\d+)?/);
          rawX = match ? parseFloat(match[0]) : NaN;
        } else {
          rawX = Number(xSource);
        }

        if (
          isNaN(rawX) &&
          (type.includes('segment') || type.includes('angle'))
        ) {
          throw new Error(
            `x_value inválido o ausente. La IA no generó el número.`,
          );
        }

        const {
          cleanX,
          displayX,
          isFractionMode,
          isMixedMode,
          isBasic,
          isInter,
        } = formatByDifficulty(rawX, difficulty);
        const finalX = esAritmetica ? rawX : cleanX;
        params.x_value = finalX;
        console.log('✅ [DEBUG] x_value final (IA vs Geo):', finalX);

        const esIAVerbal =
          esLetras ||
          esAritmetica ||
          result.math_data?.type?.includes('arithmetic');

        if (esIAVerbal) {
          this.logger.log(
            `✅ RETORNO DIRECTO: Categoría detectada (${esLetras ? 'Letras' : 'Aritmética'}).`,
          );

          result.visual_data = null;
          if (esLetras) result.math_data = null; // Letras no necesita math_data

          return {
            success: true,
            data: result,
            provider: provider.providerName,
          };
        }

        if (params.segments)
          console.log(
            '📦 [DEBUG] segmentos antes sanitizar:',
            params.segments.length,
          );
        if (params.rays)
          console.log('📐 [DEBUG] rayos antes sanitizar:', params.rays.length);

        // =========================================================================
        // 🔥 SANITIZACIÓN DE SEGMENTOS Y RAYOS (AHORA CON x_value LIMPIO)
        // =========================================================================
        if (params.segments && Array.isArray(params.segments)) {
          params.segments = sanitizeSegments(params.segments, cleanX);
        }

        if (params.rays && Array.isArray(params.rays)) {
          params.rays = sanitizeAngles(params.rays, cleanX, this.logger);
        } else if (type === 'consecutive_angles') {
          console.error(
            '❌ [SANITIZE] type es consecutive_angles pero params.rays no existe o no es array',
          );
          throw new Error('El problema de ángulos consecutivos requiere rays');
        }

        // ---------------------------------------------
        // 🚨 Validación extra: etiquetas basura en segmentos
        // ---------------------------------------------
        if (type === 'collinear_segments' && Array.isArray(params.segments)) {
          const tieneEtiquetaBasura = params.segments.some(
            (s: any) => s.label === s.name || /^[A-Z]{2}$/.test(s.label.trim()),
          );
          if (tieneEtiquetaBasura) {
            throw new Error(
              'Detectada etiqueta inválida (Nombre en vez de fórmula).',
            );
          }
        }

        // 3. PROCESAMIENTO DE ARITMÉTICA / IA PURA
        if (esAritmetica) {
          const calculableTypes = [
            'mcd_problem',
            'mcm_problem',
            'compound_proportion',
            'fraction_of_fraction',
            'fraction_equation',
            'successive_percentage',
            'money_exchange',
            'motion_problem',
            'money_exchange_simple',
          ];

          if (
            result.math_data &&
            calculableTypes.includes(result.math_data.type)
          ) {
            this.logger.log(
              `🔢 Aritmética Calculable: ${result.math_data.type}`,
            );
            const {
              calculateArithmetic,
            } = require('./ai-generator-service/arithmetic/arithmetic.dispatcher');
            const arithResult = calculateArithmetic(result.math_data);

            if (arithResult) {
              result.solution_markdown = arithResult.solutionMarkdown;
              result.visual_data = null;
              // 🔥 CAMBIO QUIRÚRGICO: Generación de Opciones Basada en Plantilla
              const mathData = result.math_data;
              const context = {
                ...mathData.params,
                ...mathData.relaciones_calculadas,
              };
              const incognitaKey = mathData.incognita_directa || 'solucion';
              const correctValue =
                context[incognitaKey] ?? arithResult.correctValue;

              // Si la plantilla trae fórmulas de distractores, las usamos
              let finalOptions: number[] = [];
              if (
                mathData.distractores &&
                Array.isArray(mathData.distractores)
              ) {
                finalOptions = mathData.distractores.map((f) =>
                  this.evaluateTemplateFormula(f, {
                    ...context,
                    correcto: correctValue,
                  }),
                );
              } else {
                // Fallback: Distractores inteligentes genéricos
                finalOptions = [
                  correctValue + 1,
                  correctValue - 1,
                  correctValue + 10,
                  correctValue - 10,
                ];
              }

              // Mezclar y asignar letras
              const pool = [...new Set([correctValue, ...finalOptions])]
                .filter((v) => !isNaN(v))
                .sort(() => Math.random() - 0.5)
                .slice(0, 5);

              const letters = ['A', 'B', 'C', 'D', 'E'];
              result.options = {};
              pool.forEach((val, i) => {
                const letter = letters[i];
                result.options[letter] = val.toString();
                if (val === correctValue) result.correct_answer = letter;
              });
              // Aquí podrías poner tu código de distractores si lo necesitas,
              // si no, el return ya es suficiente.
              return {
                success: true,
                data: result,
                provider: provider.providerName,
              };
            }
          }

          // SI NO ES CALCULABLE O EL CALCULADOR FALLÓ -> IA PURA DIRECTA
          this.logger.log(`🔢 IA PURA: Retornando sin validar geometría.`);
          result.visual_data = null; // Súper importante para que no salgan lienzos

          return {
            success: true,
            data: result,
            provider: provider.providerName,
          };
        }

        // 🟢 Aquí termina el bloque de aritmética.
        // El código de abajo (Estadística/Geometría) ya NO saldrá traslúcido.

        // Después de obtener result y sanitizar...

        const esEstadistica =
          topic.toLowerCase().includes('estadística') ||
          topic.toLowerCase().includes('frecuencia') ||
          topic.toLowerCase().includes('promedio') ||
          topic.toLowerCase().includes('gráfico') ||
          topic.toLowerCase().includes('moda') ||
          topic.toLowerCase().includes('mediana') ||
          result.visual_data?.type === 'frequency_table' ||
          result.visual_data?.type === 'chart_pie' ||
          result.visual_data?.type === 'chart_bar' ||
          result.visual_data?.type === 'chart_line';

        if (esEstadistica) {
          this.logger.log(
            `📊 Problema de estadística detectado, procesando con calculador...`,
          );

          console.log(
            '📥 math_data recibido:',
            JSON.stringify(result.math_data, null, 2),
          );
          console.log(
            '📥 visual_data recibido:',
            JSON.stringify(result.visual_data, null, 2),
          );
          const statsResult = calculateStatistics(
            result.math_data,
            result.visual_data,
          );
          console.log('📤 statsResult:', statsResult);
          if (!statsResult) {
            throw new Error(
              'El calculador de estadística no pudo obtener un resultado válido',
            );
          }

          // 🔥 APLICAR ACTUALIZACIONES VISUALES
          if (statsResult.visualUpdates && result.visual_data) {
            for (const update of statsResult.visualUpdates) {
              if (
                result.visual_data.type === 'chart_bar' ||
                result.visual_data.type === 'chart_line'
              ) {
                if (update.index !== undefined) {
                  result.visual_data.data.values[update.index] = update.value;
                }
              } else if (result.visual_data.type === 'chart_pie') {
                if (update.index !== undefined) {
                  result.visual_data.data.sectors[update.index].value =
                    update.value;
                }
              } else if (result.visual_data.type === 'frequency_table') {
                if (update.rowIndex !== undefined) {
                  result.visual_data.data.rows[update.rowIndex][1] =
                    update.value;
                }
              }
            }
          }

          // Sobrescribir solución y generar opciones
          result.solution_markdown = statsResult.solutionMarkdown;

          const correctVal = statsResult.correctValue;
          let distractors: number[];
          if (Number.isInteger(correctVal)) {
            distractors = [
              correctVal - 2,
              correctVal - 1,
              correctVal + 1,
              correctVal + 2,
            ];
          } else {
            distractors = [
              correctVal - 1,
              correctVal + 1,
              correctVal - 0.5,
              correctVal + 0.5,
            ];
          }
          distractors = [...new Set(distractors)].filter(
            (d) => d > 0 && d !== correctVal,
          );

          const optionsPool = [
            { val: correctVal, isCorrect: true },
            ...distractors
              .slice(0, 4)
              .map((d) => ({ val: d, isCorrect: false })),
          ].sort(() => Math.random() - 0.5);

          const letters = ['A', 'B', 'C', 'D', 'E'];
          result.options = {};
          optionsPool.forEach((opt, index) => {
            if (index < 5) {
              const letter = letters[index];
              const optionText =
                opt.val % 1 === 0 ? opt.val.toString() : opt.val.toFixed(2);
              result.options[letter] = optionText;
              if (opt.isCorrect) result.correct_answer = letter;
            }
          });

          return {
            success: true,
            data: result,
            provider: provider.providerName,
          };
        }

        // B) Calcular Total
        const computedTotal = calculateGeometryTotal(result.math_data);

        console.log('🧮 [DEBUG] computedTotal =', computedTotal);
        if (computedTotal === null || computedTotal <= 0) {
          console.error('❌ [DEBUG] Total inválido, lanzando error...');
        }

        // 🔥 VALIDACIÓN ESPECÍFICA PARA ÁNGULOS
        if (type === 'consecutive_angles') {
          this.logger.debug(
            `🧮 Total calculado para ángulos: ${computedTotal}`,
          );
          if (computedTotal === null || computedTotal <= 0) {
            // Log detallado de los rayos para depuración
            this.logger.error(
              `🔥 Rayos recibidos: ${JSON.stringify(params.rays)}`,
            );
            throw new Error(`Total inválido (${computedTotal}) para ángulos`);
          }
        }

        if (computedTotal === null || computedTotal <= 0) {
          throw new Error('Fallo en el cálculo matemático del Backend.');
        }

        const totalStr = computedTotal.toString();
        if (params) {
          params.total_label = totalStr; // ✅ esto ya lo tienes
        }

        if (
          result.question_markdown &&
          result.question_markdown.includes('[[TOTAL]]')
        ) {
          result.question_markdown = result.question_markdown.replace(
            /\[\[TOTAL\]\]/g,
            totalStr,
          );
        }

        // D) REGENERAR OPCIONES
        const correctVal = cleanX;
        const distractors = generateDistractors(
          correctVal,
          isBasic,
          isInter,
          isFractionMode,
        );
        const { options, correct_answer } = buildOptions(
          correctVal,
          distractors,
          isBasic,
          isInter,
          isFractionMode,
          isMixedMode,
        );
        result.options = options;
        result.correct_answer = correct_answer;

        // F) SOBRESCRITURA DE SOLUCIÓN (Adiós texto gigante)
        // Escribimos nosotros la solución.

        // F) GENERAR SOLUCIÓN
        result.solution_markdown = buildSolution(
          type,
          params,
          totalStr,
          displayX,
        );

        // 4. EJECUTAR FACTORY VISUAL (Ya sabemos que los datos son válidos)
        this.logger.log(`🏭 Ejecutando VisualFactory...`);

        const generatedVisual = VisualFactory(result.math_data);
        if (generatedVisual) {
          result.visual_data = generatedVisual;
        }

        // SI LLEGAMOS AQUÍ, TODO ESTÁ PERFECTO. RETORNAMOS.
        this.logger.log(
          `✅ Problema generado exitosamente en intento ${attempt}.`,
        );
        return {
          success: true,
          data: result,
          provider: provider.providerName,
        };
      } catch (error: any) {
        console.error('🔥🔥🔥 ERROR CAPTURADO EN EXECUTE GENERATION 🔥🔥🔥');
        console.error('Nombre del proveedor:', provider?.providerName);
        console.error('Mensaje de error:', error?.message);
        console.error('Stack:', error?.stack);
        console.error('Respuesta cruda (rawResponse):', error?.rawResponse);
        console.error(
          'Error completo:',
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
        );

        // También usar Logger por si acaso
        this.logger.error(
          `🔥 Fallo en intento ${attempt}: ${error?.message || 'Sin mensaje'}`,
        );
        if (error?.rawResponse) {
          this.logger.debug(`📄 Respuesta cruda: ${error.rawResponse}`);
        }
        lastError = error;
      }
    }
  }

  // 🔥 EVALUADOR PARAMÉTRICO: Procesa fórmulas dinámicas de CONAMAT (incluye ternarios)
  private evaluateTemplateFormula(
    formula: string,
    context: Record<string, any>,
  ): number {
    try {
      let processed = formula;
      // Ordenamos llaves por longitud (desc) para que 'abc' no sea pisado por 'a'
      const keys = Object.keys(context).sort((a, b) => b.length - a.length);
      keys.forEach((key) => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        processed = processed.replace(regex, context[key]);
      });
      // Evaluación segura de la expresión resultante
      return new Function(`return Number(${processed})`)();
    } catch (error: any) {
      this.logger.error(
        `❌ Error en fórmula: ${formula} -> ${error?.message || 'Error desconocido'}`,
      );
      return 0;
    }
  }
}
