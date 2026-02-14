// src/ai-generator/formatters/distractors.generator.ts

export function generateDistractors(
  correctVal: number,
  isBasic: boolean,
  isInter: boolean,
  isFractionMode: boolean,
): number[] {
  let distractors: number[] = [];

  if (isBasic || isInter) {
    // Enteros: diferencias de 1 y 2
    distractors = [
      correctVal - 2,
      correctVal - 1,
      correctVal + 1,
      correctVal + 2,
    ];
    if (isBasic) {
      distractors = distractors.map((d) => (d < 1 ? d + 3 : d));
    }
  } else {
    // Avanzado
    if (isFractionMode) {
      distractors = [
        correctVal - 0.5,
        correctVal + 0.5,
        correctVal - 0.25,
        correctVal + 0.25,
      ];
    } else {
      distractors = [
        correctVal - 1,
        correctVal + 1,
        correctVal - 0.5,
        correctVal + 0.5,
        correctVal - 0.25,
        correctVal + 0.25,
      ];
    }
    // Redondear a 2 decimales o múltiplos de 0.25 (usamos *5/5 para simplificar)
    distractors = distractors.map((d) => Math.round(d * 5) / 5);
  }

  // Eliminar duplicados y el valor correcto
  distractors = [...new Set(distractors)].filter((d) => d !== correctVal);

  // Rellenar si faltan
  while (distractors.length < 4) {
    distractors.push(correctVal + (distractors.length + 1) * 0.5);
  }

  return distractors;
}
