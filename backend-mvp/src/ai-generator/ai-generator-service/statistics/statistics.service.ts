// src/ai-generator/statistics/statistics.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { calculateStatistics } from 'src/ai-generator/statistics.calculator';


@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  async processStatistics(result: any): Promise<any> {
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

    // Aplicar actualizaciones visuales
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
            result.visual_data.data.sectors[update.index].value = update.value;
          }
        } else if (result.visual_data.type === 'frequency_table') {
          if (update.rowIndex !== undefined) {
            result.visual_data.data.rows[update.rowIndex][1] = update.value;
          }
        }
      }
    }

    // Sobrescribir solución
    result.solution_markdown = statsResult.solutionMarkdown;

    // Generar opciones
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
      ...distractors.slice(0, 4).map((d) => ({ val: d, isCorrect: false })),
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

    return result;
  }
}
