import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseGradoService } from './base.grado.service';
import { Plantilla } from '../parametric-generator.service';
import Fraction from 'fraction.js';

@Injectable()
export class QuintoGradoService extends BaseGradoService {
  construirEnunciado(
    plantilla: Plantilla,
    valores: Record<string, any>,
    scope: Record<string, any>,
    respuesta: any,
  ): string {
    const formatNum = this.formatNum;

    // Caso 1: Canje monetario (vuelto compra)
    if (
      plantilla.tema === 'canje_monetario' &&
      plantilla.subtipo === 'vuelto_compra'
    ) {
      const base = `${valores.nombre} tiene ${valores.cant_b} billetes de S/${formatNum(valores.val_b)}, ${valores.cant_m} monedas de S/${formatNum(valores.val_m)} y ${valores.cant_u} monedas de S/${formatNum(valores.val_u)}. Si ${valores.nombre} quiere comprar un ${valores.objeto} de S/${formatNum(valores.precio)}, `;
      if (respuesta >= 0) {
        return base + `¿cuánto dinero le sobra a ${valores.nombre}?`;
      } else {
        return (
          base +
          `¿cuánto dinero le falta a ${valores.nombre} para poder comprar el ${valores.objeto}?`
        );
      }
    }

    // Caso 2: Canje monetario (presupuesto gastos)
    if (
      plantilla.tema === 'canje_monetario' &&
      plantilla.subtipo === 'presupuesto_gastos'
    ) {
      const ingredientes = [
        `${formatNum(valores.cant_h)} kg de harina a S/${formatNum(valores.p_h)}/kg`,
        `${formatNum(valores.cant_a)} kg de azúcar a S/${formatNum(valores.p_a)}/kg`,
        `${formatNum(valores.cant_l)} L de leche a S/${formatNum(valores.p_l)}/L`,
        `${formatNum(valores.cant_m)} kg de mantequilla a S/${formatNum(valores.p_m)}/kg`,
        `${formatNum(valores.cant_hue)} huevos a S/${formatNum(valores.p_hue)} cada uno`,
      ];
      const lista = ingredientes.join(', ');
      const base = `${valores.nombre} prepara un pastel y compra: ${lista}. Si tiene S/${formatNum(valores.dinero_total)} en su billetera, `;
      if (respuesta >= 0) {
        return base + `¿cuánto dinero le sobra a ${valores.nombre}?`;
      } else {
        return (
          base + `¿cuánto dinero le falta a ${valores.nombre} para poder pagar?`
        );
      }
    }

    // Caso 3: Fracción de una fracción
    if (plantilla.tema === 'fraccion_de_una_fraccion') {
      if (plantilla.subtipo === 'reparto_sucesivo') {
        const fReparto = new Fraction(
          valores.f_reparto_num,
          valores.f_reparto_den,
        );
        const fUso1 = new Fraction(valores.f_uso1_num, valores.f_uso1_den);
        const fUso2 = new Fraction(valores.f_uso2_num, valores.f_uso2_den);
        return `En un taller se recibió una caja de papel. La profesora repartió ${fReparto.toFraction()} de la caja. De esa cantidad, los estudiantes usaron ${fUso1.toFraction()} para afiches y ${fUso2.toFraction()} para manualidades. ¿Qué fracción del total de la caja se utilizó en total?`;
      } else if (plantilla.subtipo === 'consumo_volumen') {
        const fCons1 = new Fraction(valores.f_cons1_num, valores.f_cons1_den);
        const fCons2 = new Fraction(valores.f_cons2_num, valores.f_cons2_den);
        return `${valores.nombre} compró una botella de ${valores.vol} ml. Consumió ${fCons1.toFraction()} del contenido. Luego, consumió ${fCons2.toFraction()} del volumen que quedaba. ¿Qué fracción del volumen total consumió en total?`;
      }
      throw new BadRequestException('Subtipo de fracción no reconocido');
    }

      // Dentro de construirEnunciado, después de los casos especiales (canje, fracciones)
        if (plantilla.tema === 'ecuaciones_simples' && plantilla.subtipo === 'lineal') {
          const variantes = ['suma_resta', 'resta_suma', 'mul_div', 'div_mul'];
          const variante = variantes[Math.floor(Math.random() * variantes.length)];
          
          let enunciado = '';
          let x: number; // declarada sin inicializar

          const a = valores.a;
          const b = valores.b;
          const c = valores.c;

          switch (variante) {
            case 'suma_resta':
              x = a - b + c;
              enunciado = `Si a un número le sumamos ${b} y luego le restamos ${c}, obtenemos ${a}. ¿Cuál es el número?`;
              break;
            case 'resta_suma':
              x = a + b - c;
              enunciado = `Si a un número le restamos ${b} y luego le sumamos ${c}, obtenemos ${a}. ¿Cuál es el número?`;
              break;
            case 'mul_div':
              if ((c * b) % a !== 0) {
                throw new Error('Resultado no entero');
              }
              x = (c * b) / a;
              enunciado = `Si multiplicamos un número por ${a} y luego lo dividimos entre ${b}, obtenemos ${c}. ¿Cuál es el número?`;
              break;
            case 'div_mul':
              if ((c * a) % b !== 0) {
                throw new Error('Resultado no entero');
              }
              x = (c * a) / b;
              enunciado = `Si dividimos un número entre ${a} y luego lo multiplicamos por ${b}, obtenemos ${c}. ¿Cuál es el número?`;
              break;
            default:
              throw new Error('Variante no reconocida');
          }

          // Validar rango
          if (x < 2 || x > 100) {
            throw new Error('x fuera de rango');
          }

          // Guardar en scope para que el orquestador lo use como respuesta
          scope.x = x;

          return enunciado;
        }

    // Caso genérico: reemplazar placeholders
    let enunciado = plantilla.enunciado;
    for (const key of Object.keys(plantilla.variables)) {
      const val = valores[key];
      if (val !== undefined) {
        const strVal = typeof val === 'number' ? formatNum(val) : String(val);
        enunciado = enunciado.replace(new RegExp(`{${key}}`, 'g'), strVal);
      }
    }
    return enunciado;
  }
}
