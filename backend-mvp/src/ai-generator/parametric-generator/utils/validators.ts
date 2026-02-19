/**
 * Funciones de validación para restricciones complejas
 * (pueden ser usadas en el futuro, aunque actualmente no son necesarias)
 */

/**
 * Valida que un número esté dentro de un rango
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
): boolean {
  return value >= min && value <= max;
}

/**
 * Valida que una fracción sea propia (numerador < denominador)
 */
export function validateProperFraction(
  numerator: number,
  denominator: number,
): boolean {
  return numerator < denominator;
}

/**
 * Valida que la suma de dos fracciones no exceda 1 (para evitar usar más de lo repartido)
 */
export function validateFractionSum(f1: number, f2: number): boolean {
  return f1 + f2 <= 1;
}
