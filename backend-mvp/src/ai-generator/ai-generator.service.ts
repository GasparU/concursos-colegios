import { Injectable, Logger } from '@nestjs/common';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { MathProblemSchema } from './ai-schemas';
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { EXAM_BLUEPRINT, SYLLABUS_DB } from './exam-syllabus';
import { getSystemPrompt } from './prompt-router';
import { VisualFactory } from './visual-factory';
import { calculateGeometryTotal } from './geometry.calculator';


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

        if (result.math_data?.params?.segments) {
          result.math_data.params.segments =
            result.math_data.params.segments.map((seg: any) => {
              if (seg.coef === undefined || seg.const === undefined) {
                const label = seg.label || '';
                // Busca patrones como "6y", "4y+10", "2y-3", "y+5"
                const match = label.match(
                  /^([+-]?\d*\.?\d*)?([a-zA-Z])([+-]\d+)?$/,
                );
                let coef = 1,
                  constVal = 0;
                if (match) {
                  coef = match[1] ? parseFloat(match[1]) : 1;
                  constVal = match[3] ? parseFloat(match[3]) : 0;
                }
                return { ...seg, coef, const: constVal };
              }
              return seg;
            });
        }

        const params = result.math_data.params;
        const type = result.math_data.type;

        // 1. Obtener x_value de forma tolerante
        let rawX: number | undefined;
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

        // 2. Determinar modo según dificultad
        const isBasic =
          difficulty.toLowerCase().includes('básico') ||
          difficulty.toLowerCase().includes('basic');
        const isInter = difficulty.toLowerCase().includes('inter');
        const isAdvanced =
          difficulty.toLowerCase().includes('avanzado') ||
          difficulty.toLowerCase().includes('concurso');

        let isFractionMode = false; // si las opciones se muestran como fracciones LaTeX
        let isMixedMode = false;
        let displayX: string; // cómo se muestra en solución/opciones
        let cleanX: number;

        // ---------------------------------------------
        // 🟢 BÁSICO   → Enteros pequeños (2-12)
        // 🟡 INTERMEDIO → Enteros medianos (13-19)
        // 🔴 AVANZADO  → Decimales (máx 2 decimales) o fracciones simples, aleatorio
        // ---------------------------------------------
        if (isBasic || isInter) {
          // ---------- ENTEROS ESTRICTOS ----------
          cleanX = Math.round(rawX);
          // Aseguramos que esté dentro del rango adecuado (opcional, mejora la calidad)
          if (isBasic) {
            if (cleanX < 2) cleanX = 2 + Math.floor(Math.random() * 11); // 2..12
            if (cleanX > 12) cleanX = 12 - Math.floor(Math.random() * 11);
          } else {
            // Intermedio
            if (cleanX < 13) cleanX = 13 + Math.floor(Math.random() * 7); // 13..19
            if (cleanX > 19) cleanX = 19 - Math.floor(Math.random() * 7);
          }
          displayX = cleanX.toString();
          isFractionMode = false; // fracciones prohibidas
        } else {
          // ---------- AVANZADO: decimales o fracciones ----------
          // Si rawX es entero, lo dejamos entero o le añadimos .5 / .25 aleatoriamente
          if (Number.isInteger(rawX)) {
            const rand = Math.random();
            if (rand < 0.34) {
              cleanX = rawX; // entero
            } else if (rand < 0.67) {
              cleanX = rawX + 0.5; // .5
            } else {
              cleanX = rawX + 0.25; // .25
            }
          } else {
            // Redondear al múltiplo de 0.25 más cercano
            cleanX = Math.round(rawX * 4) / 4;
          }

          const formatRand = Math.random();
          // 40% decimal, 40% fracción, 20% mixto
          if (formatRand < 0.4) {
            // --- DECIMAL ---
            isFractionMode = false;
            isMixedMode = false;
            displayX =
              cleanX % 1 === 0
                ? cleanX.toString()
                : cleanX.toFixed(2).replace(/\.?0+$/, '');
          } else if (formatRand < 0.8) {
            // --- FRACCIÓN (impropia) ---
            isFractionMode = true;
            isMixedMode = false;
            displayX = formatFraction(cleanX);
          } else {
            // --- MIXTO (solo si cleanX >= 1, si no, se cae a fracción) ---
            isFractionMode = true; // técnicamente es una representación de fracción
            isMixedMode = true;
            if (cleanX < 1) {
              displayX = formatFraction(cleanX);
              isMixedMode = false; // no se puede mostrar como mixto
            } else {
              displayX = formatMixed(cleanX);
            }
          }
        }

        // Guardar el valor final en params (para el visual)
        params.x_value = cleanX;

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
        // B) Calcular Total
        const computedTotal = calculateGeometryTotal(result.math_data);

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
        // D) REGENERAR OPCIONES (SHUFFLE DINÁMICO)
        // 1. Definimos la respuesta correcta (número limpio)
        // D) REGENERAR OPCIONES (SHUFFLE DINÁMICO)
        const correctVal = cleanX;
        let distractors: number[] = [];

        if (isBasic || isInter) {
          // Enteros: diferencias de 1 y 2
          distractors = [
            correctVal - 2,
            correctVal - 1,
            correctVal + 1,
            correctVal + 2,
          ];
          // Evitar negativos o cero en básico
          if (isBasic) {
            distractors = distractors.map((d) => (d < 1 ? d + 3 : d));
          }
        } else {
          // Avanzado: diferencias según el tipo de número
          if (isFractionMode) {
            // Si es fracción, generamos fracciones cercanas
            // Tomamos el decimal y le sumamos/restamos 0.5, 0.25, etc.
            distractors = [
              correctVal - 0.5,
              correctVal + 0.5,
              correctVal - 0.25,
              correctVal + 0.25,
            ];
          } else {
            // Decimales: diferencias de 0.5, 1, etc.
            distractors = [
              correctVal - 1,
              correctVal + 1,
              correctVal - 0.5,
              correctVal + 0.5,
              correctVal - 0.25,
              correctVal + 0.25,
            ];
          }
          // Limpiar decimales a 2 dígitos
          distractors = distractors.map((d) => Math.round(d * 5) / 5);
        }

        // Eliminar duplicados y valores iguales al correcto
        distractors = [...new Set(distractors)].filter((d) => d !== correctVal);

        // Si no tenemos suficientes, rellenar con variaciones
        while (distractors.length < 4) {
          distractors.push(correctVal + (distractors.length + 1) * 0.5);
        }

        // Mezclar y asignar a letras
        const optionsPool = [
          { val: correctVal, isCorrect: true },
          ...distractors.slice(0, 4).map((d) => ({ val: d, isCorrect: false })),
        ].sort(() => Math.random() - 0.5);

        const letters = ['A', 'B', 'C', 'D', 'E'];
        result.options = {};

        optionsPool.forEach((opt, index) => {
          if (index < 5) {
            const letter = letters[index];
            let optionText: string;

            if (isBasic || isInter) {
              // Básico/Intermedio: siempre enteros
              optionText = opt.val.toString();
            } else {
              // 🔥 AVANZADO: usa el MISMO modo que elegimos para la respuesta
              if (!isFractionMode) {
                // Decimal
                optionText =
                  opt.val % 1 === 0
                    ? opt.val.toString()
                    : opt.val.toFixed(2).replace(/\.?0+$/, '');
              } else if (!isMixedMode) {
                // Fracción impropia
                optionText = `$${formatFraction(opt.val)}$`;
              } else {
                // Mixto (si es <1, se muestra fracción)
                optionText =
                  opt.val < 1
                    ? `$${formatFraction(opt.val)}$`
                    : `$${formatMixed(opt.val)}$`;
              }
            }

            result.options[letter] = optionText;
            if (opt.isCorrect) {
              result.correct_answer = letter;
            }
          }
        });

        // F) SOBRESCRITURA DE SOLUCIÓN (Adiós texto gigante)
        // Escribimos nosotros la solución.
        // =========================================================
        // 🔥 GENERACIÓN DE LA SOLUCIÓN (PASO A PASO, SEGÚN EL TIPO)
        // =========================================================
        const valTotal = String(params.total_label || totalStr);
        const valXSolution = displayX; // Ya viene formateado (decimal, fracción o mixto SIN $)
        let solutionMarkdown = '';

        // 1. SEGMENTOS COLINEALES – Solución algebraica detallada
        if (type === 'collinear_segments' && Array.isArray(params.segments)) {
          // Extraer nombre de la variable (x, y, k, etc.)
          const varName =
            params.segments[0]?.label.replace(/[0-9.+\- ]/g, '') || 'x';

          // Ecuación visual: "2x + x+5 + 3x-2"
          const planteamientoStr = params.segments
            .map((s: any) => s.label)
            .join(' + ');

          // Reducción de coeficientes y constantes (ya calculados en sanitización)
          const totalCoef = params.segments.reduce(
            (acc: number, s: any) => acc + (parseFloat(s.coef) || 0),
            0,
          );
          const totalConst = params.segments.reduce(
            (acc: number, s: any) => acc + (parseFloat(s.const) || 0),
            0,
          );

          const signConst = totalConst >= 0 ? '+' : '-';
          const absConst = Math.abs(totalConst);
          const rhsValue = parseFloat(valTotal) - totalConst; // número después de pasar constantes

          solutionMarkdown = `
1. **Planteamiento:**
   Sumamos las longitudes de los segmentos para igualar al total:
   $$ ${planteamientoStr} = ${valTotal} $$

2. **Resolución:**
   - Agrupamos términos semejantes (${varName}):
     $$ ${totalCoef}${varName} ${signConst} ${absConst} = ${valTotal} $$
   - Pasamos el ${absConst} al otro lado:
     $$ ${totalCoef}${varName} = ${valTotal} ${totalConst >= 0 ? '-' : '+'} ${absConst} $$
     $$ ${totalCoef}${varName} = ${rhsValue} $$
   - Despejamos ${varName}:
     $$ ${varName} = ${valXSolution} $$

3. **Respuesta:**
   El valor de **${varName}** es **${valXSolution}**.
  `.trim();

          // 2. ÁNGULOS CONSECUTIVOS – Solución análoga
        }  else if (type === 'consecutive_angles' && Array.isArray(params.rays)) {
  // Extraer la variable (k, y, m, etc.) del primer ángulo
  const varName = params.rays[0]?.angleLabel.replace(/[0-9.+\- ]/g, '') || 'x';
  const planteamientoStr = params.rays
    .map((r: any) => r.angleLabel)
    .join(' + ');
  
  solutionMarkdown = `
1. **Planteamiento:**
   Sumamos las medidas de los ángulos consecutivos:
   $$ ${planteamientoStr} = ${valTotal}° $$

2. **Resolución:**
   Al resolver la ecuación para **${varName}**:
   $$ ${varName} = ${valXSolution} $$

3. **Respuesta:**
   El valor de **${varName}** es **${valXSolution}°**.
  `.trim();
} else {
          solutionMarkdown = `
1. **Planteamiento:**
   $$ \\text{Suma total} = ${valTotal} $$

2. **Resolución:**
   $$ x = ${valXSolution} $$

3. **Respuesta:**
   **${valXSolution}**
  `.trim();
        }

        // Asignar la solución generada
        result.solution_markdown = solutionMarkdown;

        // =========================================================
        // CONTINÚA TU CÓDIGO: VisualFactory, etc.
        // =========================================================
        this.logger.log(`🏭 Ejecutando VisualFactory...`);

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
        if (
          provider.providerName.includes('Gemini') ||
          provider.providerName.includes('DeepSeek')
        ) {
          // Si el error contiene la respuesta original, la mostramos
          if (error.rawResponse) {
            this.logger.debug(
              `📄 Respuesta cruda de ${provider.providerName}: ${error.rawResponse}`,
            );
          }
        }
        lastError = error;
      }
    }
  }
}

/**
 * Convierte un número decimal a fracción en formato LaTeX.
 * Si el denominador es muy grande (>100), devuelve el decimal con 2 dígitos.
 * @returns string en formato "\frac{num}{den}" (un solo backslash)
 */
function decimalToFraction(decimal: number): string {
  if (Number.isInteger(decimal)) return decimal.toString();
  const tolerance = 1.0e-6;
  let h1 = 1,
    h2 = 0,
    k1 = 0,
    k2 = 1;
  let b = decimal;
  do {
    let a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

  if (k1 > 100) return parseFloat(decimal.toFixed(2)).toString();
  // 🔥 Retorna con un solo backslash (en el string se escribe doble por escape de JS, pero en memoria es un solo \)
  return `\\frac{${h1}}{${k1}}`;
}

// ============================================================================
// 🧮 FUNCIONES PARA FORMATO EXACTO (múltiplos de 0.25)
// ============================================================================

// Máximo común divisor (Euclides)
function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

// Formato FRACCIÓN (siempre impropia, reducida)
// Ej: 3.5 → \frac{7}{2},  2.75 → \frac{11}{4}
function formatFraction(val: number): string {
  if (Number.isInteger(val)) return val.toString();
  const n = Math.round(val * 4);
  const g = gcd(n, 4);
  const num = n / g;
  const den = 4 / g;
  return `\\frac{${num}}{${den}}`;
}

// Formato MIXTO (solo para valores >= 1)
// Ej: 3.5 → 3\frac{1}{2},  2.75 → 2\frac{3}{4}
function formatMixed(val: number): string {
  if (Number.isInteger(val)) return val.toString();
  const n = Math.round(val * 4);
  const g = gcd(n, 4);
  let num = n / g;
  let den = 4 / g;
  const whole = Math.floor(num / den);
  const remainder = num % den;
  if (remainder === 0) return whole.toString();
  if (whole === 0) return `\\frac{${num}}{${den}}`; // no debería pasar porque val<1 se filtra antes
  return `${whole}\\frac{${remainder}}{${den}}`;
}