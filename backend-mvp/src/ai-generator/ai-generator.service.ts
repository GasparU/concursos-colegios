import { Injectable, Logger } from '@nestjs/common';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { MathProblemSchema } from './ai-schemas';
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { EXAM_BLUEPRINT, SYLLABUS_DB } from './exam-syllabus';
import { getSystemPrompt } from './prompt-router';
import { VisualFactory } from './visual-factory';
import { calculateGeometryTotal } from './geometry.calculator';
import { buildOptions, buildSolution, formatByDifficulty, generateDistractors, normalizeConsecutiveAngles, sanitizeAngles, sanitizeSegments } from './ai-generator-service/geometry';
import { calculateStatistics } from './statistics.calculator';
import { calculateArithmetic } from './ai-generator-service/arithmetic/arithmetic.calculator';




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
    const MAX_RETRIES = 3;
    let lastError: any = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        this.logger.log(
          `🔄 Intento ${attempt}/${MAX_RETRIES} - Generando problema...`,
        );

        // 1. PREPARAR PROMPT (Igual que antes)
        let systemPrompt = getSystemPrompt(topic, grade, stage, difficulty);
        const uniqueSeed =
          Math.random().toString(36).substring(7) + Date.now().toString();

        if (!systemPrompt)
          systemPrompt = new SystemMessage('Eres un profesor de matemáticas.');

        const messages = [
          systemPrompt,
          new HumanMessage(
            `Genera un problema único sobre: "${topic}". 
                         Grado: ${grade}. Etapa: ${stage}. Dificultad: ${difficulty}.
                         - Semilla: ${uniqueSeed}           
                         REQUISITO (VARIABILIDAD): ${styleConstraint} 
                         Asegúrate de incluir 'visual_data'.
                         **INSTRUCCIONES ESTRICTAS**:
                        - El campo "math_data.params.x_value" DEBE ser un número (ej: 18, 6.5). NO uses texto.  
                        - math_data es OBLIGATORIO.  
                        - Asegúrate de incluir 'visual_data' después.
                         
                         `,
          ),
        ];

        // 2. LLAMADA A LA IA
        const result = await provider.generateStructured(
          messages,
          MathProblemSchema,
        );

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
        if (!result.math_data) {
          throw new Error('La IA no generó math_data');
        }

        const params = result.math_data.params;
        const type = result.math_data.type;

        if (
          type === 'consecutive_angles' &&
          (!params.rays || params.rays.length < 2)
        ) {
          throw new Error('El problema de ángulos requiere al menos 2 rayos.');
        }

        // 1. Obtener x_value de forma tolerante
        let rawX: number | undefined;
        console.log(
          '🔍 [DEBUG] params.x_value crudo:',
          params?.x_value,
          'tipo:',
          typeof params?.x_value,
        );
        if (params.x_value !== undefined) {
          if (typeof params.x_value === 'string') {
            const match = params.x_value.match(/-?\d+(\.\d+)?/);
            rawX = match ? parseFloat(match[0]) : NaN;
          } else {
            rawX = parseFloat(params.x_value);
          }
        } else {
          rawX = NaN;
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
        params.x_value = cleanX;
        console.log('✅ [DEBUG] cleanX asignado:', cleanX);

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
          'proporcionalidad',
          'canjes',
          'monedas',
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

        const topicLower = topic.toLowerCase();
        const esAritmetica =
          arithmeticKeywords.some((keyword) => topicLower.includes(keyword)) ||
          result.math_data?.type === 'fraction_problem' ||
          result.math_data?.type === 'arithmetic_problem' ||
          result.math_data?.type === 'mcd_problem' ||
          result.math_data?.type === 'mcm_problem' ||
          result.math_data?.type === 'compound_proportion' ||
          result.math_data?.type === 'fraction_of_fraction' ||
          result.math_data?.type === 'fraction_equation' ||
          result.math_data?.type === 'successive_percentage' ||
          result.math_data?.type === 'motion_problem';
          result.math_data?.type === 'money_exchange_simple';

        if (esAritmetica) {
          // Si el problema tiene un tipo que podemos calcular, lo procesamos
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
              `🔢 Problema de aritmética (${result.math_data.type}) detectado, procesando con calculador...`,
            );

            // Importar el dispatcher (asegúrate de la ruta correcta)
            const {
              calculateArithmetic,
            } = require('./ai-generator-service/arithmetic/arithmetic.dispatcher');
            const arithResult = calculateArithmetic(result.math_data);

            if (!arithResult) {
              throw new Error(
                'El calculador de aritmética no pudo obtener un resultado válido',
              );
            }

            // Sobrescribir la solución y eliminar visual_data
            result.solution_markdown = arithResult.solutionMarkdown;
            result.visual_data = null;

            // Generar opciones alrededor del valor correcto
            const correctVal = arithResult.correctValue;
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
          } else {
            // Para otros temas de aritmética, early return
            this.logger.log(
              `🔢 Problema de aritmética detectado (${topic}), retornando directamente.`,
            );
            if (result.visual_data) {
              result.visual_data = null;
            }
            }

          // Retornar el resultado (ya sea procesado o no)
          return {
            success: true,
            data: result,
            provider: provider.providerName,
          };
        }

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
}
