// src/ai-generator/formatters/options.builder.ts
import { formatFraction, formatMixed } from './display.formatter';

export function buildOptions(
  correctVal: number,
  distractors: number[],
  isBasic: boolean,
  isInter: boolean,
  isFractionMode: boolean,
  isMixedMode: boolean,
): { options: Record<string, string>; correct_answer: string } {
  const optionsPool = [
    { val: correctVal, isCorrect: true },
    ...distractors.slice(0, 4).map((d) => ({ val: d, isCorrect: false })),
  ].sort(() => Math.random() - 0.5);

  const letters = ['A', 'B', 'C', 'D', 'E'];
  const options: Record<string, string> = {};
  let correct_answer = '';

  optionsPool.forEach((opt, index) => {
    if (index < 5) {
      const letter = letters[index];
      let optionText: string;

      if (isBasic || isInter) {
        optionText = opt.val.toString();
      } else {
        if (!isFractionMode) {
          optionText =
            opt.val % 1 === 0
              ? opt.val.toString()
              : opt.val.toFixed(2).replace(/\.?0+$/, '');
        } else if (!isMixedMode) {
          optionText = `$${formatFraction(opt.val)}$`;
        } else {
          optionText =
            opt.val < 1
              ? `$${formatFraction(opt.val)}$`
              : `$${formatMixed(opt.val)}$`;
        }
      }

      options[letter] = optionText;
      if (opt.isCorrect) {
        correct_answer = letter;
      }
    }
  });

  return { options, correct_answer };
}
