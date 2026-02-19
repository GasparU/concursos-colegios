import Fraction from 'fraction.js';

export function mcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}
export function mcm(a: number, b: number): number {
  return (a * b) / mcd(a, b);
}
export function MCD(...nums: number[]): number {
  return nums.reduce((acc, n) => mcd(acc, n), nums[0]);
}
export function MCM(...nums: number[]): number {
  return nums.reduce((acc, n) => mcm(acc, n), 1);
}
export function numerador(frac: any): number {
  const f = new Fraction(frac);
  return Number(f.n);
}
export function denominador(frac: any): number {
  const f = new Fraction(frac);
  return Number(f.d);
}
