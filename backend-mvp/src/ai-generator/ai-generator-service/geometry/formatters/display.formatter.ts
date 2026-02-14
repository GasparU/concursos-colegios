// src/ai-generator/formatters/display.formatter.ts

function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

export function decimalToFraction(decimal: number): string {
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
  return `\\frac{${h1}}{${k1}}`;
}

export function formatFraction(val: number): string {
  if (Number.isInteger(val)) return val.toString();
  const n = Math.round(val * 4);
  const g = gcd(n, 4);
  const num = n / g;
  const den = 4 / g;
  return `\\frac{${num}}{${den}}`;
}

export function formatMixed(val: number): string {
  if (Number.isInteger(val)) return val.toString();
  const n = Math.round(val * 4);
  const g = gcd(n, 4);
  let num = n / g;
  let den = 4 / g;
  const whole = Math.floor(num / den);
  const remainder = num % den;
  if (remainder === 0) return whole.toString();
  if (whole === 0) return `\\frac{${num}}{${den}}`;
  return `${whole}\\frac{${remainder}}{${den}}`;
}
