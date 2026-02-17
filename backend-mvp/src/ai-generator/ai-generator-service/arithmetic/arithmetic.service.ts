// src/ai-generator/arithmetic/arithmetic.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { calculateArithmetic } from './arithmetic.calculator';


@Injectable()
export class ArithmeticService {
  private readonly logger = new Logger(ArithmeticService.name);

  // Lista de tipos que tienen calculador
  private readonly calculableTypes = [
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

  async processArithmetic(result: any, topic: string): Promise<any> {
    const mathData = result.math_data;

    // Si tiene un tipo calculable, usamos el calculador
    if (mathData && this.calculableTypes.includes(mathData.type)) {
      this.logger.log(
        `🔢 Problema de aritmética (${mathData.type}) detectado, procesando con calculador...`,
      );

      const arithResult = calculateArithmetic(mathData);
      if (!arithResult) {
        throw new Error(
          'El calculador de aritmética no pudo obtener un resultado válido',
        );
      }

      // Sobrescribir solución y eliminar visual_data
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

    // Early return para aritmética simple (sin calculador)
    this.logger.log(
      `🔢 Problema de aritmética detectado (${topic}), retornando directamente.`,
    );
    result.visual_data = null;
    return result;
  }
}
