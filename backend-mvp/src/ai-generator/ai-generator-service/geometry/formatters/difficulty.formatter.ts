// src/ai-generator/formatters/difficulty.formatter.ts
import { formatFraction, formatMixed } from './display.formatter';

export function formatByDifficulty(
  rawX: number,
  difficulty: string,
): {
  cleanX: number;
  displayX: string;
  isFractionMode: boolean;
  isMixedMode: boolean;
  isBasic: boolean;
  isInter: boolean;
} {
  const isBasic =
    difficulty.toLowerCase().includes('básico') ||
    difficulty.toLowerCase().includes('basic');
  const isInter = difficulty.toLowerCase().includes('inter');
  const isAdvanced =
    difficulty.toLowerCase().includes('avanzado') ||
    difficulty.toLowerCase().includes('concurso');

  let isFractionMode = false;
  let isMixedMode = false;
  let displayX: string;
  let cleanX: number;

  if (isBasic || isInter) {
    // ---------- ENTEROS ESTRICTOS ----------
    cleanX = Math.round(rawX);
    if (isBasic) {
      if (cleanX < 2) cleanX = 2 + Math.floor(Math.random() * 11); // 2..12
      if (cleanX > 12) cleanX = 12 - Math.floor(Math.random() * 11);
    } else {
      if (cleanX < 13) cleanX = 13 + Math.floor(Math.random() * 7); // 13..19
      if (cleanX > 19) cleanX = 19 - Math.floor(Math.random() * 7);
    }
    displayX = cleanX.toString();
    isFractionMode = false;
  } else {
    // ---------- AVANZADO ----------
    if (Number.isInteger(rawX)) {
      const rand = Math.random();
      if (rand < 0.34) {
        cleanX = rawX;
      } else if (rand < 0.67) {
        cleanX = rawX + 0.5;
      } else {
        cleanX = rawX + 0.25;
      }
    } else {
      cleanX = Math.round(rawX * 4) / 4;
    }

    const formatRand = Math.random();
    if (formatRand < 0.4) {
      isFractionMode = false;
      isMixedMode = false;
      displayX =
        cleanX % 1 === 0
          ? cleanX.toString()
          : cleanX.toFixed(2).replace(/\.?0+$/, '');
    } else if (formatRand < 0.8) {
      isFractionMode = true;
      isMixedMode = false;
      displayX = formatFraction(cleanX);
    } else {
      isFractionMode = true;
      isMixedMode = true;
      if (cleanX < 1) {
        displayX = formatFraction(cleanX);
        isMixedMode = false;
      } else {
        displayX = formatMixed(cleanX);
      }
    }
  }

  return { cleanX, displayX, isFractionMode, isMixedMode, isBasic, isInter };
}
