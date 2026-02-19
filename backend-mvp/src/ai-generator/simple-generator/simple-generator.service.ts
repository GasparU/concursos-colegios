import { Injectable } from '@nestjs/common';
import Fraction from 'fraction.js';

export interface ProblemaSimple {
  tipo: 'operaciones' | 'fracciones' | 'sucesiones';
  enunciado: string;
  respuesta: any;
  latex?: string;
}

@Injectable()
export class SimpleGeneratorService {
  // ========== GENERADOR DE OPERACIONES COMBINADAS ==========
  generarOperaciones(): ProblemaSimple {
    // Elige aleatoriamente una estructura
    const opciones = [
      {
        nArgs: 2,
        fn: (a: number, b: number) => ({ expr: `${a} + ${b}`, res: a + b }),
      },
      {
        nArgs: 2,
        fn: (a: number, b: number) => ({ expr: `${a} - ${b}`, res: a - b }),
      },
      {
        nArgs: 2,
        fn: (a: number, b: number) => ({ expr: `${a} * ${b}`, res: a * b }),
      },
      {
        nArgs: 3,
        fn: (a: number, b: number, c: number) => ({
          expr: `(${a} + ${b}) * ${c}`,
          res: (a + b) * c,
        }),
      },
      {
        nArgs: 3,
        fn: (a: number, b: number, c: number) => ({
          expr: `${a} * ${b} - ${c}`,
          res: a * b - c,
        }),
      },
      {
        nArgs: 4,
        fn: (a: number, b: number, c: number, d: number) => ({
          expr: `${a} * ${b} + ${c} / ${d}`,
          res: a * b + c / d,
        }),
      },
    ];

    const idx = Math.floor(Math.random() * opciones.length);
    const opcion = opciones[idx];

    // Función para generar número con 2 decimales exactos
    const rand = (min: number, max: number, step = 0.1): number => {
      const steps = Math.floor((max - min) / step);
      let valor = min + Math.floor(Math.random() * (steps + 1)) * step;
      return Math.round(valor * 100) / 100;
    };

    let expr: string;
    let res: number;

    if (opcion.nArgs === 2) {
      const a = rand(0.5, 15);
      const b = rand(0.5, 15);
      const r = (opcion.fn as (a: number, b: number) => any)(a, b);
      expr = r.expr;
      res = r.res;
    } else if (opcion.nArgs === 3) {
      const a = rand(1, 10);
      const b = rand(1, 10);
      const c = rand(1, 10);
      const r = (opcion.fn as (a: number, b: number, c: number) => any)(
        a,
        b,
        c,
      );
      expr = r.expr;
      res = r.res;
    } else {
      const a = rand(1, 8);
      const b = rand(1, 8);
      const c = rand(1, 8);
      let d = rand(1, 8, 0.5);
      if (d === 0) d = 0.5;
      const r = (
        opcion.fn as (a: number, b: number, c: number, d: number) => any
      )(a, b, c, d);
      expr = r.expr;
      res = r.res;
    }

    // Redondear resultado a 2 decimales
    const respuesta = Math.round(res * 100) / 100;
    // Limpiar la expresión (redondear los números mostrados)
    expr = expr.replace(/\d+\.?\d*/g, (match) => {
      const num = parseFloat(match);
      return Math.round(num * 100) / 100 + '';
    });

    const latex = expr.replace(/\*/g, ' \\times ');
    const enunciado = `Calcula el valor de: ${expr}`;

    return {
      tipo: 'operaciones',
      enunciado,
      respuesta,
      latex,
    };
  }

  // ========== GENERADOR DE FRACCIONES ==========
  generarFracciones(): ProblemaSimple {
    const operador = Math.random() < 0.5 ? '+' : '-';

    const generarFraccion = () => {
      const den = Math.floor(Math.random() * 11) + 2; // 2..12
      const num = Math.floor(Math.random() * (den * 2)) + 1; // 1..2*den
      return new Fraction(num, den);
    };

    let f1 = generarFraccion();
    let f2 = generarFraccion();
    let resultado: any; // Usamos any para evitar problemas de tipo con Fraction

    if (operador === '+') {
      resultado = f1.add(f2);
    } else {
      resultado = f1.sub(f2);
    }

    // Convertir a número (ya que Fraction puede devolver bigint)
    const num = Number(resultado.n);
    const den = Number(resultado.d);

    const frac1 = `\\frac{${f1.n}}{${f1.d}}`;
    const frac2 = `\\frac{${f2.n}}{${f2.d}}`;
    const enunciado = `Calcula: $${frac1} ${operador} ${frac2}$`;
    const respuesta = { numerador: num, denominador: den };

    return {
      tipo: 'fracciones',
      enunciado,
      respuesta,
    };
  }

  // ========== GENERADOR DE SUCESIONES ==========
  generarSucesion(): ProblemaSimple {
    const tipos = ['aritmetica', 'geometrica', 'fibonacci', 'alterna'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];

    let enunciado: string;
    let respuesta: number;

    switch (tipo) {
      case 'aritmetica': {
        const a1 = Math.floor(Math.random() * 10) + 1;
        const r = Math.floor(Math.random() * 5) + 1;
        const n = Math.floor(Math.random() * 8) + 5;
        const an = a1 + (n - 1) * r;
        const terminos = [a1, a1 + r, a1 + 2 * r, a1 + 3 * r, a1 + 4 * r].join(
          ', ',
        );
        enunciado = `Halla el término ${n} de la sucesión: ${terminos}, ...`;
        respuesta = an;
        break;
      }
      case 'geometrica': {
        const a1 = Math.floor(Math.random() * 5) + 1;
        const r = Math.floor(Math.random() * 3) + 2;
        const n = Math.floor(Math.random() * 6) + 4;
        const an = a1 * Math.pow(r, n - 1);
        const terminos = [a1, a1 * r, a1 * r * r, a1 * r * r * r].join(', ');
        enunciado = `Halla el término ${n} de la sucesión: ${terminos}, ...`;
        respuesta = an;
        break;
      }
      case 'fibonacci': {
        const a1 = Math.floor(Math.random() * 5) + 1;
        const a2 = Math.floor(Math.random() * 5) + 1;
        const n = Math.floor(Math.random() * 8) + 5;
        let a = a1,
          b = a2;
        for (let i = 3; i <= n; i++) {
          [a, b] = [b, a + b];
        }
        const an = b;
        const terminos = [a1, a2, a1 + a2, a1 + 2 * a2].join(', ');
        enunciado = `Halla el término ${n} de la sucesión: ${terminos}, ...`;
        respuesta = an;
        break;
      }
      case 'alterna': {
        const a1 = Math.floor(Math.random() * 5) + 1;
        const a2 = Math.floor(Math.random() * 5) + 3;
        const rPar = Math.floor(Math.random() * 3) + 2;
        const rImpar = Math.floor(Math.random() * 3) + 2;
        const n = Math.floor(Math.random() * 8) + 5;
        const terminos: number[] = [];
        for (let i = 1; i <= 5; i++) {
          if (i % 2 === 1) {
            terminos.push(a1 + Math.floor((i - 1) / 2) * rImpar);
          } else {
            terminos.push(a2 + (Math.floor(i / 2) - 1) * rPar);
          }
        }
        let an;
        if (n % 2 === 1) {
          const k = Math.floor((n - 1) / 2);
          an = a1 + k * rImpar;
        } else {
          const k = Math.floor(n / 2) - 1;
          an = a2 + k * rPar;
        }
        enunciado = `Halla el término ${n} de la sucesión: ${terminos.join(', ')}, ...`;
        respuesta = an;
        break;
      }
      default:
        throw new Error('Tipo de sucesión no válido');
    }

    return {
      tipo: 'sucesiones',
      enunciado,
      respuesta,
    };
  }

  generar(tipo?: 'operaciones' | 'fracciones' | 'sucesiones'): ProblemaSimple {
    if (tipo) {
      switch (tipo) {
        case 'operaciones':
          return this.generarOperaciones();
        case 'fracciones':
          return this.generarFracciones();
        case 'sucesiones':
          return this.generarSucesion();
      }
    } else {
      const r = Math.floor(Math.random() * 3);
      if (r === 0) return this.generarOperaciones();
      if (r === 1) return this.generarFracciones();
      return this.generarSucesion();
    }
  }
}
