import Fraction from 'fraction.js';

export const formatNum = (n: number): string => {
  if (Number.isInteger(n)) return n.toString();
  return parseFloat(n.toFixed(2)).toString();
};

export const formatRespuesta = (respuesta: any, formato: any): any => {
  if (!formato) return respuesta;
  if (formato.tipo === 'entero') {
    return Math.round(respuesta);
  } else if (formato.tipo === 'decimal') {
    return parseFloat(respuesta.toFixed(formato.decimales || 2));
  } else if (formato.tipo === 'fraccion') {
    const frac = new Fraction(respuesta);
    return { numerador: Number(frac.n), denominador: Number(frac.d) };
  }
  return respuesta;
};
