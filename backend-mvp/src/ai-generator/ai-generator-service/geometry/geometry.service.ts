// src/ai-generator/geometry/geometry.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { VisualFactory } from 'src/ai-generator/visual-factory';
import { calculateGeometryTotal } from 'src/ai-generator/geometry.calculator';
import { buildOptions, formatByDifficulty, generateDistractors } from './formatters';
import { sanitizeAngles, sanitizeSegments } from './sanitizers';
import { buildSolution } from './builders';


@Injectable()
export class GeometryService {
  private readonly logger = new Logger(GeometryService.name);

  async processGeometry(
    result: any,
    topic: string,
    difficulty: string,
    providerName: string,
  ) {
    const params = result.math_data.params;
    const type = result.math_data.type;

    // Validar rayos para ángulos
    if (
      type === 'consecutive_angles' &&
      (!params.rays || params.rays.length < 2)
    ) {
      throw new Error('El problema de ángulos requiere al menos 2 rayos.');
    }

    // Obtener rawX
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

    if (isNaN(rawX) && (type.includes('segment') || type.includes('angle'))) {
      throw new Error('x_value inválido o ausente. La IA no generó el número.');
    }

    const { cleanX, displayX, isFractionMode, isMixedMode, isBasic, isInter } =
      formatByDifficulty(rawX, difficulty);
    params.x_value = cleanX;
    console.log('✅ [DEBUG] cleanX asignado:', cleanX);

    if (params.segments)
      console.log(
        '📦 [DEBUG] segmentos antes sanitizar:',
        params.segments.length,
      );
    if (params.rays)
      console.log('📐 [DEBUG] rayos antes sanitizar:', params.rays.length);

    // Sanitizar
    if (params.segments && Array.isArray(params.segments)) {
      params.segments = sanitizeSegments(params.segments, cleanX);
    }
    if (params.rays && Array.isArray(params.rays)) {
      params.rays = sanitizeAngles(params.rays, cleanX, this.logger);
    } else if (type === 'consecutive_angles') {
      console.error(
        '❌ [SANITIZE] type es consecutive_angles pero params.rays no existe',
      );
      throw new Error('El problema de ángulos consecutivos requiere rays');
    }

    // Validar etiquetas basura en segmentos
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

    // Calcular total
    const computedTotal = calculateGeometryTotal(result.math_data);
    console.log('🧮 [DEBUG] computedTotal =', computedTotal);
    if (computedTotal === null || computedTotal <= 0) {
      console.error(
        '❌ [DEBUG] Total inválido, rayos:',
        JSON.stringify(params.rays),
      );
      throw new Error('Fallo en el cálculo matemático del Backend.');
    }

    // Validación específica para ángulos
    if (type === 'consecutive_angles') {
      this.logger.debug(`🧮 Total calculado para ángulos: ${computedTotal}`);
      if (computedTotal === null || computedTotal <= 0) {
        this.logger.error(
          `❌ Total inválido: ${computedTotal}, rayos: ${JSON.stringify(params.rays)}`,
        );
        throw new Error('Fallo en el cálculo matemático del Backend.');
      }
    }

    const totalStr = computedTotal.toString();
    if (params) params.total_label = totalStr;

    // Reemplazar [[TOTAL]] en el enunciado
    if (
      result.question_markdown &&
      result.question_markdown.includes('[[TOTAL]]')
    ) {
      result.question_markdown = result.question_markdown.replace(
        /\[\[TOTAL\]\]/g,
        totalStr,
      );
    }

    // Generar opciones
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

    // Generar solución
    result.solution_markdown = buildSolution(type, params, totalStr, displayX);

    // VisualFactory
    this.logger.log(`🏭 Ejecutando VisualFactory...`);
    const generatedVisual = VisualFactory(result.math_data);
    if (generatedVisual) {
      result.visual_data = generatedVisual;
    }

    return result;
  }
}
