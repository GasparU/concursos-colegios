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

    constructor(
        private deepSeekProvider: DeepSeekProvider,
        private geminiProvider: GeminiProvider,
    ) { }

    // 🔥 CORREGIDO: Recibe (Tema, Grado, Etapa, Dificultad)
    async generateProblem(
        topic: string,
        grade: string,
        stage: string,        // Antes 'level', ahora explícito 'stage' (clasificatoria/final)
        difficulty: string,   // Nuevo parámetro (Básico/Intermedio/Avanzado)
        forceModel?: 'deepseek' | 'gemini',
        styleConstraint?: string
    ) {
        // Valores por defecto de seguridad
        const safeGrade = grade || '6to';
        const safeStage = stage || 'clasificatoria';
        const safeDifficulty = difficulty || 'Intermedio';

        const isGeometry = /geometr|ángul|triángul|polígon|segment|recta/i.test(topic);
        let selectedProvider: any = this.deepSeekProvider;

        if (forceModel === 'gemini') {
            if (isGeometry) {
                this.logger.warn("⚠️ INTENTO DE USAR GEMINI EN GEOMETRÍA. Forzando DeepSeek para evitar errores de JSON.");
                // NO cambiamos a Gemini, nos quedamos con DeepSeek
                selectedProvider = this.deepSeekProvider;
            } else {
                selectedProvider = this.geminiProvider;
            }
        }

        try {
            return await this.executeGeneration(selectedProvider, topic, safeGrade, safeStage, safeDifficulty, styleConstraint);
        } catch (error) {
            this.logger.error(`🔥 Fallo Principal (${selectedProvider.providerName})...`);
            // Si falla DeepSeek, solo queda llorar o probar Gemini rezando
            return await this.executeGeneration(this.geminiProvider, topic, safeGrade, safeStage, safeDifficulty, styleConstraint);
        }
    }

    private readonly MATH_STYLES = [
        "Usa números PARES y resultados exactos.",
        "Usa números IMPARES y situaciones de reparto.",
        "Usa FRACCIONES o partes (mitad, tercia, cuarto).",
        "Usa números GRANDES (centenas o miles) si el grado lo permite.",
        "Plantea el problema de forma INVERSA (dando el total primero).",
        "Usa una incógnita o valor desconocido al INICIO de la operación.",
        "Usa paréntesis o agrupaciones en el planteamiento.",
        "Incluye una condición extra (ej: 'y luego le regalan 5 más').",
        "Usa DECIMALES sencillos (ej: 0.5, 2.5) si aplica al tema.",
        "La respuesta debe requerir dos pasos para hallarse."
    ];

    private readonly NARRATIVE_STYLES = [
        "ESTILO DIRECTO: 'Calcula x si: ...' (Sin introducción).",
        "ESTILO CONTEXTUAL: 'Un arquitecto diseña...'.",
        "ESTILO GEOMÉTRICO: 'En la figura mostrada...'.",
        "ESTILO FORMAL: 'Dados los puntos colineales...'.",
        "ESTILO INVERSO: 'Si el total es X, halla el segmento menor...'.",
        "ESTILO PREGUNTA: '¿Cuál es el valor de BC si...?'"
    ];

    // Este método orquesta la creación de múltiples problemas en paralelo.
    async generateBatch(dto: any, quantity: number) {
        // 1. Limite de seguridad (Max 20 preguntas)
        const safeQty = Math.min(quantity, 20);
        this.logger.log(`🚀 BATCH START: Generando ${safeQty} problemas para ${dto.grade} (${dto.stage})...`);

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
                const count = Math.max(1, Math.round((subject.quantity / 20) * safeQty));
                const availableTopics = SYLLABUS_DB[subject.course] || [subject.course];

                for (let i = 0; i < count; i++) {
                    const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
                    const fullTopic = `${subject.course}: ${randomTopic}`;
                    const mathStyle = this.MATH_STYLES[globalIndex % this.MATH_STYLES.length];
                    const narrativeStyle = this.NARRATIVE_STYLES[globalIndex % this.NARRATIVE_STYLES.length];
                    const combinedStyle = `1. MATEMÁTICA: ${mathStyle}\n2. NARRATIVA: ${narrativeStyle}`;
                    globalIndex++;

                    topicsLog.push(fullTopic);
                    tasks.push(this.generateProblem(fullTopic, dto.grade, dto.stage, dto.difficulty, undefined, combinedStyle));
                }
            }
        } else {
            const mathStyle = this.MATH_STYLES[globalIndex % this.MATH_STYLES.length];
            const narrativeStyle = this.NARRATIVE_STYLES[globalIndex % this.NARRATIVE_STYLES.length];
            const combinedStyle = `1. MATEMÁTICA: ${mathStyle}\n2. NARRATIVA: ${narrativeStyle}`;
            globalIndex++;

            topicsLog.push(dto.topic);
            tasks.push(this.generateProblem(dto.topic, dto.grade, dto.stage, dto.difficulty, undefined, combinedStyle));
        }

        // 3. Ejecutar en paralelo
        this.logger.log(`📋 Plan de Examen: ${topicsLog.join(' | ')}`);

        // Promise.allSettled es mejor que Promise.all porque si falla una, no cancela las demás
        const results = await Promise.allSettled(tasks);

        // 4. Filtrar éxitos
        const validProblems = results
            .filter(r => r.status === 'fulfilled' && r.value.success)
            .map((r: any) => r.value.data);

        this.logger.log(`✅ BATCH END: ${validProblems.length}/${safeQty} generados correctamente.`);

        return {
            success: true,
            count: validProblems.length,
            data: validProblems
        };
    }

    // En ai-generator.service.ts

    private async executeGeneration(
        provider: any,
        topic: string,
        grade: string,
        stage: string,
        difficulty: string,
        styleConstraint: string = ""
    ) {
        // 🔄 INTENTOS MÁXIMOS (Quality Gate)
        const MAX_RETRIES = 3;
        let lastError = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                this.logger.log(`🔄 Intento ${attempt}/${MAX_RETRIES} - Generando problema...`);

                // 1. PREPARAR PROMPT (Igual que antes)
                let systemPrompt = getSystemPrompt(topic, grade, stage, difficulty);
                const uniqueSeed = Math.random().toString(36).substring(7) + Date.now().toString();

                if (!systemPrompt) systemPrompt = new SystemMessage("Eres un profesor de matemáticas.");

                const messages = [
                    systemPrompt,
                    new HumanMessage(
                        `Genera un problema único sobre: "${topic}". 
                         Grado: ${grade}. Etapa: ${stage}. Dificultad: ${difficulty}.
                         - Semilla: ${uniqueSeed}           
                         REQUISITO (VARIABILIDAD): ${styleConstraint} 
                         Asegúrate de incluir 'visual_data'.`
                    ),
                ];

                // 2. LLAMADA A LA IA
                const result = await provider.generateStructured(messages, MathProblemSchema);

                // 3. SANITIZACIÓN Y CÁLCULO (EL DICTADOR)
                // Aquí validamos si el problema sirve. Si no sirve, lanzamos error para activar el retry.

                if (!result.math_data) {
                    throw new Error("La IA no generó math_data (Gráfico faltante).");
                }

                // --- INICIO BLOQUE DICTADOR MEJORADO ---
                const params = result.math_data.params;
                const type = result.math_data.type;

                // A) Limpiar X
                let rawX = parseFloat(params.x_value);
                if (isNaN(rawX)) {
                    // Si no hay X, a veces es válido (ej: estadística), pero en geometría suele ser error.
                    // Asumimos error si es geometría.
                    if (type.includes('segment') || type.includes('angle')) throw new Error("x_value inválido.");
                }

                // Forzamos entero si es nivel básico/intermedio (Opcional: puedes ajustar esto según dificultad)
                const cleanX = Math.round(rawX);
                params.x_value = cleanX;

                // B) Calcular Total
                const computedTotal = calculateGeometryTotal(result.math_data);

                if (computedTotal === null) {
                    throw new Error("Fallo en el cálculo matemático del Backend.");
                }

                // C) VALIDACIÓN CRÍTICA: ¿El total es coherente?
                // Si el total es 0 o negativo, es un problema roto. Reintentar.
                if (computedTotal <= 0) {
                    throw new Error(`Total matemático inválido: ${computedTotal}`);
                }

                const totalStr = computedTotal.toString();
                if (params) params.total_label = totalStr;

                // D) REGENERAR OPCIONES (Backend Authority)
                // Siempre generamos las opciones nosotros. Nunca confiamos en la IA.
                result.options = {
                    "A": (cleanX - 2).toString(),
                    "B": (cleanX - 1).toString(),
                    "C": cleanX.toString(),     // Correcta
                    "D": (cleanX + 1).toString(),
                    "E": (cleanX + 2).toString()
                };
                result.correct_answer = "C";

                // E) REESCRITURA TOTAL DEL ENUNCIADO (Fix Texto vs Imagen)
                // Aquí borramos el texto de la IA y ponemos el nuestro plantilla.
                if (type === 'collinear_segments' && Array.isArray(params.segments)) {
                    const segmentsText = params.segments.map((s: any, i: number) => {
                        const p1 = String.fromCharCode(65 + i);
                        const p2 = String.fromCharCode(65 + i + 1);
                        return `${p1}${p2} mide ${s.label}`;
                    }).join(', ');

                    // PLANTILLA MAESTRA
                    result.question_markdown = `En la figura, los puntos son colineales y consecutivos. Se sabe que ${segmentsText}. Si la longitud total AD es ${totalStr}, halla el valor de x.`;
                }
                else if (type === 'consecutive_angles' && Array.isArray(params.rays)) {
                    const anglesText = params.rays.map((r: any, i: number) => {
                        const p1 = String.fromCharCode(65 + i);
                        const p2 = String.fromCharCode(65 + i + 1);
                        return `m<${p1}O${p2} = (${r.angleLabel})°`;
                    }).join(', ');
                    result.question_markdown = `En la figura se muestran ángulos consecutivos. Se sabe que ${anglesText}. Si la suma total es ${totalStr}°, calcula x.`;
                }
                else {
                    // Fallback para otros tipos: Reemplazo simple
                    if (result.question_markdown) result.question_markdown = result.question_markdown.replace(/\[\[TOTAL\]\]/g, totalStr);
                }

                // F) SOBRESCRITURA DE SOLUCIÓN (Adiós texto gigante)
                // Escribimos nosotros la solución.
                result.solution_markdown = `
1. **Planteamiento:**
   La suma de las partes es igual al total:
   $$ Suma = ${totalStr} $$

2. **Resolución:**
   Al resolver la ecuación con los datos del gráfico:
   $$ ... \\to x = ${cleanX} $$

3. **Respuesta:**
   El valor de x es **${cleanX}**.
                `.trim();

                // --- FIN BLOQUE DICTADOR ---

                // 4. EJECUTAR FACTORY VISUAL (Ya sabemos que los datos son válidos)
                this.logger.log(`🏭 Ejecutando VisualFactory...`);
                const generatedVisual = VisualFactory(result.math_data);
                if (generatedVisual) {
                    result.visual_data = generatedVisual;
                }

                // SI LLEGAMOS AQUÍ, TODO ESTÁ PERFECTO. RETORNAMOS.
                this.logger.log(`✅ Problema generado exitosamente en intento ${attempt}.`);

                return {
                    success: true,
                    data: result,
                    provider: provider.providerName,
                };

            } catch (error) {
                lastError = error;
                this.logger.warn(`⚠️ Intento ${attempt} fallido: ${error.message}. Reintentando...`);
                // Si es el último intento, lanzamos el error
                if (attempt === MAX_RETRIES) {
                    this.logger.error(`💀 Se agotaron los reintentos. Error final: ${error.message}`);
                    throw error;
                }
            }
        }
    }

}