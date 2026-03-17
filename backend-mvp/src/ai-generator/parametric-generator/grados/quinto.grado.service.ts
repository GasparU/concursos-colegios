import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseGradoService } from './base.grado.service';
import { Plantilla } from '../parametric-generator.service';
import Fraction from 'fraction.js';
import { obtenerAngulosArco } from '../utils/geometriaHelpers';
import { MCD } from '../utils/math-helpers';

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

    let enunciadoBase = String(plantilla.enunciado || '');

    // 🔥 2. PEGA ESTE BLOQUE EXACTAMENTE DEBAJO DE TU VARIABLE:
    if (plantilla.id && plantilla.id.includes('geo_segmentos')) {
      const pos = valores.var_pos !== undefined ? valores.var_pos : 0;
      let texto = '';

      // 🚀 DECLARACIÓN SEGURA: La creamos aquí arriba para que todo el bloque la vea
      const nombrarProp = (num: number) => {
        const nombres: Record<number, string> = {
          2: 'el doble',
          3: 'el triple',
          4: 'el cuádruple',
          5: 'el quíntuple',
        };
        return nombres[num] || `${num} veces`;
      };

      if (plantilla.id.includes('basico')) {
        texto =
          pos === 0
            ? `C es punto medio de BD, AB = x + ${valores.cte} y CD = ${valores.y}`
            : pos === 1
              ? `AB y CD son congruentes (cada uno mide ${valores.y} u) y BC = x + ${valores.cte}`
              : `B es punto medio de AC, AB = ${valores.y} y CD = x + ${valores.cte}`;
      } else if (plantilla.id.includes('intermedio')) {
        // Ahora TypeScript sí encuentra la función sin problemas
        const tm = nombrarProp(valores.m || 2);
        const tn = nombrarProp(valores.n || 3);

        texto =
          pos === 0
            ? `la medida de BC es ${tm} de AB, y CD es ${tn} de AB`
            : pos === 1
              ? `la medida de CD es ${tm} de AB, y BC es ${tn} de AB`
              : pos === 2
                ? `la medida de AB es ${tm} de BC, y CD es ${tn} de BC`
                : pos === 3
                  ? `la medida de CD es ${tm} de BC, y AB es ${tn} de BC`
                  : pos === 4
                    ? `la medida de AB es ${tm} de CD, y BC es ${tn} de CD`
                    : `la medida de BC es ${tm} de CD, y AB es ${tn} de CD`;
      } else if (plantilla.id.includes('avanzado')) {
        texto =
          pos === 0
            ? `BC excede a AB en ${valores.razon} u, CD excede a AB en ${2 * valores.razon} u y DE excede a AB en ${4 * valores.razon} u`
            : pos === 1
              ? `AB excede a BC en ${3 * valores.razon} u, CD excede a BC en ${valores.razon} u y DE excede a BC en ${4 * valores.razon} u`
              : pos === 2
                ? `AB excede a CD en ${3 * valores.razon} u, BC excede a CD en ${valores.razon} u y DE excede a CD en ${4 * valores.razon} u`
                : `AB excede a DE en ${3 * valores.razon} u, BC excede a DE en ${valores.razon} u y CD excede a DE en ${2 * valores.razon} u`;
      } else if (plantilla.id.includes('experto')) {
        texto = `AC = ${valores.ac} u, BD = ${valores.bd} u y CE = ${valores.ce} u`;
      }

      enunciadoBase = enunciadoBase.replace('{texto_dinamico}', texto);
    }

    if (plantilla.subtipo === 'area_rombo') {
      if (plantilla.dificultad.includes('basico')) {
        return `Calcula el área del rombo mostrado en la figura.`;
      }
      return `Calcula el valor de "x" sabiendo que el área del rombo mostrado es ${valores.area} cm².`;
    }

    // 🔥 NARRATIVA: ÁREA DE TRAPECIO
    if (plantilla.subtipo === 'area_trapecio') {
      // Formateador local para leer la altura experta si existe
      const formatAlgLocal = (coef: any, cte: any) => {
        const c = Number(coef) || 0;
        const k = Number(cte) || 0;
        if (c === 0 && k === 0) return '0';
        if (c === 0) return `${k}`;
        let pre = c === 1 ? 'x' : c === -1 ? '-x' : `${c}x`;
        if (k === 0) return pre;
        return k > 0 ? `${pre} + ${k}` : `${pre} - ${Math.abs(k)}`;
      };

      // Obtenemos la altura limpia para el texto
      let txtH = `${valores.h}`;
      if (plantilla.dificultad.includes('experto')) {
        txtH = formatAlgLocal(valores.e, valores.f);
      }

      if (plantilla.dificultad.includes('basico')) {
        return `Calcula el área del trapecio mostrado, sabiendo que su altura es ${txtH} cm.`;
      }
      return `Calcula el valor de "x" sabiendo que el área del trapecio mostrado es ${valores.area} cm² y su altura es ${txtH} cm.`;
    }

    // 🔥 NARRATIVA: ÁREA DE PARALELOGRAMO (Con datos explícitos)
    if (plantilla.subtipo === 'area_paralelogramo') {
      const formatAlgLocal = (coef: any, cte: any, fallback: any) => {
        const valA = Number(coef) || 0;
        const valB = Number(cte) || 0;
        if (valA === 0 && valB === 0) return `${fallback}`;
        if (valA === 0) return `${valB}`;
        let pre = valA === 1 ? 'x' : valA === -1 ? '-x' : `${valA}x`;
        if (valB === 0) return pre;
        return valB > 0 ? `${pre} + ${valB}` : `${pre} - ${Math.abs(valB)}`;
      };

      const B_real = Number(valores.B) || 15;
      const L_real = Number(valores.L) || 10;

      let txtB = '',
        txtL = '';
      if (plantilla.dificultad.includes('basico')) {
        txtB = `${B_real}`;
        txtL = `${L_real}`;
      } else if (plantilla.dificultad.includes('intermedio')) {
        txtB = formatAlgLocal(valores.a, valores.b, B_real);
        txtL = `${L_real}`;
      } else {
        txtB = formatAlgLocal(valores.a, valores.b, B_real);
        txtL = formatAlgLocal(valores.c, valores.d, L_real);
      }

      if (valores.area) {
        valores.area = Number(Math.round(valores.area * 100) / 100);
      }
      if (valores.respuesta) {
        valores.respuesta = Number(Math.round(valores.respuesta * 100) / 100);
      }

      if (plantilla.dificultad.includes('basico'))
        return `Calcula el área del paralelogramo ABCD sabiendo que AB = ${txtB} cm y AD = ${txtL} cm.`;
      if (plantilla.dificultad.includes('experto'))
        return `El perímetro del paralelogramo ABCD es ${valores.perimetro} cm. Si AB = ${txtB} cm y AD = ${txtL} cm, calcula su área total.`;

      return `Calcula el valor de "x" sabiendo que el área del paralelogramo ABCD es ${valores.area} cm², AB = ${txtB} cm y AD = ${txtL} cm.`;
    }

    if (plantilla.subtipo === 'area_sombreada') {
      const tipo = valores.tipo_fig;

      if (plantilla.dificultad.includes('basico')) {
        if (tipo === 0)
          return `Calcula el área de la región sombreada si ABCD es un cuadrado de lado ${valores.v1} cm y la base del triángulo blanco inferior mide ${valores.v2} cm.`;
        if (tipo === 1)
          return `Calcula el área de la región sombreada si ABCD es un cuadrado de lado ${valores.v1} cm y el cuadrado blanco de la esquina tiene lado ${valores.v2} cm.`;
        if (tipo === 2)
          return `Calcula el área sombreada si ABCD es un cuadrado de lado ${valores.v1} cm y la base del triángulo blanco superior mide ${valores.v2} cm.`;
        if (tipo === 3)
          return `Calcula el área de la región sombreada si ABCD es un rectángulo con base ${valores.v1} cm y altura ${valores.v2} cm, el cual contiene un rombo inscrito.`;
        if (tipo === 4)
          return `En el cuadrado ABCD de lado ${valores.v1} cm, se han recortado dos triángulos blancos en las esquinas cuyas bases inferiores miden ${valores.v2} cm. Halla el área de la región sombreada.`;
      }

      if (plantilla.dificultad.includes('intermedio')) {
        if (tipo === 0)
          return `Calcula el área de la corona circular sabiendo que el radio mayor es R = ${valores.R} cm y el radio menor es r = ${valores.r} cm. Considera pi = 3.14.`;
        if (tipo === 1)
          return `En el cuadrado ABCD de lado ${valores.R} cm se ha inscrito un círculo de radio "r". Calcula el área de las esquinas sombreadas. Considera pi = 3.14.`;
        if (tipo === 2)
          return `Calcula el área de la región sombreada (mitad de una corona circular) si R = ${valores.R} cm y r = ${valores.r} cm. Considera pi = 3.14.`;
        if (tipo === 3)
          return `Calcula el área del cuadrante de corona circular mostrado, sabiendo que R = ${valores.R} cm y r = ${valores.r} cm. Considera pi = 3.14.`;
      }

      // 🔥 DENTRO DE construirEnunciado (Nivel Avanzado)
      if (plantilla.dificultad.includes('avanzado')) {
        const k = valores.k || 1;
        const x = valores.x || 3;

        // Generador de álgebra perfecta (Inverso)
        const fExp = (target: number, coef: number) => {
          const cte = target - coef * x;
          return cte === 0
            ? `${coef}x`
            : cte < 0
              ? `${coef}x - ${Math.abs(cte)}`
              : `${coef}x + ${cte}`;
        };

        if (tipo === 0)
          return `En la figura (A), dos triángulos comparten una altura común. En el triángulo izquierdo (45°), la altura mide ${fExp(12 * k, 2)} cm y la base mide ${fExp(12 * k, 3)} cm. Usando la relación de catetos, halla "x" y calcula el área total sombreada sabiendo que la base derecha mide ${9 * k} cm.`;
        if (tipo === 1)
          return `Calcula el área del romboide mostrado sabiendo que su base inferior mide ${15 * k} cm. Su lado lateral inclinado mide ${10 * k} cm y forma un ángulo de 53°.`;
        if (tipo === 2)
          return `Calcula el área del polígono irregular en forma de L. Asume que todas sus esquinas forman ángulos rectos (90°).`;
        if (tipo === 3)
          return `Halla el área del polígono compuesto (Triángulo + Rectángulo). El triángulo posee una hipotenusa real de ${17 * k} cm y una base de ${8 * k} cm (Triada 8-15-17). El rectángulo adyacente tiene base ${10 * k} cm.`;
        if (tipo === 4)
          return `Se tiene un rectángulo de base ${14 * k} cm y altura ${10 * k} cm, del cual se ha recortado un triángulo blanco en la base. Calcula el área de la región sombreada azul.`;
        if (tipo === 5)
          return `Calcula el área del trapecio sombreado sabiendo que su base mayor mide ${16 * k} cm, su base menor ${10 * k} cm y su altura ${8 * k} cm.`;
        if (tipo === 6)
          return `Halla el área de la figura (Rombo inscrito en rectángulo), sabiendo que las dimensiones totales son ${16 * k} cm de ancho y ${12 * k} cm de alto.`;
        if (tipo === 7)
          return `Calcula el área total de la región sombreada en forma de "corbata". Las dos figuras son idénticas, con bases de ${10 * k} cm y una altura compartida de ${15 * k} cm.`;
      }

      if (plantilla.dificultad.includes('experto')) {
        const eqExt =
          valores.b === 0 ? `${valores.a}x` : `${valores.a}x + ${valores.b}`;
        // 🔥 Limpia los decimales infinitos
        const areaLimpia = Number(Math.round(valores.area * 100) / 100);

        if (tipo === 0 || tipo === 2) {
          return `En la corona circular mostrada, el radio mayor es R = ${eqExt} cm y el radio menor es r = x + 1 cm. Si el área de la región sombreada es ${areaLimpia} cm², determina el valor de x. (Considera pi = 3.14).`;
        } else {
          return `La figura muestra una cadena de ${valores.num_aros} aros circulares entrelazados. Cada aro tiene un radio mayor R = ${eqExt} cm y un radio menor r = x + 1 cm. Si al desenlazar la cadena, la suma total de las áreas de los aros individuales es ${areaLimpia} cm², halla el valor de x. (Considera pi = 3.14).`;
        }
      }
    }

    // 🔥 NARRATIVA: VOLUMEN DE PRISMA (Con fix de decimales)
    if (plantilla.subtipo === 'volumen_prisma') {
      const volLimpio = parseFloat(Number(valores.volumen).toFixed(2));
      if (plantilla.dificultad.includes('basico'))
        return `Calcula el volumen del prisma rectangular mostrado.`;
      return `Calcula el valor de "x" sabiendo que el volumen del prisma mostrado es ${volLimpio} cm³.`;
    }

    if (plantilla.subtipo === 'volumen_prisma_triangular') {
      const volLimpio = parseFloat(Number(valores.volumen).toFixed(2));
      if (plantilla.dificultad.includes('basico'))
        return `Calcula el volumen del prisma triangular mostrado.`;
      return `Calcula el valor de "x" sabiendo que el volumen del prisma triangular es ${volLimpio} cm³.`;
    }

    // 🔥 NARRATIVA: VOLUMEN DE PIRÁMIDE (Fix de "Generado dinámicamente")
    if (plantilla.subtipo === 'volumen_piramide') {
      const volLimpio = parseFloat(Number(valores.volumen).toFixed(2));

      if (plantilla.dificultad.includes('basico')) {
        return `Calcula el volumen de una pirámide cuadrangular cuyo lado de la base mide ${valores.lado} cm y su altura es de ${valores.h} cm.`;
      }

      return `Halla el valor de "x" si se sabe que el volumen de la pirámide cuadrangular mostrada es ${volLimpio} cm³.`;
    }

    if (plantilla.subtipo === 'perimetro_escalera') {
      let enunciado = plantilla.enunciado;
      const v = valores;
      const tipo = v.tipo_fig !== undefined ? v.tipo_fig : 0;

      const fPoly = (a: number, c: number) => {
        const aStr = a === 1 ? `x²` : `${a}x²`;
        if (c === 0) return aStr;
        return c < 0 ? `${aStr} - ${Math.abs(c)}` : `${aStr} + ${c}`;
      };

      if (plantilla.dificultad.includes('experto')) {
        enunciado = enunciado.replace(
          '{perimetro}',
          `( ${fPoly(v.p_a, v.cte_p)} )`,
        );
      } else {
        enunciado = enunciado.replace('{perimetro}', String(v.perimetro));
      }

      // 🔥 BLINDAJE PEDAGÓGICO AUTOMÁTICO
      if (tipo === 1 && !enunciado.includes('tramos verticales')) {
        enunciado +=
          ' (Nota: Asume que todos los tramos verticales miden exactamente lo mismo).'; // <-- Sin el "4"
      }
      if (tipo === 3 && !enunciado.includes('profundidad')) {
        enunciado +=
          ' (Nota: Asume que ambos recortes verticales tienen la misma profundidad).';
      }

      return enunciado;
    }

   // 🔥 ESTE BLOQUE AHORA CONTROLA AMBOS TEMAS DE LA CIRCUNFERENCIA
    if (plantilla.subtipo === 'angulos_circunferencia' || plantilla.subtipo === 'propiedades_circunferencia') {
      let enunciado = plantilla.enunciado;
      const dif = plantilla.dificultad[0];

      // Formateador algebraico para el TEXTO
      const getTextAlg = (varName: string) => {
        if (dif === 'basico') {
           if (plantilla.variables && !plantilla.variables[varName]) return 'x';
           // Retorna el número limpio (El JSON ya incluye la 'u' o el '°' en el texto)
           return valores[varName] !== undefined ? `${valores[varName]}` : 'x';
        }
        
        const rel = plantilla.relaciones?.find((r: string) => r.startsWith(varName + ' ='));
        if (!rel) return valores[varName] !== undefined ? `${valores[varName]}` : 'x';

        let expr = rel.split('=')[1].trim();

        const tokens = expr.match(/[a-zA-Z_]\w*/g) || [];
        tokens.forEach(token => {
           if (token === 'x') return; 
           if (valores[token] !== undefined) {
              const regex = new RegExp(`\\b${token}\\b`, 'g');
              expr = expr.replace(regex, valores[token]);
           }
        });

        // Limpieza matemática visual
        expr = expr.replace(/x\s*\*\s*x/g, 'x²')
                   .replace(/\s*\*\s*/g, '')
                   .replace(/\+\s*-/g, '- ')
                   .replace(/\s+/g, ' ')
                   .trim();

        if (expr.includes('undefined')) return 'x';
        return expr;
      };

      // Reemplazo dinámico de las llaves {} en el texto del JSON
      enunciado = enunciado.replace(/\{([^}]+)\}/g, (match, varName) => {
        const val = getTextAlg(varName);
        return val !== 'undefined' ? val : match;
      });

      return enunciado;
    }

    if (plantilla.subtipo === 'perimetro_aislado') {
      const x = valores.x;
      const coef = valores.coef;
      const id = plantilla.id;

      const fExp = (target: number, c: number) => {
        const cte = target - c * x;
        return cte === 0
          ? `${c}x`
          : cte < 0
            ? `${c}x - ${Math.abs(cte)}`
            : `${c}x + ${cte}`;
      };

      if (id === 'geo_perimetro_isosceles_basico') {
        return `Halla el perímetro del triángulo isósceles mostrado. Sus lados iguales miden ${fExp(13 * valores.k, coef)} cm y su base mide ${10 * valores.k} cm. (Sabiendo que x = ${x}).`;
      }
      if (id === 'geo_perimetro_casita_intermedio') {
        return `Calcula el perímetro del contorno exterior de la "casita". El rectángulo inferior tiene base ${10 * valores.k} cm y altura ${6 * valores.k} cm. Los lados inclinados del techo miden ${fExp(13 * valores.k, coef)} cm. (Sabiendo que x = ${x}).`;
      }
    }

    // 🔥 NARRATIVA: SEGMENTOS EN CIRCUNFERENCIA (Teoremas)
    if (plantilla.subtipo === 'segmentos_circunferencia') {
      if (plantilla.dificultad.includes('basico')) {
        return `En la figura se muestran dos cuerdas secantes. Si los segmentos de una cuerda miden ${valores.a} cm y ${valores.b} cm, y un segmento de la otra mide ${valores.c} cm, ¿cuánto mide el segmento restante "x"?`;
      }
      if (plantilla.dificultad.includes('intermedio')) {
        return `En la circunferencia, dos cuerdas se intersecan. Los segmentos de la primera miden ${valores.a} cm y ${valores.b}x cm, y los de la segunda miden ${valores.c} cm y ${valores.d} cm. Halla el valor de "x".`;
      }
      if (plantilla.dificultad.includes('avanzado')) {
        return `Desde el punto exterior **"P"** se trazan dos secantes. La primera corta a la circunferencia en **"A"** y **"B"** (PA = ${valores.a} cm, AB = ${valores.b} cm). La segunda corta en **"C"** y **"D"** (PC = ${valores.c} cm, CD = x cm). Calcula el valor de "x".`;
      }
      if (plantilla.dificultad.includes('experto')) {
        return `Desde el punto exterior **"P"** se traza una tangente **"PT"** que mide ${valores.t} cm y una secante que corta a la circunferencia en **"A"** y **"B"**. Si PA = ${valores.a} cm y AB = x cm, calcula el valor de "x".`;
      }
    }

    if (plantilla.subtipo === 'propiedades_circunferencia') {
      if (plantilla.dificultad.includes('basico'))
        return `Si "P" y "Q" son puntos de tangencia desde un punto exterior "R", calcula el valor de "x".`;
      if (plantilla.dificultad.includes('intermedio'))
        return `Calcula "x" si "O" es el centro de la circunferencia y la línea vertical es perpendicular a la cuerda **AB**.`;
      if (plantilla.dificultad.includes('avanzado'))
        return `En la figura, la cuerda **AB** es paralela a la cuerda **CD** (AB // CD). Calcula el valor de "x".`;
      if (plantilla.dificultad.includes('experto'))
        return `Calcula "x", si "O" es centro y "T" es punto de tangencia.`;
    }

    // 🔥 NARRATIVA HÍBRIDA Y TEÓRICA
    if (plantilla.subtipo === 'angulos_teoricos') {
      if (plantilla.dificultad.includes('avanzado')) {
        // Diversidad en la pregunta teórica (Suma, Diferencia y Exceso)
        if (valores.tipo === 0)
          return `Se sabe que la suma del complemento de ${valores.a}x y el suplemento de ${valores.b}x resulta ${valores.c}°. Halla el valor de x.`;
        if (valores.tipo === 1)
          return `La diferencia entre el suplemento de ${valores.b}x y el complemento de ${valores.a}x es ${valores.c}°. Determina x.`;
        if (valores.tipo === 2)
          return `El suplemento de ${valores.b}x excede al doble del complemento de ${valores.a}x en ${valores.c}°. Calcula x.`;
      }

      // Para Básico e Intermedio: Construimos la pregunta final teórica
      const eqReq = valores.req_coef === 1 ? `x` : `${valores.req_coef}x`;
      const opReq = valores.req_tipo === 0 ? `el complemento` : `el suplemento`;
      return `En la figura geométrica mostrada, halla ${opReq} de ${eqReq}.`;
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
   
    // 🔥 NARRATIVA: PERÍMETROS (SISTEMA DE 16 FIGURAS AISLADAS)
    if (plantilla.subtipo === 'triangulo_perimetro') {
      const v = valores;
      const id = plantilla.id;
      let enunciado = plantilla.enunciado;

      // 1. Auto-Reemplazo: Busca {h_techo}, {base}, etc. en el JSON y los cambia por sus valores reales
      Object.keys(v).forEach((key) => {
        if (v[key] !== undefined && typeof v[key] !== 'function') {
          enunciado = enunciado.replace(new RegExp(`\\{${key}\\}`, 'g'), String(v[key]));
        }
      });

      // 2. Formateador de Polinomios exacto para el nivel Experto (ax² + c)
      const fPoly = (a: number, c: number) => {
         const aStr = a === 1 ? `x²` : `${a}x²`;
         if (c === 0) return aStr;
         return c < 0 ? `${aStr} - ${Math.abs(c)}` : `${aStr} + ${c}`;
      };

      // 3. Inyección directa de álgebra para los 4 casos Expertos
      if (id === 'geo_perim_ninja_exp') {
         return `La "Estrella Ninja" tiene 8 lados externos de igual longitud. Calcula su perímetro numérico y halla "x" sabiendo que dicho perímetro equivale a la expresión ( ${fPoly(v.a, v.b_cte)} ).`;
      }
      if (id === 'geo_perim_cometa_exp') {
         return `La cometa está formada por dos triángulos isósceles. Deduce los lados usando las diagonales mostradas. Si su perímetro total es ( ${fPoly(v.a, v.b_cte)} ), halla "x".`;
      }
      if (id === 'geo_perim_corona_tri_exp') {
         return `Calcula el perímetro total de la figura (borde exterior más el borde del hueco interior). Si dicho perímetro equivale a la expresión ( ${fPoly(v.a, v.b_cte)} ), determina el valor positivo de "x".`;
      }
      if (id === 'geo_perim_hex_hueco_exp') {
         return `La figura es un hexágono regular de lado ${v.lado_hex} cm con un recorte rectangular en la base inferior. Deduce el contorno exterior final y halla "x" si el perímetro total se expresa como ( ${fPoly(v.a, v.b_cte)} ).`;
      }

      // 4. Si es Básico, Intermedio o Avanzado, simplemente retorna el texto ya reemplazado en el Paso 1
      return enunciado;
    }

    // 🔥 ENUNCIADOS: CONTEO DE FIGURAS UNIVERSAL 🔥
    if (plantilla.subtipo === 'conteo_figuras' || plantilla.id.includes('conteo')) {
      if (plantilla.id.includes('cuadrilatero')) {
        return `Calcula la cantidad total de cuadriláteros que se pueden identificar en la figura.`;
      } 
      else if (plantilla.id.includes('angulo')) {
        return `Determina el número total de ángulos agudos que se pueden contar en el gráfico.`;
      } 
      else if (plantilla.id.includes('sectores')) {
        return `Calcula el número de sectores circulares en la figura mostrada.`;
      } 
      else if (plantilla.id.includes('cubos')) {
        return `Determina el número exacto de cubitos simples que conforman la siguiente estructura 3D.`;
      } 
      else { // Triángulos
        if (plantilla.id.includes('basico') || plantilla.id.includes('intermedio')) {
          return `Determina el número total de triángulos que se pueden contar como máximo en la figura.`;
        } else {
          return `Aplica el método inductivo y halla la cantidad total de triángulos en el gráfico mostrado.`;
        }
      }
    }

    if (plantilla.subtipo === 'thales') {
      const dif = plantilla.dificultad[0];
      const tipo = valores.tipo_fig;

      let baseTexto = '';
      if (tipo === 0)
        baseTexto =
          'En el sistema de 3 rectas horizontales paralelas cortadas por secantes, ';
      if (tipo === 1)
        baseTexto =
          'En el triángulo trazado con una recta paralela a su base, ';
      if (tipo === 2)
        baseTexto = "En la figura tipo 'reloj de arena' con bases paralelas, ";

      if (dif === 'basico')
        return (
          baseTexto +
          "aplica el Teorema de Thales para calcular el valor de 'x'."
        );
      if (dif === 'intermedio')
        return (
          baseTexto +
          "emplea la proporción de los segmentos colineales para hallar 'x'."
        );
      if (dif === 'avanzado')
        return (
          baseTexto +
          "formula la ecuación racional cruzada para determinar 'x'."
        );
      if (dif === 'experto')
        return (
          baseTexto +
          "plantea la proporción de Thales, desarrolla los productos de binomios y halla el valor entero de 'x'."
        );
    }

    // Caso: Ecuaciones simples
    if (
      plantilla.tema === 'ecuaciones_simples' &&
      plantilla.subtipo === 'lineal'
    ) {
      const variantes = ['suma_resta', 'resta_suma', 'mul_div', 'div_mul'];
      const variante = variantes[Math.floor(Math.random() * variantes.length)];

      let enunciado = '';
      let x: number;

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

      if (x < 2 || x > 100) {
        throw new Error('x fuera de rango');
      }

      scope.x = x;
      return enunciado;
    }

    if (plantilla.id === 'estadistica_probabilidad_01') {
      const total = valores.rojas + valores.azules + valores.verdes;
      let numerador;
      if (valores.color === 'roja') numerador = valores.rojas;
      else if (valores.color === 'azul') numerador = valores.azules;
      else numerador = valores.verdes;
      const frac = new Fraction(numerador, total);
      scope.probabilidad = {
        numerador: Number(frac.n),
        denominador: Number(frac.d),
      };
      let enunciado = plantilla.enunciado;
      for (const key of Object.keys(plantilla.variables)) {
        const val = valores[key];
        if (val !== undefined) {
          enunciado = enunciado.replace(
            new RegExp(`{${key}}`, 'g'),
            String(val),
          );
        }
      }
      return enunciado;
    }

    // Caso especial: estadística circular con dos modos
    if (plantilla.id === 'estadistica_circular_01') {
      const porcentaje = valores.porcentaje;
      const angulo = porcentaje * 3.6;
      const modo = Math.random() < 0.5 ? 'angulo' : 'porcentaje';
      let enunciado: string;
      if (modo === 'angulo') {
        enunciado = `En un gráfico circular, un sector representa el ${porcentaje}% del total. ¿Cuál es la medida de su ángulo central?`;
        scope.respuesta = angulo;
      } else {
        enunciado = `En un gráfico circular, un sector tiene un ángulo central de ${angulo}°. ¿Qué porcentaje del total representa?`;
        scope.respuesta = porcentaje;
      }
      return enunciado;
    }

    // Caso: Simetría
    if (plantilla.id === 'geo_simetria_01') {
      let enunciado = plantilla.enunciado;
      enunciado = enunciado.replace('{figura}', valores.figura);
      return enunciado;
    }

    if (plantilla.id === 'geo_simetria_01') {
      let enunciado = plantilla.enunciado;
      enunciado = enunciado.replace('{figura}', valores.figura);
      return enunciado;
    }

    // 🔥 BORRA LO QUE HAYA DEBAJO DE SIMETRÍA Y PEGA TODO ESTO:

    // 🔥 1. Formateador Algebraico Inteligente (Limpia los "1x" y los "+ -")
    const formatAlg = (coef: any, cte: any) => {
      if (coef === undefined || cte === undefined) return null;
      const c = Number(coef);
      const k = Number(cte);
      const cStr = c === 1 ? 'x' : c === -1 ? '-x' : `${c}x`;
      if (k === 0) return cStr;
      return k > 0 ? `${cStr} + ${k}` : `${cStr} - ${Math.abs(k)}`;
    };

    // 🔥 Lógica inyectora para la fracción de los cuadrados superpuestos
    if (plantilla.id === 'geo_cuadrados_superpuestos_01') {
      const diccionarioFracciones: Record<number, string> = {
        2: 'la mitad',
        3: 'la tercera parte',
        4: 'la cuarta parte',
        5: 'la quinta parte',
        6: 'la sexta parte',
        7: 'la séptima parte',
        8: 'la octava parte',
        9: 'la novena parte',
      };
      // Inyectamos "la cuarta parte", etc., para que reemplace {texto_fraccion}
      scope.texto_fraccion = diccionarioFracciones[valores.divisor];
    }

    if (plantilla.id === 'geo_radiales_suplementarios_01') {
      const c1 = valores.coef_1;
      const c2 = valores.coef_2;
      const k2 = valores.const_2;
      scope.texto_angulo_1 = c1 === 1 ? `x` : `${c1}x`;
      scope.texto_angulo_2 = c2 === 1 ? `x + ${k2}°` : `${c2}x + ${k2}°`;
    }

    // 🔥 Formateador para ángulos algebraicos
    if (plantilla.id === 'geo_angulos_bisectriz_01') {
      const c = valores.coef_x;
      const b = valores.const_b;
      scope.texto_angulo_1 = c === 1 ? `x + ${b}°` : `${c}x + ${b}°`;
      scope.texto_angulo_2 = `${valores.val_c}°`;
    }


  // 🔥 ENUNCIADOS BLINDADOS (Cero undefined, Cero spoilers) 🔥
    if (plantilla.subtipo === 'area_triangulo' || plantilla.id.includes('area_triangulo')) {
      const v_t = Number(valores.var_t ?? 0);
      const v_k = Number(valores.var_k ?? 1);
      const v_x = Number(valores.var_x ?? 3);
      const v_flip = Number(valores.var_flip ?? 0);
      const v_hide = Number(valores.var_hide ?? 0);

      const ternas = [ {a:3, b:4, c:5}, {a:5, b:12, c:13}, {a:8, b:15, c:17}, {a:6, b:8, c:10} ];
      const t = ternas[v_t % 4];
      const cat1 = t.a * v_k; 
      const cat2 = t.b * v_k; 
      const hipo = t.c * v_k;
      const variante = (v_t + v_flip) % 3;

      if (plantilla.id.includes('basico')) {
        if (v_hide === 0) {
          return `Calcula el área del triángulo rectángulo mostrado. Sabiendo que su altura mide ${cat2} u y su hipotenusa ${hipo} u.`;
        } else {
          return `Calcula el área del triángulo rectángulo mostrado. Sabiendo que su base mide ${cat1} u y su hipotenusa ${hipo} u.`;
        }
      } 
      else if (plantilla.id.includes('intermedio')) {
        if (variante === 0) {
           return `Dado el triángulo isósceles, cuya base mide ${cat1 * 2} cm y sus lados congruentes ${hipo} cm, calcula el área total.`;
        } else if (variante === 1) {
           return `Halla el área del triángulo mostrado. Considera que la altura interna mide ${hipo} cm y divide la base en dos segmentos de ${cat1} cm y ${cat2} cm.`;
        } else {
           return `Calcula el área del triángulo isósceles tumbado. Su base mide ${cat1 * 2} cm y sus lados congruentes ${hipo} cm.`;
        }
      } 
      else if (plantilla.id.includes('avanzado')) {
        // 🔥 FIX: Base 100% dinámica y proporcional
        const baseAvanzado = 8 * v_k; 
        return `Calcula el área de la región sombreada. Sabiendo que la base del triángulo principal es ${baseAvanzado} m, además, su proyección es de ${cat1} m y la diagonal mide ${hipo} m.`;
      } 
      else if (plantilla.id.includes('experto')) {
        if (variante === 0) {
           return `El perímetro del triángulo rectángulo es ${3*v_x + 4*v_x + 5*v_x} u. Calcula el área.`;
        } else if (variante === 1) {
           return `El perímetro del triángulo isósceles mostrado es ${6*v_x + 5*v_x + 5*v_x} u. Calcular el área de la región triangular.`;
        } else {
           return `El perímetro del triángulo isósceles es ${12*v_x + 10*v_x + 10*v_x} u. Halla el área total de la figura.`;
        }
      }
    }

   if (plantilla.id.includes('geo_secantes')) {
      const v = valores || {};
      
      // Formateador anti "1x"
      const ax = v.a === 1 ? 'x' : `${v.a}x`;
      const cx = v.c === 1 ? 'x' : `${v.c}x`;
      const ex = v.e === 1 ? 'x' : `${v.e}x`; // Para avanzado/experto

      if (plantilla.id.includes('basico')) {
        return `En el gráfico, las rectas L1 y L2 se intersecan en el punto O. Si las medidas de los ángulos opuestos por el vértice son ${ax} + ${v.b}° y ${cx} + ${v.d}°, halle el valor de x.`;
      } 
      else if (plantilla.id.includes('intermedio')) {
        return `Dados los rayos concurrentes en O que forman un par lineal sobre una recta, determine el valor de x sabiendo que los ángulos adyacentes miden ${ax} + ${v.b}° y ${cx} + ${v.d}°.`;
      } 
      else if (plantilla.id.includes('avanzado')) {
        return `En la figura, se muestran rayos concurrentes en el punto O que completan una vuelta entera (360°). A partir de los datos proporcionados, calcule el valor de x.`;
      }
      else {
        return `Analice la siguiente configuración geométrica de ángulos alrededor del punto O. Determine el valor entero de la incógnita x.`;
      }
    }



    // 🔥 2. Narrativa dinámica para la posición del punto P (Rectángulo Diagonal)
    if (plantilla.id === 'geo_rectangulo_punto_diagonal_01') {
      const textosPosicion = [
        'se marca un punto P sobre el lado superior',
        'se marca un punto P sobre el lado inferior',
        'se marca un punto P sobre el lado derecho',
        'se marca un punto P sobre el lado izquierdo',
      ];
      scope.texto_posicion = textosPosicion[valores.pos_p];
    }

    // 🔥 3. Limpiamos los textos crudos algebraicos en el enunciado
    enunciadoBase = enunciadoBase.replace(
      '{a}x + {b}',
      formatAlg(valores.a, valores.b) || '{a}x + {b}',
    );
    enunciadoBase = enunciadoBase.replace(
      '{c}x + {d}',
      formatAlg(valores.c, valores.d) || '{c}x + {d}',
    );
    enunciadoBase = enunciadoBase.replace(
      '{coefA}x + {constA}',
      formatAlg(valores.coefA, valores.constA) || '{coefA}x + {constA}',
    );
    enunciadoBase = enunciadoBase.replace(
      '{coefB}x + {constB}',
      formatAlg(valores.coefB, valores.constB) || '{coefB}x + {constB}',
    );
    enunciadoBase = enunciadoBase.replace(
      '{coefC}x + {constC}',
      formatAlg(valores.coefC, valores.constC) || '{coefC}x + {constC}',
    );

    // 🔥 4. Caso genérico: iterar sobre todo el SCOPE para atrapar TODAS las variables
    for (const key of Object.keys(scope)) {
      const val = scope[key];
      if (val !== undefined) {
        // Formatear el número si es numérico (sin decimales infinitos)
        const strVal = typeof val === 'number' ? formatNum(val) : String(val);
        enunciadoBase = enunciadoBase.replace(
          new RegExp(`\\{${key}\\}`, 'g'),
          strVal,
        );
      }
    }

    if (enunciadoBase.includes('{texto_dinamico}')) {
      enunciadoBase = enunciadoBase.replace(
        '{texto_dinamico}',
        'analiza la figura mostrada',
      );
    }

    return enunciadoBase;
  }

  generarVisualData(plantilla: Plantilla, valores: Record<string, any>): any {

    const getTicks = (vals: number[]) => {
      const maxVal = Math.max(...vals, 0);
      const step = maxVal > 20 ? 5 : 2;
      const ticks: number[] = [];
      for (let i = 0; i <= maxVal + step; i += step) ticks.push(i);
      return ticks;
    };
    
    if (plantilla.tema === 'estadistica') {

      switch (
        plantilla.id // 🔥 Usamos el ID para mayor precisión
      ) {
        case 'estadistica_barras_01':
        case 'estadistica_barras_intermedio':
          const bVals = [
            valores.lun,
            valores.mar,
            valores.mie,
            valores.jue,
            valores.vie,
          ];
          return {
            type: 'chart_bar',
            ticks: getTicks(bVals),
            data: [
              { label: 'Lun', value: valores.lun },
              { label: 'Mar', value: valores.mar },
              { label: 'Mie', value: valores.mie },
              { label: 'Jue', value: valores.jue },
              { label: 'Vie', value: valores.vie },
            ],
          };

        case 'estadistica_barras_doble':
          return {
            type: 'chart_bar_double',
            data: [
              { label: 'Día 1', SedeA: valores.a1, SedeB: valores.b1 },
              { label: 'Día 2', SedeA: valores.a2, SedeB: valores.b2 },
            ],
          };

          case 'estadistica_tabla_variable_k': {
              // Generamos un k exacto
              const k = Math.floor(Math.random() * 5) + 5; // k entre 5 y 9
              const total = (2 * k) + (3 * k) + (4 * k) + k; // Total = 10k
              
              // Sincronizamos para el enunciado
              valores.total_personas = total;
              valores.edad_preguntada = "11"; // Pediremos la de 3k

              return {
                type: 'frequency_table',
                headers: ["Edad", "N° de Estudiantes (fi)"],
                rows: [
                  ["10 años", "2k"],
                  ["11 años", "3k"],
                  ["12 años", "4k"],
                  ["13 años", "k"],
                  ["Total", total]
                ],
                colorAccent: "#3b82f6",
                // La respuesta es 3 * k
                respuestaSobreescrita: (3 * k) 
              };
            }

            // 🔥 CASO 2: Ecuación Textual para hallar 'm' (La imagen de los colores)
            case 'estadistica_tabla_ecuacion_m': {
              // Condición del problema: (Rojo + m) / 3 = (Azul + Verde) / 2
              // Aseguramos que (Azul + Verde) sea par y múltiplo de 2
              const azul = Math.floor(Math.random() * 5) + 16; // ej. 20
              const verde = Math.floor(Math.random() * 5) + 16; // ej. 18
              const sumaAV = azul + verde; // ej. 38
              
              // (Azul + Verde)/2 * 3 = Rojo + m
              const valorDerecho = (sumaAV / 2) * 3; // ej. (38/2)*3 = 57
              
              // Elegimos un Rojo menor a valorDerecho
              const rojo = Math.floor(Math.random() * 5) + 12; // ej. 15
              
              // Calculamos 'm' exacto
              const m = valorDerecho - rojo; // ej. 57 - 15 = 42

              return {
                type: 'frequency_table',
                headers: ["Color Favorito", "Cantidad"],
                rows: [
                  ["Azul", azul],
                  ["Rojo", rojo],
                  ["Amarillo", "m"],
                  ["Verde", verde]
                ],
                colorAccent: "#f59e0b",
                respuestaSobreescrita: m 
              };
            }

           // 🔥 CASO 3: Gráfico Combinado (Dinámico y Exacto)
            case 'estadistica_grafico_combinado': {
              // 1. Datos del gráfico de Barras (Múltiplos de 100 para garantizar enteros)
              const prod2022 = Math.floor(Math.random() * 5) * 100 + 1000; // 1000 a 1400
              const prod2023 = Math.floor(Math.random() * 5) * 100 + 1500; // 1500 a 1900
              const prod2024 = Math.floor(Math.random() * 5) * 100 + 2000; // 2000 a 2400

              // 2. Tríos Perfectos: Porcentajes que suman 100 y son múltiplos de 5
              const distribuciones = [
                { r: 40, a: 35, n: 25 },
                { r: 50, a: 30, n: 20 },
                { r: 45, a: 35, n: 20 },
                { r: 60, a: 25, n: 15 },
                { r: 35, a: 45, n: 20 }
              ];
              // Elegimos una distribución al azar
              const dist = distribuciones[Math.floor(Math.random() * distribuciones.length)];

              // 3. Elegir el color objetivo de la pregunta al azar
              const coloresObj = [
                { nombre: "rojo", pct: dist.r },
                { nombre: "azul", pct: dist.a },
                { nombre: "negro", pct: dist.n }
              ];
              const objetivo = coloresObj[Math.floor(Math.random() * coloresObj.length)];

              // 4. Sincronizamos el enunciado
              valores.anio_objetivo = "2024";
              valores.color_objetivo = objetivo.nombre;

              // 5. Respuesta: El % objetivo aplicado a la producción de 2024
              // Al ser prod2024 múltiplo de 100, la división entre 100 siempre es exacta.
              const respuestaFinal = (objetivo.pct / 100) * prod2024;

              return {
                type: 'chart_combined',
                data: {
                  barData: [
                    { name: "2022", value: prod2022 },
                    { name: "2023", value: prod2023 },
                    { name: "2024", value: prod2024 }
                  ],
                  pieData: [
                    { name: `Rojo (${dist.r}%)`, value: Math.round(dist.r * 3.6) }, // Grados exactos
                    { name: `Azul (${dist.a}%)`, value: Math.round(dist.a * 3.6) },
                    { name: `Negro (${dist.n}%)`, value: Math.round(dist.n * 3.6) }
                  ],
                  pieLabels: [`Rojo ${dist.r}%`, `Azul ${dist.a}%`, `Negro ${dist.n}%`] 
                },
                respuestaSobreescrita: respuestaFinal
              };
            }

        case 'estadistica_circular_angulo': { // El texto te da el Porcentaje
          // 1. Capturamos el porcentaje EXACTO del texto
          const pctReal = Number(valores.porcentaje);

          return {
            type: 'chart_pie',
            data: [
              { name: 'Rojo', value: pctReal }, // Dibuja la tajada roja EXACTA al texto
              { name: 'Resto', value: 100 - pctReal }
            ],
            // 2. Calcula la respuesta en grados y la redondea a entero
            respuestaSobreescrita: Math.round(pctReal * 3.6) + '°'
          };
        }

       case 'estadistica_circular_porcentaje': { // El texto te da el Ángulo
          // 1. Capturamos el valor EXACTO que el motor ya imprimió en el texto
          const anguloReal = Number(valores.angulo);

          return {
            type: 'chart_pie',
            data: [
              { name: 'Rojo', value: anguloReal }, // Dibuja la tajada roja EXACTA al texto
              { name: 'Resto', value: 360 - anguloReal } // Dibuja el resto
            ],
            // 2. Calcula la respuesta y la redondea a entero
            respuestaSobreescrita: Math.round(anguloReal / 3.6) + '%' 
          };
        }
        case 'estadistica_probabilidad_01': {
          const total =
            (valores.rojas || 0) +
            (valores.azules || 0) +
            (valores.verdes || 0);
          const fav = valores.azules;
          const comun = MCD(fav, total);
          return {
            type: 'probabilidad_table',
            headers: ['Color', 'Cantidad'],
            rows: [
              ['Rojo', valores.rojas],
              ['Azul', valores.azules],
              ['Verde', valores.verdes],
            ],
            colorAccent: '#ec4899',
            respuestaSobreescrita: {
              numerador: Math.round(fav / comun),
              denominador: Math.round(total / comun),
            },
          };
        }

        case 'estadistica_frecuencias_01':
        case 'estadistica_promedio_faltante': {
          // Generamos 3 notas reales
          const n1 = Math.floor(Math.random() * 5) + 12; // 12 a 16
          const n2 = Math.floor(Math.random() * 5) + 10; // 10 a 14
          const n3 = Math.floor(Math.random() * 5) + 13; // 13 a 17
          
          // Definimos un promedio objetivo que sea alcanzable (ej. 15)
          const promedioObjetivo = Math.floor(Math.random() * 3) + 14; 
          
          // Calculamos la nota faltante para 4 notas en total
          // Suma total necesaria = promedio * 4
          const notaFaltante = (promedioObjetivo * 4) - n1 - n2 - n3;

          // Actualizamos el objeto de valores para el motor de texto
          valores.nota1 = n1;
          valores.nota2 = n2;
          valores.nota3 = n3;
          valores.promedio = promedioObjetivo;

          return {
            type: 'frequency_table',
            headers: ["Examen", "Nota"],
            rows: [
              ["1° Examen", n1],
              ["2° Examen", n2],
              ["3° Examen", n3],
              ["4° Examen", "?"], // La incógnita
            ],
            colorAccent: "#6366f1",
            respuestaSobreescrita: notaFaltante 
          };
        }

        case 'estadistica_pictograma_01':
          return {
            type: 'pictogram_table',
            headers: ['Estudiante', 'Símbolos'],
            rows: [
              ['Ana', valores.simbolos_ana],
              ['Bruno', valores.simbolos_bruno],
              ['Carlos', valores.simbolos_carlos],
            ],
            colorAccent: '#f97316',
            valorPorSimbolo: valores.valor_libros,
          };

        default:
          return null;
      }
    }

    // ========== CONJUNTOS Y DIAGRAMAS DE VENN ==========
    if (plantilla.tema === 'Conjuntos y Diagramas de Venn' || plantilla.tema === 'Conjuntos y Diagramas de Venn (Extra)') {
      switch (plantilla.subtipo) {
        case 'venn_grafico_elementos':
        case 'conjuntos_venn_diferencia_basico':
        case 'conjuntos_venn_complemento_intermedio':
        case 'venn_grafico_interseccion':       
        case 'venn_grafico_union':              
        case 'venn_grafico_diferencia_simetrica': 
       {
          // 🔥 ESTE LOG NOS DIRÁ SI EL BACKEND POR FIN ESTÁ FUNCIONANDO
          console.log('🎨 Generando visual para Diagrama de Venn...'); 
          
          return {
            type: 'geometry_mafs', // El pase VIP
            theme: 'venn_grafico_elementos',
            params: {
              soloA1: valores.soloA1,
              soloA2: valores.soloA2,
              inter: valores.inter,
              soloB: valores.soloB,
              a: valores.a,
              b: valores.b,
              c: valores.c,
              fuera1: valores.fuera1,
              fuera2: valores.fuera2,
              eA1: valores.eA1,
              eA2: valores.eA2,
              eA3: valores.eA3,
              eI1: valores.eI1,
              eI2: valores.eI2,
              eB1: valores.eB1,
              eB2: valores.eB2,
              eB3: valores.eB3,
              eU1: valores.eU1,
              eU2: valores.eU2
            }
          };
        }
      }
    }

    // ========== SÓLIDOS GEOMÉTRICOS ==========
    if (plantilla.tema === 'Sólidos Geométricos: Cubo y Prisma') {
      switch (plantilla.subtipo) {
        case 'cubo_grafico_volumen_basico':
        case 'cubo_grafico_area_intermedio': {
          console.log('🧊 Generando visual para Cubo...'); 
          return {
            type: 'geometry_mafs',
            theme: 'cubo',
            params: { 
              arista: valores.a, 
              color: '#0ea5e9' 
            }
          };
        }
      }
    }

    
    // ========== GEOMETRÍA ==========
    if (plantilla.tema === 'geometria') {
      switch (plantilla.subtipo) {
     
    

        case 'triangulo_ecuaciones': {
          console.log('🎨 Generando visual para triángulo con ecuaciones');
          const angA = valores.angA;
          const angB = valores.angB;
          const angC = valores.angC;

          if (
            typeof angA !== 'number' ||
            typeof angB !== 'number' ||
            typeof angC !== 'number'
          ) {
            console.error('Ángulos no numéricos');
            return null;
          }

          const ladoAB = 10;
          const angARad = (angA * Math.PI) / 180;
          const angBRad = (angB * Math.PI) / 180;
          const angCRad = Math.PI - angARad - angBRad;

          const ladoAC = (ladoAB * Math.sin(angBRad)) / Math.sin(angCRad);
          const C: [number, number] = [
            ladoAC * Math.cos(angARad),
            ladoAC * Math.sin(angARad),
          ];

          const vertices: [number, number][] = [[0, 0], [ladoAB, 0], C];

          // 🔥 AÑADE ESTO: Retorna puramente datos matemáticos y etiquetas, cero estilos
          const angulosArco = [
            {
              centro: [0, 0],
              inicio: 0,
              fin: angA,
              etiqueta: `${valores.coefA}x${valores.constA > 0 ? ` + ${valores.constA}` : ''}°`,
            },
            {
              centro: [ladoAB, 0],
              inicio: 180 - angB,
              fin: 180,
              etiqueta: `${valores.coefB}x${valores.constB > 0 ? ` + ${valores.constB}` : ''}°`,
            },
            {
              centro: C,
              inicio: 180 + angA,
              fin: 360 - angB,
              etiqueta: `${valores.coefC}x${valores.constC > 0 ? ` + ${valores.constC}` : ''}°`,
            },
          ];

          return {
            type: 'geometry_mafs',
            theme: 'triangulo_angulos',
            vertices,
            etiquetasVertices: ['A', 'B', 'C'],
            angulos: angulosArco,
          };
        }

        case 'rectangulo_ecuaciones': {
          const largo = valores.largo;
          const ancho = valores.ancho;
          const largoExpr = `${valores.a}x + ${valores.b} cm`;
          const anchoExpr = `${valores.c}x + ${valores.d} cm`;

          return {
            type: 'geometry_mafs',
            theme: 'rectangulo',
            esquina: [0, 0],
            ancho: largo,
            alto: ancho,
            labels: ['A', 'B', 'C', 'D'],
            etiquetasLados: [
              { posicion: 'abajo', texto: largoExpr },
              { posicion: 'derecha', texto: anchoExpr },
              { posicion: 'arriba', texto: largoExpr },
              { posicion: 'izquierda', texto: anchoExpr },
            ],
            color: '#2563eb',
          };
        }

        case 'perimetro_rectangulo':
          return {
            type: 'geometry_mafs',
            theme: 'rectangulo',
            esquina: [0, 0],
            ancho: valores.largo,
            alto: valores.ancho,
            labels: ['A', 'B', 'C', 'D'],
            color: '#2563eb',
          };

        case 'segmentos': {
          const v = valores;
          const id = plantilla.id;
          const pos = v.var_pos !== undefined ? v.var_pos : 0;
          let params: any = {};

          if (id.includes('basico')) {
            const labels = ['', '', ''];
            labels[pos] = `x + ${v.cte}`;
            params = {
              segments: [
                {
                  label: labels[0],
                  coef: pos === 0 ? 1 : 0,
                  const: pos === 0 ? v.cte : v.y,
                },
                {
                  label: labels[1],
                  coef: pos === 1 ? 1 : 0,
                  const: pos === 1 ? v.cte : v.y,
                },
                {
                  label: labels[2],
                  coef: pos === 2 ? 1 : 0,
                  const: pos === 2 ? v.cte : v.y,
                },
              ],
              total_label: v.total.toString(),
              x_value: v.x,
            };
          } else if (id.includes('intermedio')) {
            const labels = ['', '', ''];
            // Identifica dónde va la 'x' según las 6 posiciones
            const idxX = pos < 2 ? 0 : pos < 4 ? 1 : 2;
            labels[idxX] = 'x';

            const m = v.m || 2;
            const n = v.n || 3;

            const coefs = [
              [1, m, n], // pos 0
              [1, n, m], // pos 1
              [m, 1, n], // pos 2
              [n, 1, m], // pos 3
              [m, n, 1], // pos 4
              [n, m, 1], // pos 5
            ][pos];

            params = {
              segments: [
                { label: labels[0], coef: coefs[0], const: 0 },
                { label: labels[1], coef: coefs[1], const: 0 },
                { label: labels[2], coef: coefs[2], const: 0 },
              ],
              total_label: v.total.toString(),
              x_value: v.x,
            };
          } else if (id.includes('avanzado')) {
            const labels = ['', '', '', ''];
            labels[pos] = 'x';
            params = {
              segments: [
                {
                  label: labels[0],
                  coef: 1,
                  const: pos === 0 ? 0 : 3 * v.razon,
                },
                { label: labels[1], coef: 1, const: pos === 1 ? 0 : v.razon },
                {
                  label: labels[2],
                  coef: 1,
                  const: pos === 2 ? 0 : 2 * v.razon,
                },
                {
                  label: labels[3],
                  coef: 1,
                  const: pos === 3 ? 0 : 4 * v.razon,
                },
              ],
              total_label: v.total.toString(),
              x_value: v.x,
            };
          } else {
            const labels = ['', '', '', ''];
            labels[pos] = 'x';
            params = {
              segments: [
                { label: labels[0], coef: 0, const: v.s1 },
                { label: labels[1], coef: 0, const: v.s2 },
                { label: labels[2], coef: 0, const: v.s3 },
                { label: labels[3], coef: 0, const: v.s4 },
              ],
              total_label: v.total.toString(),
              x_value: 1,
            };
          }

          return {
            type: 'geometry_mafs',
            theme: 'segmentos',
            params: params,
          };
        }

        case 'area_sombreada': {
          const v = valores;
          const id = plantilla.id;
          const tipo = v.tipo_fig;

          let poligonosBase: any[] = [];
          let poligonosHueco: any[] = [];
          let poligonosBorde: any[] = [];
          let circulosBase: any[] = [];
          let circulosHueco: any[] = [];
          let circulosBorde: any[] = [];
          let parchesBase: any[] = [];
          let parchesLineas: any[] = [];
          let parchesArcos: any[] = [];
          let lineas: any[] = [];
          let angulos: any[] = [];
          let etiquetas: any[] = [];

          const L = 10;

          // 🔥 GENERADORES TOPOLÓGICOS PERFECTOS (Donas sin fondo)
          const createDonut = (
            cx: number,
            cy: number,
            R: number,
            r: number,
          ) => {
            const pts: [number, number][] = [];
            for (let i = 0; i <= 360; i += 5)
              pts.push([
                cx + R * Math.cos((i * Math.PI) / 180),
                cy + R * Math.sin((i * Math.PI) / 180),
              ]);
            for (let i = 360; i >= 0; i -= 5)
              pts.push([
                cx + r * Math.cos((i * Math.PI) / 180),
                cy + r * Math.sin((i * Math.PI) / 180),
              ]);
            return pts;
          };
          const createDonutArc = (
            cx: number,
            cy: number,
            R: number,
            r: number,
            startA: number,
            endA: number,
          ) => {
            const pts: [number, number][] = [];
            for (let i = startA; i <= endA; i += 2)
              pts.push([
                cx + R * Math.cos((i * Math.PI) / 180),
                cy + R * Math.sin((i * Math.PI) / 180),
              ]);
            for (let i = endA; i >= startA; i -= 2)
              pts.push([
                cx + r * Math.cos((i * Math.PI) / 180),
                cy + r * Math.sin((i * Math.PI) / 180),
              ]);
            return pts;
          };

          // =====================================
          // 1. NIVEL BÁSICO (Sincronización Total)
          // =====================================
          if (id.includes('basico')) {
            const h_vis = L * (v.v2 / v.v1);
            const fondoCuad = [
              [0, 0],
              [L, 0],
              [L, L],
              [0, L],
            ];
            poligonosBase.push(fondoCuad);
            poligonosBorde.push(fondoCuad);

            if (tipo === 0 || tipo === 2) {
              // Vértice P o Triángulo interior: El hueco es UN triángulo
              // Base superior AB (y=L), Vértice P a distancia v2 hacia abajo
              const pP: [number, number] = [L / 2, L - h_vis];
              const triBlanco = [[0, L], [L, L], pP];
              poligonosHueco.push(triBlanco);
              poligonosBorde.push(triBlanco);
              lineas.push({
                p1: [L / 2, L],
                p2: pP,
                punteada: true,
                resaltada: true,
              });
              etiquetas.push({
                pos: [L / 2 + 0.4, L - h_vis / 2],
                texto: `${v.v2}`,
              });
            } else if (tipo === 1) {
              // Cuadrado blanco en la esquina (v2 es el lado del cuadradito)
              const cuadBlanco = [
                [0, L - h_vis],
                [h_vis, L - h_vis],
                [h_vis, L],
                [0, L],
              ];
              poligonosHueco.push(cuadBlanco);
              poligonosBorde.push(cuadBlanco);
              etiquetas.push({ pos: [h_vis / 2, L + 0.6], texto: `${v.v2}` });
            } else if (tipo === 3) {
              // Rombo: Área sombreada es la mitad.
              const rombo = [
                [L / 2, 0],
                [L, L / 2],
                [L / 2, L],
                [0, L / 2],
              ];
              poligonosHueco.push(rombo);
              poligonosBorde.push(rombo);
            } else if (tipo === 4) {
              // Reloj de Arena: v2 es la suma de las bases de los dos triángulos laterales
              // Dibujamos dos triángulos blancos en los costados
              const tIzq = [
                [0, 0],
                [h_vis / 2, L / 2],
                [0, L],
              ];
              const tDer = [
                [L, 0],
                [L - h_vis / 2, L / 2],
                [L, L],
              ];
              poligonosHueco.push(tIzq, tDer);
              poligonosBorde.push(tIzq, tDer);
              etiquetas.push({ pos: [h_vis / 4, -0.6], texto: `${v.v2}` });
            }
          }

          // =====================================
          // 2. INTERMEDIO
          // =====================================
          else if (id.includes('intermedio')) {
            const R_vis = 8;
            const r_vis = R_vis * (v.r / v.R);

            if (tipo === 0) {
              poligonosBase.push(createDonut(0, 0, R_vis, r_vis));
              circulosBorde.push(
                { centro: [0, 0], r: R_vis },
                { centro: [0, 0], r: r_vis },
              );
              lineas.push(
                {
                  p1: [0, 0],
                  p2: [
                    R_vis * Math.cos(Math.PI / 6),
                    R_vis * Math.sin(Math.PI / 6),
                  ],
                  punteada: true,
                },
                {
                  p1: [0, 0],
                  p2: [
                    r_vis * Math.cos((Math.PI * 5) / 6),
                    r_vis * Math.sin((Math.PI * 5) / 6),
                  ],
                  punteada: true,
                },
              );
              etiquetas.push(
                { pos: [-0.4, -0.4], texto: 'O', esVertice: true },
                { pos: [R_vis / 2 + 1, R_vis / 4], texto: `R` },
                { pos: [-r_vis / 2 - 0.5, r_vis / 4], texto: `r` },
              );
            } else if (tipo === 1) {
              poligonosBase.push([
                [-R_vis, -R_vis],
                [R_vis, -R_vis],
                [R_vis, R_vis],
                [-R_vis, R_vis],
              ]);
              poligonosBorde.push([
                [-R_vis, -R_vis],
                [R_vis, -R_vis],
                [R_vis, R_vis],
                [-R_vis, R_vis],
              ]);
              circulosHueco.push({ centro: [0, 0], r: R_vis });
              circulosBorde.push({ centro: [0, 0], r: R_vis });
              lineas.push({ p1: [0, 0], p2: [R_vis, 0], punteada: true });
              etiquetas.push(
                { pos: [-0.4, -0.4], texto: 'O', esVertice: true },
                {
                  pos: [-R_vis - 0.6, -R_vis - 0.6],
                  texto: 'A',
                  esVertice: true,
                },
                {
                  pos: [R_vis + 0.6, -R_vis - 0.6],
                  texto: 'B',
                  esVertice: true,
                },
                { pos: [R_vis / 2, 0.6], texto: `r` },
              );
            } else if (tipo === 2) {
              parchesBase.push(createDonutArc(0, 0, R_vis, r_vis, 0, 180));
              parchesArcos.push(
                { centro: [0, 0], r: R_vis, inicio: 0, fin: 180 },
                { centro: [0, 0], r: r_vis, inicio: 0, fin: 180 },
              );
              parchesLineas.push(
                [
                  [-R_vis, 0],
                  [-r_vis, 0],
                ],
                [
                  [r_vis, 0],
                  [R_vis, 0],
                ],
              );
              lineas.push(
                {
                  p1: [0, 0],
                  p2: [
                    R_vis * Math.cos(Math.PI / 4),
                    R_vis * Math.sin(Math.PI / 4),
                  ],
                  punteada: true,
                },
                {
                  p1: [0, 0],
                  p2: [
                    r_vis * Math.cos((Math.PI * 3) / 4),
                    r_vis * Math.sin((Math.PI * 3) / 4),
                  ],
                  punteada: true,
                },
              );
              etiquetas.push(
                { pos: [0, -0.6], texto: 'O', esVertice: true },
                { pos: [R_vis / 2 + 0.5, R_vis / 2], texto: `R` },
                { pos: [-r_vis / 2 - 0.5, r_vis / 2], texto: `r` },
              );
            } else if (tipo === 3) {
              parchesBase.push(createDonutArc(0, 0, R_vis, r_vis, 0, 90));
              parchesArcos.push(
                { centro: [0, 0], r: R_vis, inicio: 0, fin: 90 },
                { centro: [0, 0], r: r_vis, inicio: 0, fin: 90 },
              );
              parchesLineas.push(
                [
                  [r_vis, 0],
                  [R_vis, 0],
                ],
                [
                  [0, r_vis],
                  [0, R_vis],
                ],
              );
              lineas.push(
                {
                  p1: [0, 0],
                  p2: [
                    R_vis * Math.cos(Math.PI / 3),
                    R_vis * Math.sin(Math.PI / 3),
                  ],
                  punteada: true,
                },
                {
                  p1: [0, 0],
                  p2: [
                    r_vis * Math.cos(Math.PI / 6),
                    r_vis * Math.sin(Math.PI / 6),
                  ],
                  punteada: true,
                },
              );
              etiquetas.push(
                { pos: [-0.4, -0.4], texto: 'O', esVertice: true },
                { pos: [R_vis / 2, R_vis / 2 + 0.5], texto: `R` },
                { pos: [r_vis / 2 + 0.5, r_vis / 4], texto: `r` },
              );
            }
          }

          // =====================================
          // 3. AVANZADO (8 Figuras de Reto Geométrico)
          // =====================================
          else if (id.includes('avanzado')) {
            const k = v.k || 1;
            const x = v.x || 3;
            const fExp = (target: number, coef: number) => {
              const cte = target - coef * x;
              return cte === 0
                ? `${coef}x`
                : cte < 0
                  ? `${coef}x - ${Math.abs(cte)}`
                  : `${coef}x + ${cte}`;
            };

            if (tipo === 0) {
              // DOBLE TRIÁNGULO ALGEBRAICO
              const pA = [0, 0],
                pB = [21 * k, 0],
                pP = [12 * k, 12 * k];
              poligonosBase.push([pA, pB, pP]);
              poligonosBorde.push([pA, pB, pP]);
              lineas.push({
                p1: [12 * k, 0],
                p2: pP,
                punteada: true,
                resaltada: true,
              });
              angulos.push(
                { centro: pA, r: 1.5 * k, inicio: 0, fin: 45 },
                { centro: pB, r: 1.5 * k, inicio: 143, fin: 180 },
              );
              etiquetas.push(
                { pos: [6 * k, -1.5 * k], texto: fExp(12 * k, 3) }, // Base con 3x
                { pos: [12 * k + 1.5 * k, 6 * k], texto: fExp(12 * k, 2) }, // Altura con 2x
                { pos: [16.5 * k, -1.5 * k], texto: `${9 * k}` }, // Base 2
                { pos: [2.5 * k, 1 * k], texto: `45°` },
                { pos: [21 * k - 2.5 * k, 1 * k], texto: `53°` },
              );
            } else if (tipo === 1) {
              // ROMBOIDE
              const p0 = [0, 0],
                p1 = [15 * k, 0],
                p2 = [21 * k, 8 * k],
                p3 = [6 * k, 8 * k];
              poligonosBase.push([p0, p1, p2, p3]);
              poligonosBorde.push([p0, p1, p2, p3]);
              lineas.push({
                p1: [6 * k, 0],
                p2: p3,
                punteada: true,
                resaltada: true,
              });
              angulos.push({ centro: p0, r: 1.5 * k, inicio: 0, fin: 53 });
              etiquetas.push(
                { pos: [7.5 * k, -1.5 * k], texto: `${15 * k}` },
                { pos: [3 * k - 1, 4 * k + 1], texto: `${10 * k}` },
                { pos: [6 * k + 1, 4 * k], texto: `h = ?` },
                { pos: [2 * k, 1 * k], texto: `53°` },
              );
            } else if (tipo === 2) {
              // POLÍGONO L (De tu imagen)
              const pts = [
                [0, 12 * k],
                [4 * k, 12 * k],
                [4 * k, 4 * k],
                [12 * k, 4 * k],
                [12 * k, 0],
                [0, 0],
              ];
              poligonosBase.push(pts);
              poligonosBorde.push(pts);
              lineas.push({
                p1: [4 * k, 0],
                p2: [4 * k, 4 * k],
                punteada: true,
              });
              etiquetas.push(
                { pos: [-1.5 * k, 6 * k], texto: `${12 * k}` },
                { pos: [6 * k, -1.5 * k], texto: `${12 * k}` },
                { pos: [8 * k, 5.5 * k], texto: `${8 * k}` },
                { pos: [5.5 * k, 8 * k], texto: `${8 * k}` },
              );
            } else if (tipo === 3) {
              // TRAPECIO COMPUESTO (Rect + Tri) - Triada 8-15-17 Perfecta
              const pts = [
                [0, 0],
                [8 * k, 0],
                [18 * k, 0],
                [18 * k, 15 * k],
                [8 * k, 15 * k],
              ];
              poligonosBase.push([pts[0], pts[2], pts[3], pts[4]]);
              poligonosBorde.push([pts[0], pts[2], pts[3], pts[4]]);
              lineas.push({
                p1: [8 * k, 0],
                p2: [8 * k, 15 * k],
                punteada: true,
                resaltada: true,
              });
              etiquetas.push(
                { pos: [4 * k, -1.5 * k], texto: `${8 * k}` },
                { pos: [13 * k, -1.5 * k], texto: `${10 * k}` },
                { pos: [3 * k, 8 * k], texto: `${17 * k}` }, // Hipotenusa
                { pos: [19.5 * k, 7.5 * k], texto: `${15 * k}` },
              );
            } else if (tipo === 4) {
              // TIENDA DE CAMPAÑA
              const pts = [
                [0, 10 * k],
                [14 * k, 10 * k],
                [14 * k, 0],
                [0, 0],
              ];
              poligonosBase.push(pts);
              poligonosBorde.push(pts);
              const hueco = [
                [0, 0],
                [14 * k, 0],
                [7 * k, 10 * k],
              ];
              poligonosHueco.push(hueco);
              poligonosBorde.push(hueco);
              etiquetas.push(
                { pos: [7 * k, -1.5 * k], texto: `${14 * k}` },
                { pos: [-1.5 * k, 5 * k], texto: `${10 * k}` },
              );
            } else if (tipo === 5) {
              // TRAPECIO CLÁSICO
              const pts = [
                [0, 0],
                [16 * k, 0],
                [13 * k, 8 * k],
                [3 * k, 8 * k],
              ];
              poligonosBase.push(pts);
              poligonosBorde.push(pts);
              lineas.push({
                p1: [3 * k, 0],
                p2: [3 * k, 8 * k],
                punteada: true,
                resaltada: true,
              });
              etiquetas.push(
                { pos: [8 * k, -1.5 * k], texto: `${16 * k}` },
                { pos: [8 * k, 9.5 * k], texto: `${10 * k}` },
                { pos: [1.5 * k, 4 * k], texto: `${8 * k}` },
              );
            } else if (tipo === 6) {
              // ROMBO EN RECTÁNGULO
              const pts = [
                [8 * k, 0],
                [16 * k, 6 * k],
                [8 * k, 12 * k],
                [0, 6 * k],
              ];
              poligonosBase.push(pts);
              poligonosBorde.push(pts);
              lineas.push(
                { p1: [0, 6 * k], p2: [16 * k, 6 * k], punteada: true },
                { p1: [8 * k, 0], p2: [8 * k, 12 * k], punteada: true },
              );
              etiquetas.push(
                { pos: [10 * k, 2 * k], texto: `d=${12 * k}` },
                { pos: [3 * k, 7.5 * k], texto: `D=${16 * k}` },
              );
            } else if (tipo === 7) {
              // CORBATA DE MOÑO
              const t1 = [
                [0, 0],
                [10 * k, 7.5 * k],
                [0, 15 * k],
              ];
              const t2 = [
                [20 * k, 0],
                [10 * k, 7.5 * k],
                [20 * k, 15 * k],
              ];
              poligonosBase.push(t1, t2);
              poligonosBorde.push(t1, t2);
              lineas.push({
                p1: [10 * k, 0],
                p2: [10 * k, 15 * k],
                punteada: true,
              });
              lineas.push({
                p1: [0, 15 * k],
                p2: [20 * k, 15 * k],
                punteada: true,
              }); // Techo
              lineas.push({ p1: [0, 0], p2: [20 * k, 0], punteada: true }); // Piso
              etiquetas.push(
                { pos: [5 * k, -1.5 * k], texto: `${10 * k}` },
                { pos: [15 * k, -1.5 * k], texto: `${10 * k}` },
                { pos: [11.5 * k, 3.5 * k], texto: `${15 * k}` },
              );
            }
          }

          // =====================================
          // 4. EXPERTO (Cadenas Entrelazadas Topológicas Flawless)
          // =====================================
          else if (id.includes('experto')) {
            const ext_vis = 10;
            const int_vis = 6.5;

            if (tipo === 0 || tipo === 2) {
              poligonosBase.push(createDonut(0, 0, ext_vis / 2, int_vis / 2));
              circulosBorde.push(
                { centro: [0, 0], r: ext_vis / 2 },
                { centro: [0, 0], r: int_vis / 2 },
              );
              lineas.push(
                { p1: [0, 0], p2: [ext_vis / 2, 0], punteada: true },
                { p1: [0, 0], p2: [0, int_vis / 2], punteada: true },
              );
              etiquetas.push({
                pos: [-0.4, -0.4],
                texto: 'O',
                esVertice: true,
              });
            } else if (tipo === 1 || tipo === 3) {
              const numAros = v.num_aros || 3;
              const r_big = 8;
              const r_sma = 5.5;
              const sep = 9.0;
              const startX = (-(numAros - 1) * sep) / 2;

              for (let i = 0; i < numAros; i++) {
                const cx = startX + i * sep;
                poligonosBase.push(createDonut(cx, 0, r_big, r_sma));
                circulosBorde.push(
                  { centro: [cx, 0], r: r_big },
                  { centro: [cx, 0], r: r_sma },
                );

                if (i > 0) {
                  const prevCx = startX + (i - 1) * sep;
                  parchesBase.push(
                    createDonutArc(prevCx, 0, r_big, r_sma, 0, 90),
                  );
                  parchesArcos.push(
                    { centro: [prevCx, 0], r: r_big, inicio: 0, fin: 90 },
                    { centro: [prevCx, 0], r: r_sma, inicio: 0, fin: 90 },
                  );
                }
              }
            }
          }

          return {
            type: 'geometry_mafs',
            theme: 'area_sombreada',
            poligonosBase,
            poligonosHueco,
            poligonosBorde,
            parchesBase,
            parchesLineas,
            parchesArcos,
            circulosBase,
            circulosHueco,
            circulosBorde,
            angulos,
            lineas,
            etiquetas,
          };
        }

        case 'teorema_pitagoras': {
          const v = valores;
          const tipo = v.tipo_fig !== undefined ? v.tipo_fig : 0;
          const dif = plantilla.dificultad[0];

          // 🔥 DECLARACIÓN DE VARIABLES PURAS PARA TYPESCRIPT (Sin errores)
          let vertices: [number, number][] = [];
          let lados: any[] = [];
          let lineasPunteadas: any[] = [];
          let etiquetas: any[] = [];
          let trazosRojos: any[] = [];
          let vectores: any[] = [];

          // Helper estricto para valores (evita undefined)
          const f = (val: any) => (val !== undefined ? `${val}` : 'x');

          if (tipo === 0) {
            // 🔹 FIG 0: Triángulo Rectángulo Rotado
            vertices = [
              [0, 4],
              [0, 0],
              [5, 0],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[0] },
            ];
            etiquetas = [
              { texto: 'A', pos: [-0.5, 4.2] },
              { texto: 'C', pos: [-0.5, -0.5] },
              { texto: 'B', pos: [5.2, -0.5] },
              { texto: `${f(v.cat1)}`, pos: [-0.8, 2] },
              { texto: `${f(v.cat2)}`, pos: [2.5, -0.8] },
              { texto: `x`, pos: [3, 2.5] },
            ];
          } else if (tipo === 1) {
            // 🔹 FIG 1: El Rombo
            vertices = [
              [0, 4],
              [3, 0],
              [0, -4],
              [-3, 0],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[3], fin: vertices[0] },
            ];
            lineasPunteadas = [
              { inicio: vertices[0], fin: vertices[2] },
              { inicio: vertices[3], fin: vertices[1] },
            ];
            etiquetas = [
              { texto: 'A', pos: [0, 4.5] },
              { texto: 'B', pos: [3.5, 0] },
              { texto: 'C', pos: [0, -4.5] },
              { texto: 'D', pos: [-3.5, 0] },
              { texto: `${f(v.d2)}`, pos: [-0.6, 2] },
              { texto: `${f(v.d1)}`, pos: [1.5, -0.6] },
              { texto: `x`, pos: [2.2, 2.2] },
            ];
          } else if (tipo === 2) {
            // 🔹 FIG 2: Triángulo Isósceles
            vertices = [
              [0, 4],
              [-4, 0],
              [4, 0],
            ];
            lados = [
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[1], fin: vertices[0] },
              { inicio: vertices[2], fin: vertices[0] },
            ];
            lineasPunteadas = [{ inicio: [0, 4], fin: [0, 0] }];
            etiquetas = [
              { texto: 'B', pos: [0, 4.5] },
              { texto: 'A', pos: [-4.5, -0.5] },
              { texto: 'C', pos: [4.5, -0.5] },
              { texto: `${f(v.base)}`, pos: [0, -0.8] },
              { texto: `x`, pos: [-2.5, 2.5] },
              { texto: `x`, pos: [2.5, 2.5] },
              { texto: `${f(v.h)}`, pos: [0.5, 2] },
            ];
          } else if (tipo === 3) {
            // 🔹 FIG 3: Trapecio Rectángulo
            vertices = [
              [-3, 4],
              [1, 4],
              [4, 0],
              [-3, 0],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[3], fin: vertices[0] },
            ];
            lineasPunteadas = [{ inicio: [1, 4], fin: [1, 0] }];
            etiquetas = [
              { texto: 'A', pos: [-3.5, 4.5] },
              { texto: 'B', pos: [1.5, 4.5] },
              { texto: 'C', pos: [4.5, -0.5] },
              { texto: 'D', pos: [-3.5, -0.5] },
              { texto: `${f(v.b_menor)}`, pos: [-1, 4.6] },
              { texto: `${f(v.b_mayor)}`, pos: [0.5, -0.8] },
              { texto: `${f(v.h)}`, pos: [-3.8, 2] },
              { texto: `x`, pos: [3.2, 2.5] },
              { texto: `${f(v.h)}`, pos: [1.5, 2] },
            ];
          } else if (tipo === 4) {
            // 🔹 FIG 4: Pared y Escalera
            vertices = [
              [0, 5],
              [0, 0],
              [4, 0],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[0] },
            ];
            etiquetas = [
              { texto: 'P', pos: [-0.5, 5.5] },
              { texto: 'O', pos: [-0.5, -0.5] },
              { texto: 'E', pos: [4.5, -0.5] },
              { texto: `${f(v.h)}`, pos: [-0.8, 2.5] },
              { texto: `${f(v.distancia)}`, pos: [2, -0.8] },
              { texto: `x`, pos: [2.5, 3] },
            ];
          } else if (tipo === 5) {
            // 🔹 FIG 5: Rectángulo con Diagonal (Intermedio)
            vertices = [
              [-4, 3],
              [4, 3],
              [4, -3],
              [-4, -3],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[3], fin: vertices[0] },
            ];
            lineasPunteadas = [{ inicio: vertices[3], fin: vertices[1] }];
            etiquetas = [
              { texto: `${f(v.base)}`, pos: [0, -3.8] },
              { texto: `${f(v.diag)}`, pos: [-0.8, 0.5] },
              { texto: `x`, pos: [4.5, 0] },
            ];
          } else if (tipo === 6) {
            // 🔹 FIG 6: Rombo con Lado y media diagonal (Intermedio)
            vertices = [
              [0, 4],
              [3, 0],
              [0, -4],
              [-3, 0],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[3], fin: vertices[0] },
            ];
            lineasPunteadas = [
              { inicio: vertices[0], fin: vertices[2] },
              { inicio: vertices[3], fin: vertices[1] },
            ];
            etiquetas = [
              { texto: `${f(v.lado)}`, pos: [2, 2.5] },
              { texto: `${f(v.d1)}`, pos: [-1.5, -0.5] },
              { texto: `x`, pos: [-0.5, 2] },
            ];
          } else if (tipo === 7) {
            // 🔹 FIG 7: Triángulo Isósceles (Intermedio)
            vertices = [
              [0, 4],
              [-3, -2],
              [3, -2],
            ];
            lados = [
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[1], fin: vertices[0] },
              { inicio: vertices[2], fin: vertices[0] },
            ];
            lineasPunteadas = [{ inicio: [0, 4], fin: [0, -2] }];
            etiquetas = [
              { texto: `${f(v.lado)}`, pos: [-2, 1.5] },
              { texto: `${f(v.h)}`, pos: [0.5, 1] },
              { texto: `x`, pos: [0, -2.8] },
            ];
          } else if (tipo === 8) {
            // 🔹 FIG 8: Trapecio Rectángulo Inverso (Intermedio)
            vertices = [
              [-3, 3],
              [1, 3],
              [4, -2],
              [-3, -2],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[3], fin: vertices[0] },
            ];
            lineasPunteadas = [{ inicio: [1, 3], fin: [1, -2] }];
            etiquetas = [
              { texto: `${f(v.b_menor)}`, pos: [-1, 3.8] },
              { texto: `${f(v.b_mayor)}`, pos: [0.5, -2.8] },
              { texto: `${f(v.oblicuo)}`, pos: [3.2, 1] },
              { texto: `x`, pos: [1.5, 0.5] },
            ];
          } else if (tipo === 9) {
            // 🔹 FIG 9: Dos Postes (Intermedio)
            vertices = [
              [-3, -3],
              [-3, 1],
              [3, -3],
              [3, 4],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[2] },
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[1], fin: vertices[3] },
            ];
            lineasPunteadas = [{ inicio: [-3, 1], fin: [3, 1] }];
            etiquetas = [
              { texto: `${f(v.h1)}`, pos: [-3.8, -1] },
              { texto: `${f(v.h2)}`, pos: [3.8, 0.5] },
              { texto: `${f(v.dist)}`, pos: [0, -3.8] },
              { texto: `x`, pos: [0, 3] },
            ];
          } else if (tipo === 10) {
            // 🔹 FIG 10: Doble Triángulo con Lado Común (Avanzado)
            vertices = [
              [0, 0],
              [4, 0],
              [0, 3],
              [-3, 0],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[0] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[3], fin: vertices[0] },
            ];
            etiquetas = [
              { texto: `${f(v.cat1A)}`, pos: [2, -0.8] },
              { texto: `${f(v.hip1)}`, pos: [2.5, 2] },
              { texto: `${f(v.cat2A)}`, pos: [-1.5, -0.8] },
              { texto: `x`, pos: [-2, 2] },
            ];
          } else if (tipo === 11) {
            // 🔹 FIG 11: Trapecio Isósceles (Avanzado)
            vertices = [
              [-2, 3],
              [2, 3],
              [4, -3],
              [-4, -3],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[3], fin: vertices[0] },
            ];
            lineasPunteadas = [
              { inicio: [-2, 3], fin: [-2, -3] },
              { inicio: [2, 3], fin: [2, -3] },
            ];
            etiquetas = [
              { texto: `${f(v.b_menor)}`, pos: [0, 3.8] },
              { texto: `${f(v.b_mayor)}`, pos: [0, -3.8] },
              { texto: `${f(v.h)}`, pos: [2.5, 0] },
              { texto: `x`, pos: [-3.8, 0] },
            ];
          } else if (tipo === 12) {
            // 🔹 FIG 12: Poste Quebrado (Avanzado)
            vertices = [
              [-3, -3],
              [-3, 1],
              [2, -3],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[0], fin: vertices[2] },
              { inicio: vertices[1], fin: vertices[2] },
            ];
            etiquetas = [
              { texto: `x`, pos: [-3.5, -1] },
              { texto: `${f(v.dist)}`, pos: [-0.5, -3.8] },
            ];
          } else if (tipo === 13) {
            // 🔹 FIG 13: Antena y dos tensores (Avanzado)
            vertices = [
              [0, 4],
              [-3, -2],
              [3, -2],
            ];
            lados = [
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[0], fin: vertices[2] },
            ];
            lineasPunteadas = [{ inicio: [0, 4], fin: [0, -2] }];
            etiquetas = [
              { texto: `${f(v.h)}`, pos: [0.5, 1] },
              { texto: `${f(v.dist)}`, pos: [1.5, -2.5] },
              { texto: `x/2`, pos: [2, 1.5] },
            ];
          } else if (tipo === 14) {
            // 🔹 FIG 14: Cuadrante de circunferencia (Avanzado)
            vertices = [
              [-4, -4],
              [0, -4],
              [0, -1],
              [-4, -1],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[3], fin: vertices[0] },
            ];
            lineasPunteadas = [
              { inicio: [-4, -4], fin: [0, -1] },
              { inicio: [-4, -4], fin: [-4, 3] },
              { inicio: [-4, -4], fin: [3, -4] },
            ];
            etiquetas = [
              { texto: `${f(v.base)}`, pos: [-2, -4.5] },
              { texto: `${f(v.alt)}`, pos: [0.5, -2.5] },
              { texto: `x`, pos: [-2, -2] },
            ];
          } else if (tipo === 15) {
            // 🔹 FIG 15: La Escalera Quebrada (Experto - LÍNEAS Y ETIQUETAS PERFECCIONADAS)
            vertices = [
              [-3, -3],
              [-3, -1],
              [-1, -1],
              [-1, 1],
              [1, 1],
              [1, 3],
              [3, 3],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[3], fin: vertices[4] },
              { inicio: vertices[4], fin: vertices[5] },
              { inicio: vertices[5], fin: vertices[6] },
              { inicio: [-3, -3], fin: [3, 3] }, // Hipotenusa 'x' en línea sólida
            ];

            // Proyecciones de los catetos para armar el triángulo gigante visualmente
            lineasPunteadas = [
              { inicio: [-3, -3], fin: [3, -3] },
              { inicio: [3, -3], fin: [3, 3] },
            ];

            etiquetas = [
              { texto: `${f(v.suma_x)}`, pos: [0, -3.8] },
              { texto: `${f(v.suma_y)}`, pos: [3.8, 0] },
              { texto: `A`, pos: [-3.5, -3.5] },
              { texto: `C`, pos: [3.5, 3.5] },
              { texto: `x = AC`, pos: [-2.5, 1.5] }, // Alejado de los peldaños, en el espacio vacío
            ];
          } else if (tipo === 16) {
            // 🔹 FIG 16: Prisma Diagonal (Experto)
            vertices = [
              [-3, -2],
              [2, -2],
              [4, 0],
              [-1, 0],
              [-3, 2],
              [2, 2],
              [4, 4],
              [-1, 4],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[3], fin: vertices[0] },
              { inicio: vertices[4], fin: vertices[5] },
              { inicio: vertices[5], fin: vertices[6] },
              { inicio: vertices[6], fin: vertices[7] },
              { inicio: vertices[7], fin: vertices[4] },
              { inicio: vertices[0], fin: vertices[4] },
              { inicio: vertices[1], fin: vertices[5] },
              { inicio: vertices[2], fin: vertices[6] },
            ];
            lineasPunteadas = [
              { inicio: vertices[3], fin: vertices[2] },
              { inicio: vertices[3], fin: vertices[7] },
              { inicio: vertices[0], fin: vertices[2] },
              { inicio: vertices[0], fin: vertices[6] },
            ];
            etiquetas = [
              { texto: `${f(v.a)}`, pos: [-0.5, -2.5] },
              { texto: `${f(v.b)}`, pos: [3.5, -1] },
              { texto: `${f(v.c)}`, pos: [2.5, 0] },
              { texto: `x`, pos: [0.5, 1.5] },
            ];
          } else if (tipo === 17) {
            // 🔹 FIG 17: Ejes Cardinales (Experto)
            vertices = [
              [0, 0],
              [0, 4],
              [3, 0],
            ];
            lados = [{ inicio: vertices[1], fin: vertices[2] }];

            vectores = [
              { inicio: [0, 0], fin: [0, 5] },
              { inicio: [0, 0], fin: [4, 0] },
            ];
            etiquetas = [
              { texto: `P`, pos: [-0.5, -0.5] },
              { texto: `${f(v.norte)}`, pos: [-0.8, 2] },
              { texto: `${f(v.este)}`, pos: [1.5, -0.8] },
              { texto: `x`, pos: [2, 2.5] },
              { texto: 'N', pos: [0, 5.5] },
              { texto: 'E', pos: [4.5, 0] },
            ];
          } else if (tipo === 18) {
            // 🔹 FIG 18: Triángulo en esquina de cuadrado (Experto)
            vertices = [
              [-3, -3],
              [3, -3],
              [3, 3],
              [-3, 3],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[3] },
              { inicio: vertices[3], fin: vertices[0] },
              { inicio: [-3, 1], fin: [2, -3] },
            ];
            etiquetas = [
              { texto: `${f(v.lado)}`, pos: [0, 3.5] },
              { texto: `${f(v.c1)}`, pos: [-3.5, -1] },
              { texto: `${f(v.c2)}`, pos: [-0.5, -3.8] },
              { texto: `A`, pos: [-3.5, -3.5] },
              { texto: `B`, pos: [2.5, -3.5] },
              { texto: `C`, pos: [-3.5, 1.5] },
              { texto: `Perímetro(ABC) = x`, pos: [0.5, 1.8] }, // Etiqueta descriptiva ajustada
            ];
          } else if (tipo === 19) {
            // 🔹 FIG 19: Equilátero 30-60-90 (Experto)
            vertices = [
              [0, 4],
              [-2.3, 0],
              [2.3, 0],
            ];
            lados = [
              { inicio: vertices[0], fin: vertices[1] },
              { inicio: vertices[1], fin: vertices[2] },
              { inicio: vertices[2], fin: vertices[0] },
            ];
            trazosRojos = [{ inicio: [0, 4], fin: [0, 0] }];
            etiquetas = [
              { texto: `${f(v.lado)}`, pos: [-1.5, 2.5] },
              { texto: `x√3`, pos: [1.0, 1.5] }, // Representación Unicode limpia, flotando lejos de la línea roja
            ];
          }

          // 🔥 RETURN FINAL: Inyección perfecta hacia el frontend de React
          return {
            type: 'geometry_mafs',
            theme: 'triangulo_completo',
            variante: dif,
            vertices,
            etiquetas,
            lados,
            lineasAzulesPunteadas: lineasPunteadas,
            trazosRojos,
            vectores,
          };
        }

        case 'circulo':
          return {
            type: 'geometry_mafs',
            theme: 'circulo',
            centro: [0, 0],
            radio: valores.radio,
            label: `r = ${valores.radio}`,
            color: '#2563eb',
          };
        case 'poligono_regular':
          return {
            type: 'geometry_mafs',
            theme: 'poligono_regular',
            lados: valores.lados,
            radio: valores.lado / (2 * Math.sin(Math.PI / valores.lados)),
            centro: [0, 0],
            labels: Array.from({ length: valores.lados }, (_, i) =>
              String.fromCharCode(65 + i),
            ),
            color: '#2563eb',
          };
        case 'volumen_cubo': {
          const lado = valores.arista;
          const p: [number, number][] = [
            [0, 0],
            [lado, 0],
            [lado, lado],
            [0, lado],
            [lado * 0.5, lado * 0.3],
            [lado * 1.5, lado * 0.3],
            [lado * 1.5, lado * 1.3],
            [lado * 0.5, lado * 1.3],
          ];
          return {
            type: 'geometry_mafs',
            theme: 'cubo',
            puntos: p,
            color: '#2563eb',
          };
        }
        case 'angulo_inscrito':
          return {
            type: 'geometry_mafs',
            theme: 'angulo_circulo',
            radio: 5,
            central: valores.central,
            inscrito: valores.inscrito,
          };
        case 'ejes_simetria':
          return {
            type: 'geometry_mafs',
            theme: 'simetria',
            figura: valores.figura,
            ejes: valores.ejes,
          };
        case 'rectangulo_punto_diagonal': {
          const { ancho, alto, dist, pos_p } = valores;

          const rectVertices: [number, number][] = [
            [0, 0],
            [ancho, 0],
            [ancho, alto],
            [0, alto],
          ];
          const diagonal: [number, number][] = [
            [0, 0],
            [ancho, alto],
          ];

          let punto: [number, number] = [0, 0];
          // 🔥 Ubicación dinámica basada en la variable pos_p
          if (pos_p === 0)
            punto = [ancho - dist, alto]; // Superior (midiendo desde C)
          else if (pos_p === 1)
            punto = [dist, 0]; // Inferior (midiendo desde A)
          else if (pos_p === 2)
            punto = [ancho, alto - dist]; // Derecho (midiendo desde C)
          else if (pos_p === 3) punto = [0, dist]; // Izquierdo (midiendo desde A)

          return {
            type: 'geometry_mafs',
            theme: 'rectangulo_punto_diagonal',
            rectangulo: rectVertices,
            punto: punto,
            diagonal: diagonal,
            pos_p: pos_p, // Le avisamos al frontend dónde está
          };
        }

        case 'cuadrados_superpuestos': {
          const ladoG = valores.lado_grande;
          const ladoP = valores.lado_pequeno;
          const offset = (ladoG - ladoP) / 2;
          const grande: [number, number][] = [
            [0, 0],
            [ladoG, 0],
            [ladoG, ladoG],
            [0, ladoG],
          ];
          const pequeno: [number, number][] = [
            [offset, offset],
            [offset + ladoP, offset],
            [offset + ladoP, offset + ladoP],
            [offset, offset + ladoP],
          ];
          return {
            type: 'geometry_mafs',
            theme: 'cuadrados_superpuestos',
            cuadradoGrande: grande,
            cuadradoPequeno: pequeno,
            perimetro: valores.perimetro_sombreado,
          };
        }

        case 'triangulo_cuadrado_inscrito': {
          const area = valores.area;
          const base = valores.base;
          const altura = (2 * area) / base; // La altura es el lado del cuadrado (SB)

          // Coordenadas basadas en la imagen del libro (S es el origen 0,0)
          // S = (0,0), B = (0, altura)
          // El cuadrado SBPQ va hacia la derecha: P = (altura, altura), Q = (altura, 0)
          const cuadrado: [number, number][] = [
            [0, 0], // S
            [0, altura], // B
            [altura, altura], // P
            [altura, 0], // Q
          ];

          // El triángulo ABC. AC es la base.
          // Para que se vea como el libro, A está a la izquierda de S, y C está a la derecha de S.
          // Haremos que la distancia de S a C sea el 60% de la base, y de S a A el 40%.
          const distC = base * 0.6;
          const distA = base * 0.4;
          const triangulo: [number, number][] = [
            [-distA, 0], // A (Izquierda)
            [0, altura], // B (Arriba)
            [distC, 0], // C (Derecha)
          ];

          return {
            type: 'geometry_mafs',
            theme: 'triangulo_cuadrado_inscrito',
            triangulo: triangulo,
            cuadrado: cuadrado,
            baseAC: base, // Enviamos la longitud de la base para pintarla abajo
          };
        }

        case 'paralelas_multiples': {
          // Generar tres paralelas horizontales y dos transversales
          const y1 = 0;
          const y2 = 2.5;
          const y3 = 5;
          const pendiente1 = (Math.random() * 1.5 - 0.75) * 0.5; // menos inclinadas
          const pendiente2 = (Math.random() * 1.5 - 0.75) * 0.5;
          const intercepto1 = Math.random() * 3 - 1.5;
          const intercepto2 = Math.random() * 3 - 1.5;
          const xMin = -5;
          const xMax = 5;

          const lineas = [
            {
              puntos: [
                [xMin, y1],
                [xMax, y1],
              ] as [[number, number], [number, number]],
              label: 'L1',
            },
            {
              puntos: [
                [xMin, y2],
                [xMax, y2],
              ] as [[number, number], [number, number]],
              label: 'L2',
            },
            {
              puntos: [
                [xMin, y3],
                [xMax, y3],
              ] as [[number, number], [number, number]],
              label: 'L3',
            },
            {
              puntos: [
                [xMin, pendiente1 * xMin + intercepto1],
                [xMax, pendiente1 * xMax + intercepto1],
              ] as [[number, number], [number, number]],
              label: 'T1',
            },
            {
              puntos: [
                [xMin, pendiente2 * xMin + intercepto2],
                [xMax, pendiente2 * xMax + intercepto2],
              ] as [[number, number], [number, number]],
              label: 'T2',
            },
          ];

          // Calcular intersecciones para ángulos (simplificado, tomamos algunos)
          const angulos: any[] = [];
          // Intersección de T1 con L2
          const xT1L2 = (y2 - intercepto1) / pendiente1;
          if (xT1L2 >= xMin && xT1L2 <= xMax) {
            const A: [number, number] = [xT1L2 - 1, y2];
            const B: [number, number] = [xT1L2, y2];
            const C: [number, number] = [
              xT1L2 + 1,
              pendiente1 * (xT1L2 + 1) + intercepto1,
            ];
            const { inicio, fin } = obtenerAngulosArco(A, B, C);
            angulos.push({
              centro: B,
              inicio,
              fin,
              etiqueta: `${valores.a}x+${valores.b}°`,
            });
          }
          // Intersección de T2 con L2
          const xT2L2 = (y2 - intercepto2) / pendiente2;
          if (xT2L2 >= xMin && xT2L2 <= xMax) {
            const A: [number, number] = [xT2L2 - 1, y2];
            const B: [number, number] = [xT2L2, y2];
            const C: [number, number] = [
              xT2L2 + 1,
              pendiente2 * (xT2L2 + 1) + intercepto2,
            ];
            const { inicio, fin } = obtenerAngulosArco(A, B, C);
            angulos.push({
              centro: B,
              inicio,
              fin,
              etiqueta: `${valores.c}x+${valores.d}°`,
            });
          }

          return {
            type: 'geometry_mafs',
            theme: 'paralelas_avanzado', // Reutilizamos el avanzado que soporta múltiples líneas
            lineas,
            angulos,
            labelsAdicionales: [],
          };
        }

        case 'bisectriz_angulos': {
          const angAOB = valores.angulo_AOB;
          const angMOB = valores.angulo_MOB;
          const centro: [number, number] = [0, 0];
          const rayos = [
            { angulo: 0, etiqueta: 'OA' },
            { angulo: angAOB, etiqueta: 'OB' },
            { angulo: angAOB / 2, etiqueta: 'OM' },
          ];
          return {
            type: 'geometry_mafs',
            theme: 'bisectriz_angulos',
            centro,
            rayos,
            angulo_entre: angMOB,
          };
        }

        case 'regiones_sombreadas': {
          const v = valores;
          const id = plantilla.id;
          const lineasExtra: any[] = [];
          const puntos: [number, number][] = [];

          if (id.includes('basico')) {
            // Cuadrado con círculo inscrito
            const r = v.lado / 2;
            const pts: [number, number][] = [
              [0, 0],
              [v.lado, 0],
              [v.lado, v.lado],
              [0, v.lado],
            ];
            return {
              type: 'geometry_mafs',
              theme: 'triangulos',
              puntos: pts,
              esArea: true, // Fondo celeste para el cuadrado
              circuloInscrito: { centro: [r, r], radio: r, sombreado: false },
              etiquetasLados: [{ pos: [v.lado / 2, -0.6], texto: `${v.lado}` }],
            };
          }

          if (id.includes('avanzado')) {
            // 🔥 TRASLADO DE ÁREAS (Visual)
            // Dibujamos un cuadrado dividido en 4, sombreado de forma "caótica"
            const L = v.lado;
            const ptsCuadrado: [number, number][] = [
              [0, 0],
              [L, 0],
              [L, L],
              [0, L],
            ];

            // Sombreamos dos triángulos opuestos para que Ariana vea que forman la mitad
            const region1: [number, number][] = [
              [0, 0],
              [L / 2, L / 2],
              [0, L],
            ];
            const region2: [number, number][] = [
              [L, 0],
              [L / 2, L / 2],
              [L, L],
            ];

            return {
              type: 'geometry_mafs',
              theme: 'triangulos',
              puntos: ptsCuadrado,
              regionesSombreadas: [region1, region2],
              lineasExtra: [
                {
                  puntos: [
                    [0, 0],
                    [L, L],
                  ],
                },
                {
                  puntos: [
                    [L, 0],
                    [0, L],
                  ],
                }, // Diagonales
              ],
              etiquetasLados: [{ pos: [L / 2, -0.6], texto: `${L}` }],
            };
          }

          return null;
        }

        // Para "poligono_regular" (ya existe pero verificar que devuelva el theme correcto)
        case 'poligono_regular': {
          // Asegúrate de que en la plantilla se calculen lados y lado (longitud del lado)
          // Aquí necesitamos el radio circunscrito. Si solo tenemos el lado, calcular radio:
          const n = valores.lados;
          const lado = valores.lado;
          const radio = lado / (2 * Math.sin(Math.PI / n));
          return {
            type: 'geometry_mafs',
            theme: 'poligono_regular',
            lados: n,
            radio: radio,
            centro: [0, 0],
            labels: Array.from({ length: n }, (_, i) =>
              String.fromCharCode(65 + i),
            ),
            color: '#2563eb',
          };
        }

        // Para "regiones_sombreadas_compuestas"
        case 'regiones_sombreadas_compuestas': {
          const area1 = valores.area1;
          const area2 = valores.area2;
          const area3 = valores.area3;

          // 🔥 MAGIA MATEMÁTICA INTACTA
          const S_sum = area1 + area2 + area3;
          const discriminante = Math.pow(S_sum, 2) - 4 * area1 * area3;
          const S = S_sum + Math.sqrt(discriminante);

          // 🔥 TRUCO VISUAL: Relación de aspecto dinámica
          // Si A3 es muy grande, hacemos el rectángulo ancho. Si A1 es grande, alto.
          const proporcion = area3 / area1;
          const W = 10 * Math.sqrt(proporcion);
          const H = S / W;

          // Coordenadas exactas
          const y_M = (2 * area1) / W;
          const x_N = (2 * area3) / H;

          const A: [number, number] = [0, 0];
          const B: [number, number] = [W, 0];
          const C: [number, number] = [W, H];
          const D: [number, number] = [0, H];

          const M: [number, number] = [W, y_M];
          const N: [number, number] = [x_N, H];

          const reg1 = [A, B, M];
          const reg2 = [M, C, N];
          const reg3 = [N, D, A];

          const cx1 = (A[0] + B[0] + M[0]) / 3;
          const cy1 = (A[1] + B[1] + M[1]) / 3;
          const cx2 = (M[0] + C[0] + N[0]) / 3;
          const cy2 = (M[1] + C[1] + N[1]) / 3;
          const cx3 = (N[0] + D[0] + A[0]) / 3;
          const cy3 = (N[1] + D[1] + A[1]) / 3;

          return {
            type: 'geometry_mafs',
            theme: 'regiones_sombreadas_compuestas',
            rectangulo: [A, B, C, D],
            trianguloAMN: [A, M, N],
            regiones: [
              { puntos: reg1, texto: `A₁ = ${area1}`, cx: cx1, cy: cy1 },
              { puntos: reg2, texto: `A₂ = ${area2}`, cx: cx2, cy: cy2 },
              { puntos: reg3, texto: `A₃ = ${area3}`, cx: cx3, cy: cy3 },
            ],
          };
        }

        // 🔥 INICIO DEL BLOQUE PARA ÁNGULOS RADIALES
        case 'angulos_radiales': {
          const v = valores;
          // 🔥 DECLARACIONES EXPLÍCITAS PARA TYPESCRIPT (Para que no de error TS2304)
          const x = valores.x;
          let rayos: any[] = [];
          let arcos: any[] = [];

          // 🔥 HELPER FX GLOBAL PARA TODO EL CASE
          const fx = (c: any, k: any) => {
            if (c === undefined && k === undefined) return '';
            let eq = c === 1 ? 'x' : c === 0 ? '' : `${c}x`;
            if (k && k !== 0) eq += eq === '' ? `${k}` : ` + ${k}`;
            return eq + '°';
          };

          // ---------------------------------------------------------
          // 🚀 LÓGICA 1: RADIALES (90, 180, 360)
          // ---------------------------------------------------------
          if (plantilla.id.startsWith('geo_radiales_')) {
            const val1 = (v.a || 0) * x + (v.b || 0);
            const val2 = (v.c || 0) * x + (v.d || 0);

            rayos.push({ angulo: 0, etiqueta: 'A' });
            arcos.push({ inicio: 0, fin: val1, etiqueta: fx(v.a, v.b) });
            rayos.push({ angulo: val1, etiqueta: 'B' });

            if (plantilla.id.includes('basico')) {
              arcos.push({ inicio: val1, fin: 90, etiqueta: fx(v.c, v.d) });
              rayos.push({ angulo: 90, etiqueta: 'C' });
              arcos.push({ inicio: 0, fin: 90, esRecto: true });
            } else if (plantilla.id.includes('intermedio')) {
              arcos.push({ inicio: val1, fin: 180, etiqueta: fx(v.c, v.d) });
              rayos.push({ angulo: 180, etiqueta: 'C' });
            } else {
              const val3 = (v.e || 0) * x + (v.f || 0);
              arcos.push({
                inicio: val1,
                fin: val1 + val2,
                etiqueta: fx(v.c, v.d),
              });
              rayos.push({ angulo: val1 + val2, etiqueta: 'C' });

              arcos.push({
                inicio: val1 + val2,
                fin: val1 + val2 + val3,
                etiqueta: fx(v.e, v.f),
              });
              rayos.push({ angulo: val1 + val2 + val3, etiqueta: 'D' });

              if (plantilla.id.includes('experto')) {
                arcos.push({
                  inicio: val1 + val2 + val3,
                  fin: 360,
                  etiqueta: fx(v.g, v.h),
                });
              } else {
                arcos.push({
                  inicio: val1 + val2 + val3,
                  fin: 360,
                  etiqueta: `${v.k}°`,
                });
              }
              rayos.push({ angulo: 360 });
            }
          }

          // ---------------------------------------------------------
          // 🚀 LÓGICA 2: BISECTRIZ (Reto Lógico CONAMAT)
          // ---------------------------------------------------------
          else if (plantilla.id.startsWith('geo_bisectriz_')) {
            if (plantilla.id.includes('basico')) {
              const realAOM = v.val_c;
              // 🔥 FORZAMOS APERTURA VISUAL: Mínimo 35 grados en pantalla
              const visAOM = Math.max(realAOM, 35);
              const visAOB = visAOM * 2;

              rayos.push(
                { angulo: 0, etiqueta: 'A' },
                { angulo: visAOM, etiqueta: 'M', esBisectriz: true },
                { angulo: visAOB, etiqueta: 'B' },
              );

              arcos.push({ inicio: 0, fin: visAOM, etiqueta: `${realAOM}°` });
              arcos.push({
                inicio: 0,
                fin: visAOB,
                etiqueta: fx(v.coef_x, v.const_b),
                radio: 1.8,
              });
            } else if (plantilla.id.includes('intermedio')) {
              const realAOM = v.coef_x * x + v.const_b;
              const realBOC = v.val_c;

              // Apertura obligatoria para que los textos respiren
              const visAOM = Math.max(realAOM, 30);
              const visAOB = visAOM * 2;
              const visBOC = Math.max(realBOC, 35);

              rayos.push(
                { angulo: 0, etiqueta: 'A' },
                { angulo: visAOM, etiqueta: 'M', esBisectriz: true },
                { angulo: visAOB, etiqueta: 'B' },
                { angulo: visAOB + visBOC, etiqueta: 'C' },
              );

              arcos.push({
                inicio: 0,
                fin: visAOM,
                etiqueta: fx(v.coef_x, v.const_b),
              });
              arcos.push({
                inicio: visAOB,
                fin: visAOB + visBOC,
                etiqueta: `${realBOC}°`,
              });
            } else if (plantilla.id.includes('avanzado')) {
              const realAOB = v.a * x + v.b;
              const realBOC = realAOB * v.relacion;

              // Mínimo 25° para la mitad, haciendo que el total sea al menos 50°
              const visAOM = Math.max(realAOB / 2, 25);
              const visAOB = visAOM * 2;
              const visBOC = Math.max(realBOC, 40);

              rayos.push(
                { angulo: 0, etiqueta: 'A' },
                { angulo: visAOM, etiqueta: 'M', esBisectriz: true },
                { angulo: visAOB, etiqueta: 'B' },
                { angulo: visAOB + visBOC, etiqueta: 'C' },
              );

              arcos.push({ inicio: 0, fin: visAOB, etiqueta: fx(v.a, v.b) });
              arcos.push({
                inicio: 0,
                fin: visAOB + visBOC,
                etiqueta: `${v.total}°`,
                radio: 2.2,
              });
            } else if (plantilla.id.includes('experto')) {
              const realAOB = v.a * x + v.b;
              const realBOC = v.c * x + v.d;

              // Mínimo 50° enteros para que las bisectrices tengan 25° de espacio
              const visAOB = Math.max(realAOB, 50);
              const visBOC = Math.max(realBOC, 50);

              rayos.push({ angulo: 0, etiqueta: 'A' });
              rayos.push({
                angulo: visAOB / 2,
                etiqueta: 'M',
                esBisectriz: true,
              });
              rayos.push({ angulo: visAOB, etiqueta: 'B' });
              rayos.push({
                angulo: visAOB + visBOC / 2,
                etiqueta: 'N',
                esBisectriz: true,
              });
              rayos.push({ angulo: visAOB + visBOC, etiqueta: 'C' });

              arcos.push({ inicio: 0, fin: visAOB, etiqueta: fx(v.a, v.b) });
              arcos.push({
                inicio: visAOB,
                fin: visAOB + visBOC,
                etiqueta: fx(v.c, v.d),
              });
              arcos.push({
                inicio: visAOB / 2,
                fin: visAOB + visBOC / 2,
                etiqueta: `${v.k}°`,
                radio: 2.2,
              });
            }
          }

          return {
            type: 'geometry_mafs',
            theme: 'angulos_radiales',
            idPlantilla: plantilla.id,
            rayos,
            arcos,
            centro: [0, 0],
            origenEtiqueta: 'O',
          };
        }
        // 🔥 FIN DEL BLOQUE PARA ÁNGULOS RADIALES

      case 'rectas_secantes': {
          const id = plantilla.id || '';
          const v = valores || {};
          const lines: any[] = [];
          const labels: any[] = [];
          const colorCeleste = "#38bdf8"; 
          const colorVerde = "#22c55e"; 

          // 🔥 Helper maestro para formatear álgebra (1x -> x, 2x -> 2x)
          const fx = (coef: number) => coef === 1 ? 'x' : `${coef}x`;

          const addRayo = (angleDeg: number, letra: string) => {
            const rad = (angleDeg * Math.PI) / 180;
            const r = 10;
            const pX = r * Math.cos(rad);
            const pY = r * Math.sin(rad);
            
            if (!isNaN(pX) && !isNaN(pY)) {
                lines.push({ puntos: [[0, 0], [pX, pY]], color: colorCeleste, weight: 2 });
                labels.push({ pos: [pX * 1.15, pY * 1.15], dir: [0,0], texto: letra, tipo: 'vertice' });
            }
          };

          const addAnguloLabel = (angS: number, angE: number, texto: string) => {
            const mid = ((angS + angE) / 2) * (Math.PI / 180);
            const dist = 6.2;
            const posX = dist * Math.cos(mid);
            const posY = dist * Math.sin(mid);

            if (!isNaN(posX) && !isNaN(posY)) {
               labels.push({ pos: [posX, posY], dir: [0,0], texto, tipo: 'valor', color: colorVerde });
               const arcoPts: [number, number][] = [];
               for(let a=angS; a<=angE; a+=2) arcoPts.push([3 * Math.cos(a*Math.PI/180), 3 * Math.sin(a*Math.PI/180)]);
               arcoPts.push([3 * Math.cos(angE*Math.PI/180), 3 * Math.sin(angE*Math.PI/180)]);
               lines.push({ puntos: arcoPts, color: colorVerde, weight: 2 });
            }
          };

          labels.push({ pos: [-0.8, -0.8], dir: [0,0], texto: "O", tipo: "vertice" });

          // ==========================================
          // 🟢 BÁSICO / 🟡 INTERMEDIO
          // ==========================================
          if (id.includes('basico') || id.includes('intermedio')) {
            const a1 = 50;
            addRayo(0, "A");
            addRayo(a1, "B");
            addRayo(180, "C");
            addRayo(180 + a1, "D");

            if (id.includes('basico')) {
              // Aplicamos fx() para limpiar las etiquetas
              addAnguloLabel(0, a1, `${fx(v.a)} + ${v.b}°`);
              addAnguloLabel(180, 180 + a1, `${fx(v.c)} + ${v.d}°`);
            } else {
              addAnguloLabel(0, a1, `${fx(v.a)} + ${v.b}°`);
              addAnguloLabel(a1, 180, `${fx(v.c)} + ${v.d}°`);
            }
          } 
          // ==========================================
          // 🔴 AVANZADO / 💀 EXPERTO (360° Seguro)
          // ==========================================
          else {
            const x = v.x || 10; 
            const val1 = (v.a * x + v.b) || 40;
            const val2 = (v.c * x + v.d) || 60;
            
            let val3 = 0, val4 = 0;
            if (id.includes('avanzado')) {
                val3 = (v.e * x + v.f) || 120;
                val4 = 360 - (val1 + val2 + val3);
            } else {
                val3 = v.ang_base || 110;
                val4 = 360 - (val1 + val2 + val3);
            }

            const angB = val1;
            const angC = (val1 + val2) > 360 ? 350 : (val1 + val2);
            const angD = (val1 + val2 + val3) > 360 ? 355 : (val1 + val2 + val3);

            addRayo(0, "A");
            addRayo(angB, "B");
            addRayo(angC, "C");
            addRayo(angD, "D");

            // Aplicamos fx() para limpiar las etiquetas en avanzado y experto
            addAnguloLabel(0, angB, `${fx(v.a)} + ${v.b}°`);
            addAnguloLabel(angB, angC, `${fx(v.c)} + ${v.d}°`);
            
            if (id.includes('avanzado')) {
              addAnguloLabel(angC, angD, `${fx(v.e)} + ${v.f}°`);
              addAnguloLabel(angD, 360, `${Math.max(1, Math.round(val4))}°`); 
            } else {
              addAnguloLabel(angC, angD, `${Math.max(1, Math.round(val3))}°`);
              addAnguloLabel(angD, 360, `${fx(v.e)} + ${v.f}°`);
            }
          }

          const resNum = Number(v.x) || 0;
          v.total = resNum;
          v.respuesta = resNum;

          return {
            valores: v, respuesta: resNum, tipo_render: 'geometry_mafs',
            data: {
              type: 'geometry_mafs', theme: 'area_triangulo',
              puntos: [], 
              esArea: false, etiquetas: labels, lineasExtra: lines, arcos: [],
              respuestaSobreescrita: resNum
            }
          };
        }

        case 'angulos_radiales': {
          const v = valores;
          let rayos: any[] = [];
          let arcos: any[] = [];

          // 1. Lógica para Radiales Consecutivos (Basico, Intermedio, Avanzado)
          if (plantilla.id.startsWith('geo_radiales_')) {
            // 🔥 ESTOS SE QUEDAN COMO ESTABAN ANTES (Siempre existen A, B y C)
            rayos = [
              { angulo: 0, etiqueta: 'A' },
              { angulo: v.ang1, etiqueta: 'B' },
              { angulo: v.ang1 + v.ang2, etiqueta: 'C' },
            ];

            arcos.push(
              {
                inicio: 0,
                fin: v.ang1,
                etiqueta: `${v.a}x${v.b > 0 ? '+' + v.b : ''}°`,
              },
              {
                inicio: v.ang1,
                fin: v.ang1 + v.ang2,
                etiqueta: `${v.c}x${v.d > 0 ? '+' + v.d : ''}°`,
              },
            );

            if (plantilla.id === 'geo_radiales_avanzado') {
              const numAngulos = v.num_angulos;
              // ... (cálculo de rayos y arcos previos)
              if (numAngulos === 3) {
                arcos.push({
                  inicio: v.ang1 + v.ang2,
                  fin: 360,
                  etiqueta: `${v.e}x${v.f > 0 ? '+' + v.f : ''}°`,
                });
              } else {
                const posD = v.ang1 + v.ang2 + v.ang3;
                rayos.push({ angulo: posD, etiqueta: 'D' });
                arcos.push({
                  inicio: v.ang1 + v.ang2,
                  fin: posD,
                  etiqueta: `${v.e}x${v.f > 0 ? '+' + v.f : ''}°`,
                });
                arcos.push({
                  inicio: posD,
                  fin: 360,
                  etiqueta: `${v.ang4}°`, // ahora v.ang4 existe
                });
              }
            }

            if (plantilla.id === 'geo_radiales_basico') {
              arcos.push({ inicio: 0, fin: 90, esRecto: true });
            }
          }

          // 2. Lógica para Bisectrices
          else if (plantilla.id.startsWith('geo_bisectriz_')) {
            // 🔥 ESTO SE QUEDA COMO ESTABA ANTES
            rayos = [
              { angulo: 0, etiqueta: 'A' },
              { angulo: v.angAOM, etiqueta: 'M', esBisectriz: true },
              { angulo: v.angAOB, etiqueta: 'B' },
            ];

            if (v.angBOC !== undefined && v.angBOC > 0) {
              rayos.push({ angulo: v.angAOB + v.angBOC, etiqueta: 'C' });
            }

            if (plantilla.id === 'geo_bisectriz_basico') {
              arcos = [
                { inicio: 0, fin: v.angAOM, etiqueta: `${v.val_c}°` },
                {
                  inicio: v.angAOM,
                  fin: v.angAOB,
                  etiqueta: `${v.coef_x}x + ${v.const_b}°`,
                },
              ];
            } else if (plantilla.id === 'geo_bisectriz_intermedio') {
              arcos.push(
                {
                  inicio: 0,
                  fin: v.angAOM,
                  etiqueta: `${v.coef_x}x + ${v.const_b}°`,
                },
                {
                  inicio: v.angAOB,
                  fin: v.angAOB + v.angBOC,
                  etiqueta: `${v.val_c}°`,
                },
              );
            } else if (plantilla.id === 'geo_bisectriz_avanzado') {
              arcos.push(
                { inicio: 0, fin: v.angAOM, etiqueta: '' },
                { inicio: 0, fin: v.angAOB, etiqueta: `${v.a}x + ${v.b}°` },
                { inicio: v.angAOB, fin: v.angAOB + v.angBOC, etiqueta: '' },
                {
                  inicio: 0,
                  fin: v.angAOB + v.angBOC,
                  etiqueta: `${v.total}°`,
                  radio: 2.2,
                },
              );
            }
          }

          return {
            type: 'geometry_mafs',
            theme: 'angulos_radiales',
            idPlantilla: plantilla.id,
            rayos,
            arcos,
            centro: [0, 0],
            origenEtiqueta: 'O',
          };
        }

        // REEMPLAZA TODO ESTE CASE:
        case 'paralelas_ecuaciones': {
          const esBasico = plantilla.id === 'geo_paralelas_basico';
          const esIntermedio = plantilla.id === 'geo_paralelas_intermedio';
          const esAvanzado = plantilla.id === 'geo_paralelas_avanzado';
          const esExperto = plantilla.id === 'geo_paralelas_experto';

          if (!esBasico && !esIntermedio && !esAvanzado && !esExperto) break;

          const v = valores;
          const tipo = v.tipo_relacion;
          const a = v.a;
          const b = v.b;
          const c = v.c;
          const d = v.d;

          // 1. CONSTRUCCIÓN BASE (Sistema perfectamente horizontal centrado en 0,0)
          // Esto garantiza que Mafs NUNCA falle al dibujar los arcos.
          const y1 = -2; // L1 inferior
          const y2 = 2; // L2 superior

          // Pendiente estable para evitar rectas casi verticales u horizontales
          const pendiente = 0.8 + Math.random() * 0.7;
          const angT_rad = Math.atan(pendiente);
          const angT = angT_rad * (180 / Math.PI);

          // Cruces en X (como intersectan en y, x = y / m)
          const xCruc1 = y1 / pendiente;
          const xCruc2 = y2 / pendiente;

          // Limitar la longitud de las paralelas para un diseño limpio y minimalista
          const xMin = Math.min(xCruc1, xCruc2) - 3.5;
          const xMax = Math.max(xCruc1, xCruc2) + 3.5;

          // Limitar la longitud de la secante (Transversal) con un radio exacto desde el origen
          const radioT = 6;
          const pIzqT = [
            -radioT * Math.cos(angT_rad),
            -radioT * Math.sin(angT_rad),
          ];
          const pDerT = [
            radioT * Math.cos(angT_rad),
            radioT * Math.sin(angT_rad),
          ];

          // 2. DICCIONARIO DE ÁNGULOS (Mapeo estricto por cuadrantes)
          // L1 (y=-2): Ángulos internos apuntan arriba, externos apuntan abajo
          // L2 (y= 2): Ángulos externos apuntan arriba, internos apuntan abajo
          const angulosBase = {
            L1_Q1: { inicio: 0, fin: angT }, // Interno Derecha
            L1_Q2: { inicio: angT, fin: 180 }, // Interno Izquierda
            L1_Q3: { inicio: 180, fin: 180 + angT }, // Externo Izquierda
            L1_Q4: { inicio: 180 + angT, fin: 360 }, // Externo Derecha
            L2_Q1: { inicio: 0, fin: angT }, // Externo Derecha
            L2_Q2: { inicio: angT, fin: 180 }, // Externo Izquierda
            L2_Q3: { inicio: 180, fin: 180 + angT }, // Interno Izquierda
            L2_Q4: { inicio: 180 + angT, fin: 360 }, // Interno Derecha
          };

          const exp = esExperto ? '²' : '';

          const fx = (coef: number, cte: number, isMinus: boolean) => {
            let eq = '';
            if (coef) eq = coef === 1 ? `x${exp}` : `${coef}x${exp}`;
            if (cte) {
              if (eq) eq += isMinus ? ` - ${cte}` : ` + ${cte}`;
              else eq = isMinus ? `-${cte}` : `${cte}`;
            }
            return eq + '°';
          };

          let lbl1 = '';
          let lbl2 = '';

          // Mapeo exacto según el JSON de cada nivel
          if (esBasico || esIntermedio) {
            lbl1 = fx(a, b, false);
            lbl2 = fx(c, d, false);
          } else if (esAvanzado) {
            lbl1 = fx(a, b, true); // Avanzado usa: ax - b
            lbl2 = fx(c, d, false); // Avanzado usa: cx + d
          } else if (esExperto) {
            lbl1 = fx(a, b, true); // Experto usa: ax² - b
            // Experto intercala el signo del segundo según la relación (Z o C)
            lbl2 = fx(c, d, tipo !== 0);
          }

          let configAngulos: any[] = [];
          const pCruc1Base = [xCruc1, y1];
          const pCruc2Base = [xCruc2, y2];

          // Asignación de ángulos según el caso matemático
          switch (tipo) {
            case 0: // Correspondientes
              configAngulos.push({
                p: pCruc1Base,
                ...angulosBase.L1_Q1,
                lbl: lbl1,
              });
              configAngulos.push({
                p: pCruc2Base,
                ...angulosBase.L2_Q1,
                lbl: lbl2,
              });
              break;
            case 1: // Alternos Internos
              configAngulos.push({
                p: pCruc1Base,
                ...angulosBase.L1_Q2,
                lbl: lbl1,
              });
              configAngulos.push({
                p: pCruc2Base,
                ...angulosBase.L2_Q4,
                lbl: lbl2,
              });
              break;
            case 2: // Alternos Externos
              configAngulos.push({
                p: pCruc1Base,
                ...angulosBase.L1_Q3,
                lbl: lbl1,
              });
              configAngulos.push({
                p: pCruc2Base,
                ...angulosBase.L2_Q1,
                lbl: lbl2,
              });
              break;
            case 3: // Conjugados Internos (Suman 180)
              configAngulos.push({
                p: pCruc1Base,
                ...angulosBase.L1_Q2,
                lbl: lbl1,
              });
              configAngulos.push({
                p: pCruc2Base,
                ...angulosBase.L2_Q3,
                lbl: lbl2,
              });
              break;
            case 4: // Conjugados Externos (Suman 180)
              configAngulos.push({
                p: pCruc1Base,
                ...angulosBase.L1_Q3,
                lbl: lbl1,
              });
              configAngulos.push({
                p: pCruc2Base,
                ...angulosBase.L2_Q2,
                lbl: lbl2,
              });
              break;
          }

          // 3. 🔥 ROTACIÓN QUIRÚRGICA (El reto cognitivo) 🔥
          // Básico: 0° (Cómodo). Intermedio/Avanzado: 15° a 35° de giro aleatorio.
          let alfa = 0;
          if (!esBasico) {
            const signo = Math.random() > 0.5 ? 1 : -1;
            alfa = signo * (15 + Math.random() * 20); // Reto visual para la estudiante
          }
          const alfaRad = alfa * (Math.PI / 180);

          // Función pura para rotar un punto 2D
          const rotar = (x: number, y: number): [number, number] => {
            return [
              x * Math.cos(alfaRad) - y * Math.sin(alfaRad),
              x * Math.sin(alfaRad) + y * Math.cos(alfaRad),
            ];
          };

          // 4. APLICAR TRANSFORMACIONES FINALES
          const angulosFinales = configAngulos.map((cfg) => ({
            centro: rotar(cfg.p[0], cfg.p[1]),
            inicio: cfg.inicio + alfa, // La belleza de las matemáticas: solo sumamos el offset
            fin: cfg.fin + alfa,
            etiqueta: cfg.lbl,
          }));

          const lineas = [
            { puntos: [rotar(xMin, y1), rotar(xMax, y1)], label: 'L1' },
            { puntos: [rotar(xMin, y2), rotar(xMax, y2)], label: 'L2' },
            {
              puntos: [rotar(pIzqT[0], pIzqT[1]), rotar(pDerT[0], pDerT[1])],
              label: 'T',
            },
          ];

          return {
            type: 'geometry_mafs',
            theme: 'paralelas_ecuaciones',
            idPlantilla: plantilla.id,
            lineas,
            angulos: angulosFinales,
            labelsAdicionales: [],
          };
        }

        case 'paralelas_serrucho': {
          const esBasico = plantilla.id === 'geo_paralelas_serrucho_basico';
          const esIntermedio =
            plantilla.id === 'geo_paralelas_serrucho_intermedio';
          const esAvanzado = plantilla.id === 'geo_paralelas_serrucho_avanzado';
          const esExperto = plantilla.id === 'geo_paralelas_serrucho_experto';

          if (!esBasico && !esIntermedio && !esAvanzado && !esExperto) break;

          const numAngulosTotales = valores.num_angulos || 3;
          const numVerticesInternos = numAngulosTotales - 2;

          const y1 = 4; // L1
          const y2 = -4; // L2
          const xMin = -6;
          const xMax = 6;

          const puntos: [number, number][] = [];
          const pasoY = (y2 - y1) / (numVerticesInternos + 1);

          let esDerecha = Math.random() > 0.5;

          puntos.push([(Math.random() - 0.5) * 1.5, y1]);

          for (let i = 1; i <= numVerticesInternos; i++) {
            const y = y1 + i * pasoY;
            const amplitudX = 2.5 + Math.random();
            const x = esDerecha ? amplitudX : -amplitudX;
            puntos.push([x, y]);
            esDerecha = !esDerecha;
          }

          puntos.push([(Math.random() - 0.5) * 1.5, y2]);

          // 🔥 MAGIA ARQUITECTÓNICA: Direcciones exactas de los Puntos Fantasma
          // Asegura que SIEMPRE se seleccione la "punta" interior aguda.
          let pFantasmaL1: [number, number] = [
            puntos[1][0] > puntos[0][0] ? xMax : xMin,
            y1,
          ];
          let pFantasmaL2: [number, number] = [
            puntos[puntos.length - 2][0] < puntos[puntos.length - 1][0]
              ? xMin
              : xMax,
            y2,
          ];

          const puntosParaArcos = [pFantasmaL1, ...puntos, pFantasmaL2];

          // 🔥 FORMATO EXPERTO: Ángulos directos en su posición correcta
          const exp = esExperto ? '²' : '';
          const coef1 = valores.a1 === 1 ? '' : valores.a1;
          const coef2 = valores.a2 === 1 ? '' : valores.a2;
          const coef3 = valores.a3 === 1 ? '' : valores.a3;
          const coef4 = valores.a4 === 1 ? '' : valores.a4;
          const coef5 = valores.a5 === 1 ? '' : valores.a5;

          const formulas = [
            esAvanzado
              ? `${valores.b1}° - ${coef1}x`
              : esExperto
                ? `${coef1}x${exp} + ${valores.b1}°` // <-- Valor directo en el punto ROJO
                : `${coef1}x + ${valores.b1}°`,

            esAvanzado
              ? `${valores.b2}° - ${coef2}x`
              : esExperto
                ? `${coef2}x${exp} + ${valores.b2}°`
                : `${coef2}x + ${valores.b2}°`,

            esAvanzado
              ? `${valores.b3}° - ${coef3}x`
              : esExperto
                ? `${valores.b3}°`
                : `${coef3}x + ${valores.b3}°`,

            esExperto
              ? `${valores.b4}°`
              : valores.k
                ? `${valores.k}°`
                : `${coef4 || 1}x + ${valores.b4 || 0}°`,

            esExperto && valores.a5 ? `${coef5}x${exp}` : '',
          ];

          const angulosVis: any[] = [];

          for (let i = 0; i < numAngulosTotales; i++) {
            const vertice = puntosParaArcos[i + 1];
            let { inicio, fin } = obtenerAngulosArco(
              puntosParaArcos[i],
              vertice,
              puntosParaArcos[i + 2],
            );

            // 🔥 FILTRO ABSOLUTO DE SEGURIDAD (No lo borres)
            // Fuerza a que Mafs dibuje el ángulo cerrado, no el reflejo.
            if (fin - inicio > 180) {
              const temp = inicio;
              inicio = fin;
              fin = temp + 360;
            }

            angulosVis.push({
              centro: vertice,
              inicio,
              fin,
              etiqueta: formulas[i],
            });
          }

          const lineasParalelas = [
            {
              puntos: [
                [xMin, y1],
                [xMax, y1],
              ] as [[number, number], [number, number]],
              label: 'L1',
            },
            {
              puntos: [
                [xMin, y2],
                [xMax, y2],
              ] as [[number, number], [number, number]],
              label: 'L2',
            },
          ];

          return {
            type: 'geometry_mafs',
            theme: 'paralelas_serrucho',
            lineasParalelas,
            puntosQuebrada: puntos,
            angulos: angulosVis,
            idPlantilla: plantilla.id,
          };
        }

        case 'angulos_teoricos': {
          if (plantilla.dificultad.includes('avanzado')) return null;

          const esComplemento = valores.T === 90;
          const angulosList: { valor: number; etiqueta: string }[] = [];

          // Helper robusto para armar ecuaciones como "3x + 15°" o "4x - 5°"
          const armarEq = (coef: any, k?: any) => {
            const c = Number(coef) || 1; // Blindaje contra undefined
            let eq = c === 1 ? `x` : `${c}x`;
            if (k !== undefined && k !== 0 && !isNaN(Number(k))) {
              eq += Number(k) > 0 ? ` + ${k}°` : ` - ${Math.abs(Number(k))}°`;
            }
            return eq;
          };
          // Validamos que existan las variables, si no, las recalculamos de emergencia
          const valA = valores.a || 1;
          const valB = valores.b || 1;
          const valC = valores.c || 1;

          // Si k3 falló en calcularse en el JSON, lo salvamos aquí
          let valK3 = valores.k3;
          if (valK3 === undefined) {
            valK3 =
              valores.T -
              (valA + valB + valC) * (valores.x || 10) -
              (valores.k1 || 0) -
              (valores.k2 || 0);
          }

          // Inyectamos los 3 ángulos con coeficientes vivos para que X no se cancele
          angulosList.push({
            valor: valores.ang1 || 30,
            etiqueta: armarEq(valA, valores.k1),
          });
          angulosList.push({
            valor: valores.ang2 || 30,
            etiqueta: armarEq(valB, valores.k2),
          });
          angulosList.push({
            valor: valores.ang3 || 30,
            etiqueta: armarEq(valC, valK3),
          });

          return {
            type: 'geometry_mafs',
            theme: 'angulos_teoricos_multiples',
            esComplemento,
            angulosList,
          };
        }

        case 'triangulo_perimetro': {
          const v = valores;
          const k = v.k || 1;
          const id = plantilla.id;

          let poligonosBase: any[] = [];
          let poligonosHueco: any[] = [];
          let poligonosBorde: any[] = [];
          let lineas: any[] = [];
          let angulos: any[] = [];
          let etiquetas: any[] = [];

          // Formateador Algebraico (Adiós a los 1x y a los +- horribles)
          const fExp = (target: number, c: number) => {
            const x = v.x || 0;
            const cte = target - c * x;
            const cStr = c === 1 ? 'x' : c === -1 ? '-x' : `${c}x`;
            if (cte === 0) return cStr;
            return cte < 0 ? `${cStr} - ${Math.abs(cte)}` : `${cStr} + ${cte}`;
          };

          // Formateador Polinomial para Nivel Experto (ax^2 + c)
          const fPoly = (a: number, b: number) => {
            const aStr = a === 1 ? `x²` : `${a}x²`;
            if (b === 0) return aStr;
            return b < 0 ? `${aStr} - ${Math.abs(b)}` : `${aStr} + ${b}`;
          };

          // ================= BÁSICOS =================
          if (id === 'geo_perim_isosc_bas') {
            const pts: [number, number][] = [
              [0, 0],
              [10 * k, 0],
              [5 * k, 12 * k],
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            etiquetas.push(
              { pos: [5 * k, -1.2 * k], texto: `${10 * k} cm` },
              { pos: [1.5 * k, 6 * k], texto: fExp(13 * k, v.coef) },
            );
          } else if (id === 'geo_perim_equi_bas') {
            const pts: [number, number][] = [
              [0, 0],
              [10 * k, 0],
              [5 * k, 8.66 * k],
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            etiquetas.push({
              pos: [5 * k, -1.2 * k],
              texto: fExp(10 * k, v.coef),
            });
          } else if (id === 'geo_perim_rombo_bas') {
            const rombo = [
              [10 * k, 0],
              [20 * k, 8 * k],
              [10 * k, 16 * k],
              [0, 8 * k],
            ];
            poligonosBase.push(rombo);
            poligonosBorde.push(rombo);
            etiquetas.push({
              pos: [3.5 * k, 3.5 * k],
              texto: fExp(5 * k, v.coef),
            });
          } else if (id === 'geo_perim_escaleno_bas') {
            const pts: [number, number][] = [
              [0, 0],
              [4 * k, 0],
              [0, 3 * k],
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            lineas.push(
              { p1: [0, 0.5 * k], p2: [0.5 * k, 0.5 * k] },
              { p1: [0.5 * k, 0.5 * k], p2: [0.5 * k, 0] },
            ); // Ángulo recto
            etiquetas.push(
              { pos: [2 * k, -0.8 * k], texto: `${4 * k} cm` },
              { pos: [-1 * k, 1.5 * k], texto: `${3 * k} cm` },
              { pos: [2.5 * k, 2 * k], texto: fExp(5 * k, v.coef) },
            );
          }

          // ================= INTERMEDIOS =================
          else if (id === 'geo_perim_casita_int') {
            const rect: [number, number][] = [
              [0, 0],
              [10 * k, 0],
              [10 * k, 6 * k],
              [0, 6 * k],
            ];
            const techo: [number, number][] = [
              [0, 6 * k],
              [10 * k, 6 * k],
              [5 * k, 18 * k],
            ];
            poligonosBase.push(rect, techo);
            poligonosBorde.push(rect, techo);
            lineas.push(
              { p1: [0, 6 * k], p2: [10 * k, 6 * k], punteada: true },
              { p1: [5 * k, 6 * k], p2: [5 * k, 18 * k], punteada: true },
            );
            etiquetas.push(
              { pos: [5 * k, -1.2 * k], texto: `${10 * k} cm` },
              { pos: [-1.5 * k, 3 * k], texto: `${6 * k} cm` },
              { pos: [6 * k, 12 * k], texto: `h=${12 * k}` },
            );
          } else if (id === 'geo_perim_flecha_int') {
            const rect = [
              [0, 0],
              [10 * k, 0],
              [10 * k, 6 * k],
              [0, 6 * k],
            ];
            const tri = [
              [10 * k, 0],
              [10 * k, 6 * k],
              [14 * k, 3 * k],
            ];
            poligonosBase.push(rect, tri);
            poligonosBorde.push(rect, tri);
            lineas.push({
              p1: [10 * k, 0],
              p2: [10 * k, 6 * k],
              punteada: true,
            });
            etiquetas.push(
              { pos: [5 * k, -1.2 * k], texto: `${10 * k} cm` },
              { pos: [-1.5 * k, 3 * k], texto: `${6 * k} cm` },
              { pos: [12.5 * k, 5.5 * k], texto: `${5 * k} cm` }, // <-- Sin el "->"
            );
          } else if (id === 'geo_perim_trap_rect_int') {
            const pts = [
              [0, 0],
              [15 * k, 0],
              [10 * k, 12 * k],
              [0, 12 * k],
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            lineas.push(
              { p1: [0, 1 * k], p2: [1 * k, 1 * k] },
              { p1: [1 * k, 1 * k], p2: [1 * k, 0] },
              { p1: [10 * k, 0], p2: [10 * k, 12 * k], punteada: true },
            );
            etiquetas.push(
              { pos: [7.5 * k, -1.2 * k], texto: `${15 * k} cm` },
              { pos: [5 * k, 13.2 * k], texto: `${10 * k} cm` },
              { pos: [-1.5 * k, 6 * k], texto: `${12 * k} cm` },
            );
          } else if (id === 'geo_perim_cruz_int') {
            const pts = [
              [4 * k, 0],
              [12 * k, 0],
              [12 * k, 4 * k],
              [16 * k, 4 * k],
              [16 * k, 12 * k],
              [12 * k, 12 * k],
              [12 * k, 16 * k],
              [4 * k, 16 * k],
              [4 * k, 12 * k],
              [0, 12 * k],
              [0, 4 * k],
              [4 * k, 4 * k],
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            // 🔥 El Cuadrado de Traslación (Visual para el estudiante)
            lineas.push(
              { p1: [0, 0], p2: [16 * k, 0], punteada: true },
              { p1: [16 * k, 0], p2: [16 * k, 16 * k], punteada: true },
              { p1: [16 * k, 16 * k], p2: [0, 16 * k], punteada: true },
              { p1: [0, 16 * k], p2: [0, 0], punteada: true },
            );
            etiquetas.push(
              { pos: [8 * k, -1.2 * k], texto: `${8 * k} cm` },
              { pos: [17.5 * k, 8 * k], texto: `${8 * k} cm` },
            );
          }

          // ================= AVANZADOS =================
          else if (id === 'geo_perim_reloj_avz') {
            const tTop: [number, number][] = [
              [0, 24 * k],
              [32 * k, 24 * k],
              [16 * k, 12 * k],
            ];
            const tBot: [number, number][] = [
              [0, 0],
              [32 * k, 0],
              [16 * k, 12 * k],
            ];
            poligonosBase.push(tTop, tBot);
            poligonosBorde.push(tTop, tBot);
            lineas.push({
              p1: [16 * k, 0],
              p2: [16 * k, 24 * k],
              punteada: true,
            });
            angulos.push({
              centro: [32 * k, 24 * k],
              r: 2.5 * k,
              inicio: 180,
              fin: 217,
            });
            etiquetas.push(
              { pos: [27 * k, 22.5 * k], texto: `37°` },
              { pos: [17.5 * k, 6 * k], texto: `h = ${12 * k}` },
            );
          } else if (id === 'geo_perim_romboide_30_avz') {
            // Base 18, h=5, Lado = 10 (por triángulo 30-60-90)
            const pts = [
              [0, 0],
              [18 * k, 0],
              [26.66 * k, 5 * k],
              [8.66 * k, 5 * k],
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            lineas.push({
              p1: [8.66 * k, 0],
              p2: [8.66 * k, 5 * k],
              punteada: true,
            });
            angulos.push({ centro: [0, 0], r: 2.5 * k, inicio: 0, fin: 30 });
            etiquetas.push(
              { pos: [9 * k, -1.2 * k], texto: `${18 * k} cm` },
              { pos: [4 * k, 1 * k], texto: `30°` },
              { pos: [10.5 * k, 2.5 * k], texto: `h = ${5 * k}` },
            );
          } else if (id === 'geo_perim_trap_isosc_avz') {
            const pts = [
              [0, 0],
              [28 * k, 0],
              [19 * k, 12 * k],
              [9 * k, 12 * k],
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            lineas.push({
              p1: [9 * k, 0],
              p2: [9 * k, 12 * k],
              punteada: true,
            });
            angulos.push({ centro: [0, 0], r: 2 * k, inicio: 0, fin: 53 });
            etiquetas.push(
              { pos: [14 * k, 13.5 * k], texto: `${10 * k} cm` },
              { pos: [3.5 * k, 1.5 * k], texto: `53°` },
              { pos: [10.5 * k, 6 * k], texto: `h = ${12 * k}` },
            );
          } else if (id === 'geo_perim_paralelogramo_avz') {
            // 🔥 CORREGIDO: Base = 25k, Altura = 10k (Ángulo 45° -> desplazamiento horizontal de 10k)
            const pts: [number, number][] = [
              [0, 0],
              [25 * k, 0],
              [35 * k, 10 * k],
              [10 * k, 10 * k],
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);

            // La línea de altura cae exactamente en x = 10k
            lineas.push({
              p1: [10 * k, 0],
              p2: [10 * k, 10 * k],
              punteada: true,
            });
            angulos.push({ centro: [0, 0], r: 3 * k, inicio: 0, fin: 45 });

            etiquetas.push(
              { pos: [12.5 * k, -1.2 * k], texto: `${25 * k} cm` }, // Base centrada
              { pos: [4.5 * k, 1.5 * k], texto: `45°` },
              { pos: [12 * k, 5 * k], texto: `h = ${10 * k}` }, // Altura alineada
            );
          } else if (id === 'geo_perim_escudo_avz') {
            const tri = [
              [0, 0],
              [16 * k, 0],
              [8 * k, 15 * k],
            ];
            const rombo = [
              [8 * k, 2 * k],
              [12 * k, 5 * k],
              [8 * k, 8 * k],
              [4 * k, 5 * k],
            ];
            poligonosBase.push(tri);
            poligonosHueco.push(rombo);
            poligonosBorde.push(tri, rombo);
            etiquetas.push(
              { pos: [8 * k, -1.2 * k], texto: `${16 * k} cm` },
              { pos: [1 * k, 8 * k], texto: `${17 * k} cm` },
              { pos: [11.5 * k, 3.5 * k], texto: `${5 * k} cm` },
            );
          }

          // ================= EXPERTOS =================
          else if (id === 'geo_perim_ninja_exp') {
            const pts = [
              [4 * k, 4 * k],
              [7 * k, 0],
              [10 * k, 4 * k],
              [14 * k, 7 * k],
              [10 * k, 10 * k],
              [7 * k, 14 * k],
              [4 * k, 10 * k],
              [0, 7 * k],
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            lineas.push(
              { p1: [4 * k, 4 * k], p2: [10 * k, 4 * k], punteada: true },
              { p1: [10 * k, 4 * k], p2: [10 * k, 10 * k], punteada: true },
              { p1: [10 * k, 10 * k], p2: [4 * k, 10 * k], punteada: true },
              { p1: [4 * k, 10 * k], p2: [4 * k, 4 * k], punteada: true },
            );
            etiquetas.push({ pos: [2 * k, 2.5 * k], texto: `${5 * k} cm` });
          } else if (id === 'geo_perim_cometa_exp') {
            const pts = [
              [24 * k, 0],
              [48 * k, 18 * k],
              [24 * k, 25 * k],
              [0, 18 * k],
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            lineas.push(
              { p1: [24 * k, 0], p2: [24 * k, 25 * k], punteada: true },
              { p1: [0, 18 * k], p2: [48 * k, 18 * k], punteada: true },
            );
            etiquetas.push(
              { pos: [12 * k, 19.5 * k], texto: `${24 * k}` },
              { pos: [25.5 * k, 22 * k], texto: `${7 * k}` },
              { pos: [26 * k, 9 * k], texto: `${18 * k}` },
            );
          } else if (id === 'geo_perim_corona_tri_exp') {
            const outer = [
              [0, 0],
              [24 * k, 0],
              [12 * k, 20.7 * k],
            ];
            const inner = [
              [6 * k, 6.9 * k],
              [18 * k, 6.9 * k],
              [12 * k, 17.3 * k],
            ]; // Triángulo invertido
            poligonosBase.push(outer);
            poligonosHueco.push(inner);
            poligonosBorde.push(outer, inner);
            etiquetas.push(
              { pos: [12 * k, -1.5 * k], texto: `${24 * k} cm` },
              { pos: [12 * k, 5 * k], texto: `${12 * k} cm` },
            );
          } else if (id === 'geo_perim_hex_hueco_exp') {
            const R = 10 * k; // Radio y lado del hexágono regular
            const alt = R * 0.866; // R * sen(60)
            // Vértices Hexágono Regular (Centrado en O)
            const v0 = [R / 2, -alt],
              v1 = [R, 0],
              v2 = [R / 2, alt],
              v3 = [-R / 2, alt],
              v4 = [-R, 0],
              v5 = [-R / 2, -alt];

            // Recorte en la base inferior (entre v5 y v0)
            const hueco_b = 4 * k,
              hueco_h = 3 * k;
            const hx1 = -hueco_b / 2,
              hx2 = hueco_b / 2;

            const pts = [
              v1,
              v2,
              v3,
              v4,
              v5,
              [hx1, -alt],
              [hx1, -alt + hueco_h],
              [hx2, -alt + hueco_h],
              [hx2, -alt], // El recorte sube
              v0,
            ];
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            lineas.push({ p1: [hx1, -alt], p2: [hx2, -alt], punteada: true }); // Base fantasma

            etiquetas.push(
              { pos: [(R / 2 + R) / 2 + 1.5 * k, alt / 2], texto: `${R} cm` }, // Etiqueta Lado exterior
              { pos: [0, -alt + hueco_h + 1.5 * k], texto: `${hueco_b} cm` }, // Ancho del hueco
              {
                pos: [hx2 + 2 * k, -alt + hueco_h / 2],
                texto: `${hueco_h} cm`,
              }, // Alto del hueco
            );
          }

          return {
            type: 'geometry_mafs',
            theme: 'area_sombreada',
            poligonosBase,
            poligonosHueco,
            poligonosBorde,
            lineas,
            angulos,
            etiquetas,
          };
        }

        case 'perimetro_aislado': {
          const v = valores;
          const k = v.k || 1;
          const x = v.x || 3;
          const id = plantilla.id;

          let poligonosBase: any[] = [];
          let poligonosHueco: any[] = [];
          let poligonosBorde: any[] = [];
          let lineas: any[] = [];
          let etiquetas: any[] = [];

          const fExp = (target: number, coef: number) => {
            const cte = target - coef * x;
            return cte === 0
              ? `${coef}x`
              : cte < 0
                ? `${coef}x - ${Math.abs(cte)}`
                : `${coef}x + ${cte}`;
          };

          if (id === 'geo_perimetro_isosceles_basico') {
            const pts: [number, number][] = [
              [0, 0],
              [10 * k, 0],
              [5 * k, 12 * k],
            ]; // Altura pitagórica 12 para base 10 y lado 13
            poligonosBase.push(pts);
            poligonosBorde.push(pts);
            etiquetas.push(
              { pos: [5 * k, -1.2 * k], texto: `${10 * k} cm` },
              { pos: [1.5 * k, 6 * k], texto: fExp(13 * k, v.coef) },
            );
          } else if (id === 'geo_perimetro_casita_intermedio') {
            const rect: [number, number][] = [
              [0, 0],
              [10 * k, 0],
              [10 * k, 6 * k],
              [0, 6 * k],
            ];
            const techo: [number, number][] = [
              [0, 6 * k],
              [10 * k, 6 * k],
              [5 * k, 18 * k],
            ]; // Altura 12 desde la base del techo
            poligonosBase.push(rect, techo);
            poligonosBorde.push(rect, techo);
            lineas.push({
              p1: [0, 6 * k],
              p2: [10 * k, 6 * k],
              punteada: true,
            }); // Línea fantasma interior
            etiquetas.push(
              { pos: [5 * k, -1.2 * k], texto: `${10 * k} cm` },
              { pos: [-1.5 * k, 3 * k], texto: `${6 * k} cm` },
              { pos: [1.5 * k, 12 * k], texto: fExp(13 * k, v.coef) },
            );
          }

          return {
            type: 'geometry_mafs',
            theme: 'area_sombreada',
            poligonosBase,
            poligonosHueco,
            poligonosBorde,
            lineas,
            etiquetas,
          };
        }

        case 'thales': {
          const v = valores;
          const tipo = v.tipo_fig !== undefined ? v.tipo_fig : 0;

          // Formateador Seguro
          const fExp = (c: any, k: any) => {
            const coef = Number(c) || 0;
            const cte = Number(k) || 0;
            if (coef === 0 && cte === 0) return '0';
            if (coef === 0) return `${cte}`;
            const cStr = coef === 1 ? 'x' : coef === -1 ? '-x' : `${coef}x`;
            if (cte === 0) return cStr;
            return cte > 0 ? `${cStr} + ${cte}` : `${cStr} - ${Math.abs(cte)}`;
          };

          const txt_TL = fExp(v.c_TL, v.k_TL);
          const txt_BL = fExp(v.c_BL, v.k_BL);
          const txt_TR = fExp(v.c_TR, v.k_TR);
          const txt_BR = fExp(v.c_BR, v.k_BR);

          let paralelas: any[] = [];
          let transversales: any[] = [];
          let segmentos: any[] = [];

          if (tipo === 0) {
            // 🔹 DISEÑO 1: CLÁSICO (Escalado para no cortarse)
            paralelas = [
              {
                puntos: [
                  [-4, 3],
                  [4, 3],
                ],
              },
              {
                puntos: [
                  [-4, 0],
                  [4, 0],
                ],
              },
              {
                puntos: [
                  [-4, -3],
                  [4, -3],
                ],
              },
            ];
            transversales = [
              {
                puntos: [
                  [-1.5, 4],
                  [-3.5, -4],
                ],
              },
              {
                puntos: [
                  [1.5, 4],
                  [3.5, -4],
                ],
              },
            ];
            // Empujados en X para no pisar la línea
            segmentos = [
              {
                inicio: [-1.75, 3],
                fin: [-2.5, 0],
                etiqueta: txt_TL,
                etiquetaX: -3.5,
                etiquetaY: 1.5,
              },
              {
                inicio: [-2.5, 0],
                fin: [-3.25, -3],
                etiqueta: txt_BL,
                etiquetaX: -4.2,
                etiquetaY: -1.5,
              },
              {
                inicio: [1.75, 3],
                fin: [2.5, 0],
                etiqueta: txt_TR,
                etiquetaX: 3.5,
                etiquetaY: 1.5,
              },
              {
                inicio: [2.5, 0],
                fin: [3.25, -3],
                etiqueta: txt_BR,
                etiquetaX: 4.2,
                etiquetaY: -1.5,
              },
            ];
          } else if (tipo === 1) {
            // 🔹 DISEÑO 2: TRIÁNGULO (Escalado y centrado)
            paralelas = [
              {
                puntos: [
                  [-4, -2],
                  [4, -2],
                ],
              }, // Base inferior
              {
                puntos: [
                  [-2, 1],
                  [2, 1],
                ],
              }, // Corte medio
            ];
            transversales = [
              {
                puntos: [
                  [0, 4],
                  [-4, -2],
                ],
              }, // Lado Izq
              {
                puntos: [
                  [0, 4],
                  [4, -2],
                ],
              }, // Lado Der
            ];
            segmentos = [
              {
                inicio: [0, 4],
                fin: [-2, 1],
                etiqueta: txt_TL,
                etiquetaX: -2.2,
                etiquetaY: 2.5,
              },
              {
                inicio: [-2, 1],
                fin: [-4, -2],
                etiqueta: txt_BL,
                etiquetaX: -4.2,
                etiquetaY: -0.5,
              },
              {
                inicio: [0, 4],
                fin: [2, 1],
                etiqueta: txt_TR,
                etiquetaX: 2.2,
                etiquetaY: 2.5,
              },
              {
                inicio: [2, 1],
                fin: [4, -2],
                etiqueta: txt_BR,
                etiquetaX: 4.2,
                etiquetaY: -0.5,
              },
            ];
          } else if (tipo === 2) {
            // 🔹 DISEÑO 3: RELOJ DE ARENA (Con SWAP Visual para líneas rectas)
            paralelas = [
              {
                puntos: [
                  [-3, 3],
                  [3, 3],
                ],
              }, // Base Superior
              {
                puntos: [
                  [-3, -3],
                  [3, -3],
                ],
              }, // Base Inferior
            ];
            transversales = [
              {
                puntos: [
                  [-2, 3],
                  [2, -3],
                ],
              }, // Diagonal A (Izq a Der)
              {
                puntos: [
                  [2, 3],
                  [-2, -3],
                ],
              }, // Diagonal B (Der a Izq)
            ];

            // 🔥 SWAP VISUAL: txt_BR va a la izquierda y txt_BL a la derecha.
            // Esto alinea la matemática con las líneas colineales perfectas.
            segmentos = [
              {
                inicio: [-2, 3],
                fin: [0, 0],
                etiqueta: txt_TL,
                etiquetaX: -1.8,
                etiquetaY: 1.5,
              },
              {
                inicio: [0, 0],
                fin: [-2, -3],
                etiqueta: txt_BR,
                etiquetaX: -1.8,
                etiquetaY: -1.5,
              }, // Swap
              {
                inicio: [2, 3],
                fin: [0, 0],
                etiqueta: txt_TR,
                etiquetaX: 1.8,
                etiquetaY: 1.5,
              },
              {
                inicio: [0, 0],
                fin: [2, -3],
                etiqueta: txt_BL,
                etiquetaX: 1.8,
                etiquetaY: -1.5,
              }, // Swap
            ];
          }

          return {
            type: 'geometry_mafs',
            theme: 'thales',
            paralelas,
            transversales,
            segmentos,
          };
        }

        case 'perimetro_escalera': {
          const v = valores;
          const tipo = v.tipo_fig !== undefined ? v.tipo_fig : 0;
          const dif = plantilla.dificultad[0];

          let polPoints: [number, number][] = [];
          let segmentos: any[] = [];

          // Variables reales (Longitudes matemáticas perfectas)
          const r1 = Number(v.r1);
          const r2 = Number(v.r2);
          const r3 = Number(v.r3);
          const r4 = Number(v.r4);

          const fX = (c: any, k: any) => {
            const coef = Number(c) || 0;
            const cte = Number(k) || 0;
            if (coef === 0) return `${cte}`;
            const cx = coef === 1 ? 'x' : `${coef}x`;
            return cte === 0
              ? cx
              : cte > 0
                ? `${cx} + ${cte}`
                : `${cx} - ${Math.abs(cte)}`;
          };

          let t1 = `${r1}`,
            t2 = `${r2}`,
            t3 = `${r3}`,
            t4 = `${r4}`;
          if (dif === 'basico') {
            if (tipo === 0) t2 = 'x';
            if (tipo === 1) t1 = 'x';
            if (tipo === 2) t1 = 'x';
            if (tipo === 3) t3 = 'x';
          } else {
            t1 = fX(v.c1, v.k1);
            t2 = fX(v.c2, v.k2);
            t3 = fX(v.c3, v.k3);
            t4 = fX(v.c4, v.k4);
          }

          // Distancia para despegar el texto de la línea
          const PUSH = 1.0;

          if (tipo === 0) {
            // 🔹 FIGURA 0: ESCALERA
            // r1 = Techo (Horiz), r2 = Pared Int (Vert), r3 = Piso Int (Horiz), r4 = Pared Der (Vert)
            polPoints = [
              [0, r2 + r4],
              [r1, r2 + r4],
              [r1, r4],
              [r1 + r3, r4],
              [r1 + r3, 0],
              [0, 0],
            ];
            segmentos = [
              { etiqueta: t1, mx: r1 / 2, my: r2 + r4, nx: 0, ny: PUSH }, // Techo: empuja arriba
              { etiqueta: t2, mx: r1, my: r4 + r2 / 2, nx: -PUSH, ny: 0 }, // Pared Int: empuja izq (adentro)
              { etiqueta: t3, mx: r1 + r3 / 2, my: r4, nx: 0, ny: -PUSH }, // Piso Int: empuja abajo (adentro)
              { etiqueta: t4, mx: r1 + r3, my: r4 / 2, nx: PUSH, ny: 0 }, // Pared Der: empuja derecha
            ];
          } else if (tipo === 1) {
            // 🔹 FIGURA 1: EL PODIO
            // r1 = Altura de TODOS los muros verticales, r2 = Piso Izq, r3 = Techo Central, r4 = Piso Der
            polPoints = [
              [0, 0],
              [0, r1],
              [r2, r1],
              [r2, r1 * 2],
              [r2 + r3, r1 * 2],
              [r2 + r3, r1],
              [r2 + r3 + r4, r1],
              [r2 + r3 + r4, 0],
            ];
            segmentos = [
              { etiqueta: t1, mx: 0, my: r1 / 2, nx: -PUSH, ny: 0 }, // Pared Izq: empuja izq
              { etiqueta: t2, mx: r2 / 2, my: r1, nx: 0, ny: -PUSH }, // Piso Izq: empuja abajo (adentro)
              { etiqueta: t3, mx: r2 + r3 / 2, my: r1 * 2, nx: 0, ny: PUSH }, // Techo: empuja arriba
              { etiqueta: t4, mx: r2 + r3 + r4 / 2, my: r1, nx: 0, ny: -PUSH }, // Piso Der: empuja abajo (adentro)
            ];
          } else if (tipo === 2) {
            // 🔹 FIGURA 2: HABITACIÓN (Recorte Superior Derecho)
            // r1 = Piso Total (Horiz), r2 = Pared Izq (Vert), r3 = Techo Int (Horiz), r4 = Pared Int (Vert)
            polPoints = [
              [0, r2],
              [r1 - r3, r2],
              [r1 - r3, r2 - r4],
              [r1, r2 - r4],
              [r1, 0],
              [0, 0],
            ];
            segmentos = [
              { etiqueta: t1, mx: r1 / 2, my: 0, nx: 0, ny: -PUSH }, // Piso Total: empuja abajo
              { etiqueta: t2, mx: 0, my: r2 / 2, nx: -PUSH, ny: 0 }, // Pared Izq: empuja izq
              { etiqueta: t3, mx: r1 - r3 / 2, my: r2 - r4, nx: 0, ny: -PUSH }, // Techo Int: empuja abajo (adentro)
              { etiqueta: t4, mx: r1 - r3, my: r2 - r4 / 2, nx: -PUSH, ny: 0 }, // Pared Int: empuja izq (adentro)
            ];
          } else if (tipo === 3) {
            // 🔹 FIGURA 3: TETRIS
            const side = (r1 - r4) / 2;
            polPoints = [
              [0, r2],
              [side, r2],
              [side, r2 - r3],
              [side + r4, r2 - r3],
              [side + r4, r2],
              [r1, r2],
              [r1, 0],
              [0, 0],
            ];
            segmentos = [
              { etiqueta: t1, mx: r1 / 2, my: 0, nx: 0, ny: -PUSH },
              { etiqueta: t2, mx: 0, my: r2 / 2, nx: -PUSH, ny: 0 },
              { etiqueta: t3, mx: side, my: r2 - r3 / 2, nx: PUSH, ny: 0 }, // 🔥 CAMBIO: Ahora es nx: PUSH positivo (empuja hacia el hueco)
              {
                etiqueta: t4,
                mx: side + r4 / 2,
                my: r2 - r3,
                nx: 0,
                ny: -PUSH,
              },
            ];
          }

          return {
            type: 'geometry_mafs',
            theme: 'perimetro_escalera',
            polPoints,
            segmentos,
          };
        }

        // ========== ÁREA DE TRAPECIO ==========
        case 'area_trapecio': {
          const v = valores || {};
          const id = plantilla.id || '';

          const B_val = Number(v.B) || 12;
          const b_val = Number(v.b || v.bmenor) || 6;
          const h_val = Number(v.h) || 4;

          const fx = (a: any, b: any, fallback: number) => {
            const valA = Number(a) || 0;
            const valB = Number(b) || 0;
            if (valA === 0 && valB === 0) return `${fallback}`;
            if (valA === 0) return `${valB}`;
            let pre = valA === 1 ? 'x' : valA === -1 ? '-x' : `${valA}x`;
            if (valB === 0) return pre;
            return valB > 0 ? `${pre} + ${valB}` : `${pre} - ${Math.abs(valB)}`;
          };

          let BStr = '',
            bStr = '',
            hStr = '';

          if (id.includes('basico')) {
            BStr = `${B_val}`;
            bStr = `${b_val}`;
            hStr = `${h_val}`;
          } else if (id.includes('intermedio')) {
            BStr = fx(v.a, 0, B_val);
            bStr = `${b_val}`;
            hStr = `${h_val}`;
          } else if (id.includes('avanzado')) {
            BStr = fx(v.a, v.b, B_val);
            bStr = fx(v.c, v.d, b_val);
            hStr = `${h_val}`;
          } else {
            BStr = fx(v.a, v.b, B_val);
            bStr = fx(v.c, v.d, b_val);
            hStr = fx(v.e, v.f, h_val);
          }

          // 🔥 NORMALIZACIÓN VISUAL (Anti-Achatado)
          // Forzamos que la base mayor ocupe 10 unidades en pantalla siempre
          const B_vis = 10;
          const b_vis = B_vis * (b_val / B_val);
          let h_vis = B_vis * (h_val / B_val);

          // Clamping: Evita que sea una línea plana o una torre rascacielos
          if (h_vis < 4.0) h_vis = 4.0;
          if (h_vis > 7.0) h_vis = 7.0;

          // Coordenadas Centradas
          const puntos: [number, number][] = [
            [-B_vis / 2, -h_vis / 2], // Inferior Izquierdo
            [B_vis / 2, -h_vis / 2], // Inferior Derecho
            [b_vis / 2, h_vis / 2], // Superior Derecho
            [-b_vis / 2, h_vis / 2], // Superior Izquierdo
          ];

          const lineasExtra: any[] = [];

          // La línea de la Altura
          lineasExtra.push({
            puntos: [
              [b_vis / 2, h_vis / 2],
              [b_vis / 2, -h_vis / 2],
            ],
          });

          // Cuadradito de 90 grados en la base de la altura
          lineasExtra.push({
            puntos: [
              [b_vis / 2 - 0.4, -h_vis / 2],
              [b_vis / 2 - 0.4, -h_vis / 2 + 0.4],
            ],
          });
          lineasExtra.push({
            puntos: [
              [b_vis / 2 - 0.4, -h_vis / 2 + 0.4],
              [b_vis / 2, -h_vis / 2 + 0.4],
            ],
          });

          // Etiquetas con posiciones amplias para que no choquen
          const etiquetasLados = [
            { pos: [0, -h_vis / 2 - 0.8], texto: BStr }, // Base mayor (Abajo)
            { pos: [0, h_vis / 2 + 0.8], texto: bStr }, // Base menor (Arriba)
            { pos: [b_vis / 2 - 1.2, 0], texto: hStr }, // Altura (Izquierda de la línea)
          ];

          return {
            type: 'geometry_mafs',
            theme: 'triangulos', // 🔥 ENRUTAMOS AL RENDERIZADOR UNIVERSAL
            puntos,
            esArea: false, // Fondo celeste
            etiquetasLados,
            lineasExtra,
            arcos: [], // Previene bugs
          };
        }

        // ========== ÁREA DE PARALELOGRAMO (ESTILO OLIMPIADA) ==========
        case 'area_paralelogramo': {
          const v = valores || {};
          const id = plantilla.id || '';
          const esExperto = id.includes('experto');

          const B_real = Number(v.B) || 15;
          const L_real = Number(v.L) || 10;
          const ang_real = Number(v.angulo) || 53;

          const fx = (a: any, b: any, fallback: number) => {
            const valA = Number(a) || 0;
            const valB = Number(b) || 0;
            if (valA === 0 && valB === 0) return `${fallback}`;
            if (valA === 0) return `${valB}`;
            let pre = valA === 1 ? 'x' : valA === -1 ? '-x' : `${valA}x`;
            if (valB === 0) return pre;
            return valB > 0 ? `${pre} + ${valB}` : `${pre} - ${Math.abs(valB)}`;
          };

          let txtB = '',
            txtL = '';
          if (id.includes('basico')) {
            txtB = `${B_real}`;
            txtL = `${L_real}`;
          } else if (id.includes('intermedio')) {
            txtB = fx(v.a, v.b, B_real);
            txtL = `${L_real}`;
          } else {
            txtB = fx(v.a, v.b, B_real);
            txtL = fx(v.c, v.d, L_real);
          }

          // Matemática visual
          const B_vis = 10;
          const h_real = L_real * Math.sin((ang_real * Math.PI) / 180);
          let h_vis = B_vis * (h_real / B_real);

          if (h_vis < 4.0) h_vis = 4.0;
          if (h_vis > 7.0) h_vis = 7.0;

          const offset_x = h_vis / Math.tan((ang_real * Math.PI) / 180);
          const shiftX = -(B_vis + offset_x) / 2;
          const shiftY = -h_vis / 2;

          // Vértices A (inf-izq), B (inf-der), C (sup-der), D (sup-izq)
          const p0: [number, number] = [shiftX, shiftY];
          const p1: [number, number] = [shiftX + B_vis, shiftY];
          const p2: [number, number] = [
            shiftX + B_vis + offset_x,
            shiftY + h_vis,
          ];
          const p3: [number, number] = [shiftX + offset_x, shiftY + h_vis];
          const puntos = [p0, p1, p2, p3];

          // Proyección de la altura
          const pBaseH: [number, number] = [shiftX + offset_x, shiftY];
          const lineasExtra = [
            { puntos: [p3, pBaseH] },
            {
              puntos: [
                [pBaseH[0] - 0.4, pBaseH[1]],
                [pBaseH[0] - 0.4, pBaseH[1] + 0.4],
              ],
            },
            {
              puntos: [
                [pBaseH[0] - 0.4, pBaseH[1] + 0.4],
                [pBaseH[0], pBaseH[1] + 0.4],
              ],
            },
          ];

          const arcos = [
            {
              centro: p0,
              inicio: 0,
              fin: ang_real,
              etiqueta: `${ang_real}°`,
              colorIdx: 0,
              labelVertice: '',
            },
          ];

          // 🔥 ETIQUETAS ANTI-AMBIGÜEDAD (A, B, C, D y "AB = ...")
          const etiquetasLados = [
            // Vértices
            { pos: [shiftX - 0.4, shiftY - 0.4], texto: 'A' },
            { pos: [shiftX + B_vis + 0.4, shiftY - 0.4], texto: 'B' },
            {
              pos: [shiftX + B_vis + offset_x + 0.4, shiftY + h_vis + 0.4],
              texto: 'C',
            },
            {
              pos: [shiftX + offset_x - 0.4, shiftY + h_vis + 0.4],
              texto: 'D',
            },
            // Lados (Valores crudos empujados hacia afuera)
            { pos: [shiftX + B_vis / 2, shiftY - 1.2], texto: txtB },
            // Acercamos un poco 'txtL' a la línea ya que le quitamos el prefijo "AD ="
            {
              pos: [shiftX + offset_x / 2 - 1.5, shiftY + h_vis / 2 + 0.3],
              texto: txtL,
            },
          ];

          return {
            type: 'geometry_mafs',
            theme: 'triangulos',
            puntos,
            esArea: true, // 🔥 AHORA TODOS LOS NIVELES TIENEN FONDO CELESTE
            etiquetasLados,
            lineasExtra,
            arcos,
          };
        }

        // ========== VOLUMEN DE PRISMA RECTANGULAR ==========
        case 'volumen_prisma': {
          const { a, b, c, d, e, f } = valores;

          const largo_val = valores.largo || valores.l;
          const ancho_val = valores.ancho || valores.a; // Profundidad
          const alto_val = valores.alto || valores.h;

          // Helper algebraico ("3x + 5")
          const fx = (coef: number, cte?: number, isNeg?: boolean) => {
            let eq = coef === 1 ? 'x' : `${coef}x`;
            if (cte) eq += isNeg ? ` - ${cte}` : ` + ${cte}`;
            return eq;
          };

          let largoStr = '',
            anchoStr = '',
            altoStr = '';

          // Mapeo dinámico del álgebra según el nivel
          if (plantilla.dificultad.includes('basico')) {
            largoStr = `${largo_val}`;
            anchoStr = `${ancho_val}`;
            altoStr = `${alto_val}`;
          } else if (plantilla.dificultad.includes('intermedio')) {
            largoStr = fx(a);
            anchoStr = `${b}`;
            altoStr = `${c}`;
          } else if (plantilla.dificultad.includes('avanzado')) {
            largoStr = fx(a, b, false);
            anchoStr = fx(c, d, false);
            altoStr = `${e}`;
          } else {
            // Experto
            largoStr = fx(a, b, false);
            anchoStr = fx(c, d, false);
            altoStr = fx(e, f, false);
          }

          // 🔥 MATEMÁTICA ISOMÉTRICA
          // Calculamos el desplazamiento visual de la profundidad (Ángulo de 45 grados aprox)
          const despX = ancho_val * 0.6;
          const despY = ancho_val * 0.5;

          // Vértices de la cara frontal (Z=0)
          const v0 = [0, 0] as [number, number];
          const v1 = [largo_val, 0] as [number, number];
          const v2 = [largo_val, alto_val] as [number, number];
          const v3 = [0, alto_val] as [number, number];

          // Vértices de la cara posterior (Z=Profundidad)
          const v4 = [despX, despY] as [number, number]; // Oculto (Atrás izquierda abajo)
          const v5 = [largo_val + despX, despY] as [number, number];
          const v6 = [largo_val + despX, alto_val + despY] as [number, number];
          const v7 = [despX, alto_val + despY] as [number, number];

          // 🔥 SEPARACIÓN DE ARISTAS (El secreto del 3D realista)
          const aristasSolidas = [
            { inicio: v0, fin: v1 },
            { inicio: v1, fin: v2 },
            { inicio: v2, fin: v3 },
            { inicio: v3, fin: v0 }, // Frontal
            { inicio: v1, fin: v5 },
            { inicio: v2, fin: v6 },
            { inicio: v3, fin: v7 }, // Conectores Visibles
            { inicio: v5, fin: v6 },
            { inicio: v6, fin: v7 }, // Posterior Visibles
          ];

          const aristasOcultas = [
            { inicio: v0, fin: v4 }, // Conector inferior izquierdo
            { inicio: v4, fin: v5 }, // Posterior inferior
            { inicio: v4, fin: v7 }, // Posterior izquierdo
          ];

          // Vectores de empuje para textos algebraicos
          const etiquetas = [
            // Largo: Borde frontal inferior (Empuje hacia abajo)
            { texto: largoStr, mx: largo_val / 2, my: 0, nx: 0, ny: -1 },
            // Alto: Borde frontal izquierdo (Empuje hacia la izquierda)
            { texto: altoStr, mx: 0, my: alto_val / 2, nx: -1, ny: 0 },
            // Ancho (Profundidad): Borde conector derecho inferior (Empuje diagonal abajo-derecha)
            {
              texto: anchoStr,
              mx: largo_val + despX / 2,
              my: despY / 2,
              nx: 1,
              ny: -1,
            },
          ];

          // Mandamos todos los puntos para calcular el Viewbox en el frontend
          const todosLosPuntos = [v0, v1, v2, v3, v4, v5, v6, v7];

          return {
            type: 'geometry_mafs',
            theme: 'prisma_rectangular',
            todosLosPuntos,
            aristasSolidas,
            aristasOcultas,
            etiquetas,
            volumen: valores.volumen,
          };
        }

        case 'volumen_prisma_triangular': {
          const { a, b, c, d, e, f } = valores;

          const base_val = valores.base_tri;
          const alt_tri_val = valores.altura_tri;
          const prof_val = valores.profundidad;

          const fx = (coef: number, cte?: number, isNeg?: boolean) => {
            let eq = coef === 1 ? 'x' : `${coef}x`;
            if (cte) eq += isNeg ? ` - ${cte}` : ` + ${cte}`;
            return eq;
          };

          let baseStr = '',
            altStr = '',
            profStr = '';

          if (plantilla.dificultad.includes('basico')) {
            baseStr = `${base_val}`;
            altStr = `${alt_tri_val}`;
            profStr = `${prof_val}`;
          } else if (plantilla.dificultad.includes('intermedio')) {
            baseStr = fx(a);
            altStr = `${alt_tri_val}`;
            profStr = `${prof_val}`;
          } else if (plantilla.dificultad.includes('avanzado')) {
            baseStr = fx(a, b, false);
            altStr = fx(c, d, false);
            profStr = `${prof_val}`;
          } else {
            baseStr = fx(a, b, false);
            altStr = fx(c, d, false);
            profStr = fx(e, f, false);
          }

          // 🔥 CÁMARA ISOMÉTRICA MEJORADA (Más empinada y profunda)
          // Ángulo de 45° para que la figura se levante visualmente.
          const anguloRad = 45 * (Math.PI / 180);
          // Usamos el valor REAL de la profundidad. Si es 15, se verá muy profundo.
          const despX = prof_val * Math.cos(anguloRad);
          const despY = prof_val * Math.sin(anguloRad);

          // --- VÉRTICES ---
          // Cara Frontal
          const v0 = [-base_val / 2, 0] as [number, number];
          const v1 = [base_val / 2, 0] as [number, number];
          const v2 = [0, alt_tri_val] as [number, number];

          // Cara Posterior (Proyectada)
          const v3 = [v0[0] + despX, v0[1] + despY] as [number, number]; // OCULTO
          const v4 = [v1[0] + despX, v1[1] + despY] as [number, number];
          const v5 = [v2[0] + despX, v2[1] + despY] as [number, number];

          // --- ARISTAS VISIBLES ---
          const aristasSolidas = [
            { inicio: v0, fin: v1 }, // Base frontal
            { inicio: v1, fin: v2 }, // Lado derecho frontal
            { inicio: v2, fin: v0 }, // Lado izquierdo frontal
            { inicio: v1, fin: v4 }, // Conector inferior derecho
            { inicio: v2, fin: v5 }, // Conector superior (techo)
            { inicio: v4, fin: v5 }, // Base posterior visible
          ];

          // --- ARISTAS OCULTAS (Clasificación rigurosa) ---
          const aristasOcultas = [
            { inicio: v0, fin: v3 }, // Conector inferior izquierdo (profundidad)
            { inicio: v3, fin: v4 }, // Base posterior oculta
            { inicio: v3, fin: v5 }, // Lado izquierdo posterior oculto
          ];

          // Línea de altura frontal
          const lineaAlturaFrontal = {
            inicio: v2,
            fin: [0, 0] as [number, number],
          };

          // Vectores de Empuje (Ajustados para la nueva perspectiva de 45°)
          const etiquetas = [
            { texto: baseStr, mx: 0, my: 0, nx: 0, ny: -1.3 }, // Base frontal (Más abajo)
            { texto: altStr, mx: 0, my: alt_tri_val / 2, nx: -0.8, ny: 0 }, // Altura
            // Profundidad: En la arista conectora inferior derecha
            {
              texto: profStr,
              mx: (v1[0] + v4[0]) / 2,
              my: (v1[1] + v4[1]) / 2,
              nx: 1,
              ny: -0.5,
            },
          ];

          const todosLosPuntos = [v0, v1, v2, v3, v4, v5];

          return {
            type: 'geometry_mafs',
            theme: 'prisma_triangular',
            todosLosPuntos,
            aristasSolidas,
            aristasOcultas,
            lineaAlturaFrontal,
            etiquetas,
            volumen: valores.volumen,
          };
        }

        case 'volumen_piramide': {
          const { a, b, c, d, x } = valores;
          const lado_val = valores.lado;
          const h_val = valores.h;

          const fx = (coef: number, cte?: number, isNeg?: boolean) => {
            let eq = coef === 1 ? 'x' : `${coef}x`;
            if (cte) eq += isNeg ? ` - ${cte}` : ` + ${cte}`;
            return eq;
          };

          let ladoStr = '',
            hStr = '';

          if (plantilla.dificultad.includes('basico')) {
            ladoStr = `${lado_val}`;
            hStr = `${h_val}`;
          } else if (plantilla.dificultad.includes('intermedio')) {
            ladoStr = fx(a);
            hStr = `${h_val}`;
          } else if (plantilla.dificultad.includes('avanzado')) {
            ladoStr = fx(a, b, false);
            hStr = `${h_val}`;
          } else {
            // Experto
            ladoStr = fx(a, b, false);
            hStr = fx(c, d, false);
          }

          // 🔥 MATEMÁTICA ISOMÉTRICA DE LA PIRÁMIDE
          const anguloRad = 45 * (Math.PI / 180);
          const profVisual = lado_val * 0.5; // Profundidad de la base
          const despX = profVisual * Math.cos(anguloRad);
          const despY = profVisual * Math.sin(anguloRad);

          // Vértices de la Base (Paralelogramo en el piso)
          const p0 = [-lado_val / 2, 0] as [number, number]; // Inferior Izquierdo (Frontal)
          const p1 = [lado_val / 2, 0] as [number, number]; // Inferior Derecho (Frontal)
          const p2 = [lado_val / 2 + despX, despY] as [number, number]; // Inferior Derecho (Posterior)
          const p3 = [-lado_val / 2 + despX, despY] as [number, number]; // Inferior Izquierdo (Posterior) - OCULTO

          // Ápice (Punta superior centrada sobre la base)
          const apiceX = despX / 2;
          const apiceY = h_val + despY / 2;
          const vApice = [apiceX, apiceY] as [number, number];

          const aristasSolidas = [
            { inicio: p0, fin: p1 },
            { inicio: p1, fin: p2 }, // Base visible
            { inicio: p0, fin: vApice },
            { inicio: p1, fin: vApice },
            { inicio: p2, fin: vApice }, // Caras visibles
          ];

          const aristasOcultas = [
            { inicio: p0, fin: p3 },
            { inicio: p3, fin: p2 }, // Base posterior oculta
            { inicio: p3, fin: vApice }, // Arista posterior oculta
          ];

          // Línea de altura (desde el centro de la base al ápice)
          const lineaAltura = {
            inicio: [apiceX, despY / 2] as [number, number],
            fin: vApice,
          };

          const etiquetas = [
            { texto: ladoStr, mx: 0, my: 0, nx: 0, ny: -1.2 }, // Lado base
            { texto: hStr, mx: apiceX, my: apiceY / 2, nx: -1, ny: 0 }, // Altura pirámide
          ];

          const todosLosPuntos = [p0, p1, p2, p3, vApice];

          return {
            type: 'geometry_mafs',
            theme: 'piramide_cuadrangular',
            todosLosPuntos,
            aristasSolidas,
            aristasOcultas,
            lineaAltura,
            etiquetas,
            volumen: valores.volumen,
          };
        }

        // ========== ÁNGULOS EN CIRCUNFERENCIA ==========
        case 'angulos_circunferencia': {
          const v = valores;
          const tipo = v.tipo_fig !== undefined ? v.tipo_fig : 0;
          const dif = plantilla.dificultad[0];

          const radio = 5;
          const puntosPivote: [number, number][] = [];
          const lineasAzules: any[] = [];
          const lineasAzulesPunteadas: any[] = [];
          const arcosVerdes: [number, number][][] = [];
          const etiquetas: any[] = [];

          // 🔥 HELPER 1: Coordenadas del círculo
          const getP = (
            grados: number,
            isLabel: boolean = false,
          ): [number, number] => {
            const rad = grados * (Math.PI / 180);
            const r = isLabel ? radio + 0.9 : radio;
            return [r * Math.cos(rad), r * Math.sin(rad)];
          };

          // 🔥 HELPER 2: Empuje semántico de textos
          const getInnerP = (
            grados: number,
            offset: number,
          ): [number, number] => {
            const rad = grados * (Math.PI / 180);
            return [
              (radio - offset) * Math.cos(rad),
              (radio - offset) * Math.sin(rad),
            ];
          };
          const getOuterP = (
            grados: number,
            offset: number,
          ): [number, number] => {
            const rad = grados * (Math.PI / 180);
            return [
              (radio + offset) * Math.cos(rad),
              (radio + offset) * Math.sin(rad),
            ];
          };

          // 🔥 HELPER 3: EL CREADOR DE ARCOS DE ÁNGULOS (La magia visual)
          const getArcBetweenPoints = (
            v: [number, number],
            p1: [number, number],
            p2: [number, number],
            r: number = 0.8,
          ): [number, number][] => {
            let a1 = Math.atan2(p1[1] - v[1], p1[0] - v[0]) * (180 / Math.PI);
            let a2 = Math.atan2(p2[1] - v[1], p2[0] - v[0]) * (180 / Math.PI);
            if (a1 < 0) a1 += 360;
            if (a2 < 0) a2 += 360;

            // Forzar el camino más corto (el ángulo interno, no el reflejo)
            let diff = a2 - a1;
            if (diff > 180) a1 += 360;
            else if (diff < -180) a2 += 360;

            const start = Math.min(a1, a2);
            const end = Math.max(a1, a2);

            const points: [number, number][] = [];
            const steps = 15; // Suavidad del arco
            for (let i = 0; i <= steps; i++) {
              const ang = start + (end - start) * (i / steps);
              const rad = ang * (Math.PI / 180);
              points.push([v[0] + r * Math.cos(rad), v[1] + r * Math.sin(rad)]);
            }
            return points;
          };

          // 🔥 HELPER 4: Extractor Algebraico Protegido
          const getAlg = (varNames: string[]) => {
            const varName = varNames.find(
              (name) =>
                v[name] !== undefined ||
                plantilla.relaciones?.some((r: string) =>
                  r.startsWith(name + ' ='),
                ),
            );
            if (!varName) return 'x';

            if (dif === 'basico') {
              if (plantilla.variables && !plantilla.variables[varName])
                return 'x';
              return v[varName] !== undefined ? `${v[varName]}°` : 'x';
            }

            const rel = plantilla.relaciones?.find((r: string) =>
              r.startsWith(varName + ' ='),
            );
            if (!rel) return 'x';

            let expr = rel.split('=')[1].trim();

            const tokens = expr.match(/[a-zA-Z_]\w*/g) || [];
            tokens.forEach((token) => {
              if (token === 'x') return;
              if (v[token] !== undefined) {
                const regex = new RegExp(`\\b${token}\\b`, 'g');
                expr = expr.replace(regex, v[token]);
              }
            });

            expr = expr
              .replace(/x\s*\*\s*x/g, 'x²')
              .replace(/\s*\*\s*/g, '')
              .replace(/\+\s*-/g, '- ')
              .replace(/\s+/g, ' ')
              .trim();

            if (expr.includes('undefined')) return 'x';
            return expr + '°';
          };

          // --- DIBUJADOR DE LAS 5 FIGURAS ---

          const O = [0, 0] as [number, number];
          etiquetas.push({ texto: 'O', pos: [0, -0.7], esPunto: true });
          puntosPivote.push(O);

          if (tipo === 0) {
            // 🔹 FIG 0: CENTRAL E INSCRITO
            const C = getP(90);
            const A = getP(230);
            const B = getP(310);
            puntosPivote.push(A, B, C);
            lineasAzules.push({ inicio: O, fin: A }, { inicio: O, fin: B });
            lineasAzulesPunteadas.push(
              { inicio: C, fin: A },
              { inicio: C, fin: B },
            );

            // 🔥 INYECCIÓN DE ARCOS VERDES
            arcosVerdes.push(getArcBetweenPoints(O, A, B, 0.8)); // Arco Central
            arcosVerdes.push(getArcBetweenPoints(C, A, B, 1.2)); // Arco Inscrito

            etiquetas.push(
              { texto: getAlg(['central']), pos: [0, -1.2], esPunto: false },
              {
                texto: getAlg(['inscrito']),
                pos: getInnerP(90, 1.7),
                esPunto: false,
              },
              { texto: 'C', pos: getP(90, true), esPunto: true },
              { texto: 'A', pos: getP(230, true), esPunto: true },
              { texto: 'B', pos: getP(310, true), esPunto: true },
            );
          } else if (tipo === 1) {
            // 🔹 FIG 1: ÁNGULO INTERIOR (Cruz)
            const A = getP(210);
            const B = getP(330);
            const C = getP(30);
            const D = getP(150);
            puntosPivote.push(A, B, C, D);
            lineasAzules.push({ inicio: A, fin: C }, { inicio: B, fin: D });

            // 🔥 INYECCIÓN DE ARCOS VERDES (Ángulo superior en el cruce)
            arcosVerdes.push(getArcBetweenPoints(O, C, D, 0.8));

            etiquetas.push(
              {
                texto: getAlg(['ang', 'angulo']),
                pos: [0, 1.2],
                esPunto: false,
              },
              {
                texto: getAlg(['arco1', 'arcoAB']),
                pos: getOuterP(270, 0.8),
                esPunto: false,
              },
              {
                texto: getAlg(['arco2', 'arcoCD']),
                pos: getOuterP(90, 0.8),
                esPunto: false,
              },
              { texto: 'A', pos: getP(210, true), esPunto: true },
              { texto: 'B', pos: getP(330, true), esPunto: true },
              { texto: 'C', pos: getP(30, true), esPunto: true },
              { texto: 'D', pos: getP(150, true), esPunto: true },
            );
          } else if (tipo === 2) {
            // 🔹 FIG 2: ÁNGULO EXTERIOR (Secantes)
            const P = [-11, 0] as [number, number];
            const A = getP(155);
            const C = getP(205);
            const B = getP(35);
            const D = getP(325);
            puntosPivote.push(P, A, B, C, D);
            lineasAzules.push({ inicio: P, fin: B }, { inicio: P, fin: D });

            // 🔥 INYECCIÓN DE ARCOS VERDES (Ángulo en el vértice P exterior)
            arcosVerdes.push(getArcBetweenPoints(P, B, D, 1.5));

            etiquetas.push(
              {
                texto: getAlg(['ang', 'angulo']),
                pos: [-8.8, 0],
                esPunto: false,
              },
              {
                texto: getAlg(['arcoM']),
                pos: getOuterP(0, 0.8),
                esPunto: false,
              },
              {
                texto: getAlg(['arcom']),
                pos: getOuterP(180, 0.8),
                esPunto: false,
              },
              { texto: 'P', pos: [-11.8, 0], esPunto: true },
              { texto: 'A', pos: getP(155, true), esPunto: true },
              { texto: 'C', pos: getP(205, true), esPunto: true },
              { texto: 'B', pos: getP(35, true), esPunto: true },
              { texto: 'D', pos: getP(325, true), esPunto: true },
            );
          } else if (tipo === 3) {
            // 🔹 FIG 3: ÁNGULO EXTERIOR (Tangentes)
            const distP = 11;
            const P = [-distP, 0] as [number, number];
            const angTangency = Math.acos(radio / distP) * (180 / Math.PI);
            const A = getP(180 - angTangency);
            const B = getP(180 + angTangency);

            puntosPivote.push(P, A, B);
            lineasAzules.push({ inicio: P, fin: A }, { inicio: P, fin: B });
            lineasAzulesPunteadas.push(
              { inicio: O, fin: A },
              { inicio: O, fin: B },
            );

            // 🔥 INYECCIÓN DE ARCOS VERDES (Ángulo en el vértice P exterior)
            arcosVerdes.push(getArcBetweenPoints(P, A, B, 1.5));

            etiquetas.push(
              {
                texto: getAlg(['ang', 'angulo', 'anguloP']),
                pos: [-8.8, 0],
                esPunto: false,
              },
              {
                texto: getAlg(['arco', 'arcoMenor']),
                pos: getOuterP(180, 0.8),
                esPunto: false,
              },
              { texto: 'P', pos: [-distP - 0.8, 0], esPunto: true },
              { texto: 'A', pos: getP(180 - angTangency, true), esPunto: true },
              { texto: 'B', pos: getP(180 + angTangency, true), esPunto: true },
            );
          } else if (tipo === 4) {
            // 🔹 FIG 4: CUADRILÁTERO INSCRITO
            const A = getP(230);
            const B = getP(310);
            const C = getP(50);
            const D = getP(130);
            puntosPivote.push(A, B, C, D);
            lineasAzules.push(
              { inicio: A, fin: B },
              { inicio: B, fin: C },
              { inicio: C, fin: D },
              { inicio: D, fin: A },
            );

            // 🔥 INYECCIÓN DE ARCOS VERDES (En las esquinas A y C)
            arcosVerdes.push(getArcBetweenPoints(A, D, B, 1.0));
            arcosVerdes.push(getArcBetweenPoints(C, B, D, 1.0));

            etiquetas.push(
              {
                texto: getAlg(['ang1', 'angulo']),
                pos: getInnerP(230, 1.8),
                esPunto: false,
              },
              {
                texto: getAlg(['ang2', 'opuesto']),
                pos: getInnerP(50, 1.8),
                esPunto: false,
              },
              { texto: 'A', pos: getP(230, true), esPunto: true },
              { texto: 'B', pos: getP(310, true), esPunto: true },
              { texto: 'C', pos: getP(50, true), esPunto: true },
              { texto: 'D', pos: getP(130, true), esPunto: true },
            );
          }

          return {
            type: 'geometry_mafs',
            theme: 'angulos_circunferencia',
            radio,
            puntosPivote,
            lineasAzules,
            lineasAzulesPunteadas,
            arcosVerdes,
            etiquetas,
          };
        }

        case 'segmentos_circunferencia': {
          const R = 5;
          let lineasAzules: any[] = [];
          let etiquetas: any[] = [];
          let puntosPivote: [number, number][] = [[0, 0]];

          const fx = (coef: number, cte?: number, isNeg?: boolean) => {
            let eq = coef === 1 ? 'x' : `${coef}x`;
            if (cte) eq += isNeg ? ` - ${cte}` : ` + ${cte}`;
            return eq;
          };

          if (
            plantilla.dificultad.includes('basico') ||
            plantilla.dificultad.includes('intermedio')
          ) {
            // 🔥 TEOREMA DE CUERDAS: Una "X" perfecta cruzando cerca del centro
            const p1: [number, number] = [-3, 4];
            const p2: [number, number] = [4, -3];
            const p3: [number, number] = [-4, -3];
            const p4: [number, number] = [3, 4];

            lineasAzules = [
              { inicio: p1, fin: p2 },
              { inicio: p3, fin: p4 },
            ];

            let val1, val2, val3, val4;
            if (plantilla.dificultad.includes('basico')) {
              val1 = `${valores.a}`;
              val2 = `${valores.b}`;
              val3 = `${valores.c}`;
              val4 = `x`;
            } else {
              val1 = `${valores.a}`;
              val2 = fx(valores.b);
              val3 = `${valores.c}`;
              val4 = `${valores.d}`;
            }

            etiquetas = [
              { texto: val1, pos: [-1.5, 2.8], esPunto: false },
              { texto: val2, pos: [2.0, -1.0], esPunto: false },
              { texto: val3, pos: [-2.0, -1.0], esPunto: false },
              { texto: val4, pos: [1.5, 2.8], esPunto: false },
            ];
            puntosPivote.push(p1, p2, p3, p4);
          } else if (plantilla.dificultad.includes('avanzado')) {
            // 🔥 TEOREMA DE SECANTES
            const P: [number, number] = [0, -8];
            const A: [number, number] = [-2.4, -4.4];
            const B: [number, number] = [-4.6, 1.95];
            const C: [number, number] = [2.4, -4.4];
            const D: [number, number] = [4.6, 1.95];

            // Extendemos la línea visualmente para que se vean como auténticas secantes
            const extB: [number, number] = [
              -4.6 - 2.2 * 0.15,
              1.95 + 6.35 * 0.15,
            ];
            const extD: [number, number] = [
              4.6 + 2.2 * 0.15,
              1.95 + 6.35 * 0.15,
            ];

            lineasAzules = [
              { inicio: P, fin: extB },
              { inicio: P, fin: extD },
            ];

            etiquetas = [
              { texto: `${valores.a}`, pos: [-1.8, -6.5], esPunto: false }, // PA
              { texto: `${valores.b}`, pos: [-4.2, -1.0], esPunto: false }, // AB
              { texto: `${valores.c}`, pos: [1.8, -6.5], esPunto: false }, // PC
              { texto: `x`, pos: [4.2, -1.0], esPunto: false }, // CD
              { texto: 'P', pos: [0, -8.8], esPunto: true },
              { texto: 'A', pos: [-1.3, -4.4], esPunto: true },
              { texto: 'B', pos: [-5.1, 1.95], esPunto: true },
              { texto: 'C', pos: [1.3, -4.4], esPunto: true },
              { texto: 'D', pos: [5.1, 1.95], esPunto: true },
            ];
            puntosPivote.push(P, B, D);
          } else {
            // 🔥 TEOREMA DE LA TANGENTE Y LA SECANTE
            const P: [number, number] = [0, -8];
            const A: [number, number] = [-2.4, -4.4];
            const B: [number, number] = [-4.6, 1.95];

            // Calculamos el punto T exacto usando arccos(R/distancia)
            const angT = Math.acos(R / 8);
            const T: [number, number] = [
              R * Math.sin(angT),
              -R * Math.cos(angT),
            ]; // [3.905, -3.125]

            const extB: [number, number] = [
              -4.6 - 2.2 * 0.15,
              1.95 + 6.35 * 0.15,
            ];
            const extT: [number, number] = [
              T[0] + T[0] * 0.4,
              T[1] + (T[1] + 8) * 0.4,
            ]; // Extensión perfecta

            lineasAzules = [
              { inicio: P, fin: extB },
              { inicio: P, fin: extT },
            ];

            etiquetas = [
              { texto: `${valores.t}`, pos: [2.5, -6.5], esPunto: false },
              { texto: `${valores.a}`, pos: [-1.8, -6.5], esPunto: false },
              { texto: `x`, pos: [-4.2, -1.0], esPunto: false },
              { texto: 'P', pos: [0, -8.8], esPunto: true },
              { texto: 'T', pos: [T[0] + 0.5, T[1] + 0.5], esPunto: true },
              { texto: 'A', pos: [-1.3, -4.4], esPunto: true },
              { texto: 'B', pos: [-5.1, 1.95], esPunto: true },
            ];
            puntosPivote.push(P, B, T, extT, extB);
          }

          return {
            type: 'geometry_mafs',
            theme: 'segmentos_circunferencia',
            radio: R,
            puntosPivote,
            lineasAzules,
            etiquetas,
          };
        }

        case 'propiedades_circunferencia': {
          const v = valores;
          const tipo = v.tipo_fig !== undefined ? v.tipo_fig : 0;
          const dif = plantilla.dificultad[0];

          const radio = 5;
          const puntosPivote: [number, number][] = [];
          const lineasAzules: any[] = [];
          const lineasAzulesPunteadas: any[] = [];
          const arcosVerdes: any[] = [];
          const etiquetas: any[] = [];

          const getP = (
            grados: number,
            offset: number = 0,
          ): [number, number] => {
            const rad = grados * (Math.PI / 180);
            return [
              (radio + offset) * Math.cos(rad),
              (radio + offset) * Math.sin(rad),
            ];
          };

          const getCircularArc = (
            startAng: number,
            endAng: number,
            offset: number = 0.3,
          ): [number, number][] => {
            const points: [number, number][] = [];
            const steps = 20;
            const r = radio + offset;
            for (let i = 0; i <= steps; i++) {
              const ang = startAng + (endAng - startAng) * (i / steps);
              points.push([
                r * Math.cos((ang * Math.PI) / 180),
                r * Math.sin((ang * Math.PI) / 180),
              ]);
            }
            return points;
          };

          // 🔥 FIX 2: ALGORITMO BLINDADO (Ya no concatena números)
          const getAlg = (varNames: string[], isAngle: boolean = false) => {
            const varName = varNames.find(
              (name) =>
                v[name] !== undefined ||
                plantilla.relaciones?.some((r: string) =>
                  r.startsWith(name + ' ='),
                ),
            );
            if (!varName) return 'x';

            const rel = plantilla.relaciones?.find((r: string) =>
              r.startsWith(varName + ' ='),
            );

            // Si no hay relación, o es nivel básico, o la relación NO tiene 'x' (como los catetos de Pitágoras)
            // Tomamos el valor final matemático que el motor ya calculó, evitando que la Regex concatene números
            if (!rel || dif === 'basico' || !rel.includes('x')) {
              const valorFinal = v[varName];
              if (valorFinal !== undefined) {
                return isAngle ? `${valorFinal}°` : `${valorFinal}`;
              }
              return 'x';
            }

            let expr = rel.split('=')[1].trim();
            const tokens = expr.match(/[a-zA-Z_]\w*/g) || [];
            tokens.forEach((token) => {
              if (token === 'x') return;
              if (v[token] !== undefined) {
                const regex = new RegExp(`\\b${token}\\b`, 'g');
                expr = expr.replace(regex, v[token]);
              }
            });

            expr = expr
              .replace(/x\s*\*\s*x/g, 'x²')
              .replace(/(\d+)\s*\*\s*x/g, '$1x') // Solo junta el número con la x (ej: 3 * x -> 3x)
              .replace(/\+\s*-/g, '- ')
              .replace(/\s+/g, ' ')
              .trim();

            if (expr.includes('undefined')) {
              return v[varName] !== undefined
                ? isAngle
                  ? `${v[varName]}°`
                  : `${v[varName]}`
                : 'x';
            }

            return isAngle ? `${expr}°` : expr;
          };

          const O = [0, 0] as [number, number];
          etiquetas.push({ texto: 'O', pos: [-0.6, -0.6], esPunto: true });
          puntosPivote.push(O);

          if (tipo === 0) {
            // 🔹 FIG 0: Radio y Tangente
            const T = [5, 0] as [number, number];
            const P_top = [5, 4] as [number, number];
            const P_bot = [5, -4] as [number, number];
            puntosPivote.push(T);
            lineasAzules.push({ inicio: P_top, fin: P_bot });
            lineasAzules.push({ inicio: O, fin: T });

            etiquetas.push({ texto: 'T', pos: [5.6, -0.6], esPunto: true });

            if (dif === 'avanzado') {
              // 🔥 FIX 1: DIBUJAMOS LA HIPOTENUSA (Usando lineasAzules para forzar el render)
              lineasAzules.push({ inicio: O, fin: P_top });

              etiquetas.push({ texto: 'P', pos: [5.6, 4.2], esPunto: true });
              puntosPivote.push(P_top);

              etiquetas.push({
                texto: getAlg(['radio']),
                pos: [2.5, -0.8],
                esPunto: false,
              });
              etiquetas.push({ texto: 'x', pos: [5.8, 2], esPunto: false });
              etiquetas.push({
                texto: getAlg(['hipo']),
                pos: [2.0, 2.5],
                esPunto: false,
              });
            } else {
              etiquetas.push({
                texto: dif === 'basico' ? 'x' : getAlg(['ang', 'x'], true),
                pos: [3.8, 0.8],
                esPunto: false,
              });
            }
          } else if (tipo === 1) {
            // 🔹 FIG 1: Tangentes Exteriores
            const R = [0, -11] as [number, number];
            const angTang = Math.acos(5 / 11) * (180 / Math.PI);
            const A = getP(270 - angTang);
            const B = getP(270 + angTang);

            puntosPivote.push(R, A, B);
            lineasAzules.push({ inicio: R, fin: A }, { inicio: R, fin: B });

            etiquetas.push({ texto: 'P', pos: [0, -11.8], esPunto: true });
            etiquetas.push({
              texto: 'A',
              pos: getP(270 - angTang, 0.8),
              esPunto: true,
            });
            etiquetas.push({
              texto: 'B',
              pos: getP(270 + angTang, 0.8),
              esPunto: true,
            });

            etiquetas.push({
              texto: getAlg(['tang1']),
              pos: [-3.5, -8.0],
              esPunto: false,
            });
            etiquetas.push({
              texto: dif === 'basico' ? 'x' : getAlg(['tang2', 'x']),
              pos: [3.5, -8.0],
              esPunto: false,
            });
          } else if (tipo === 2) {
            // 🔹 FIG 2: Radio y Cuerda
            const M = [0, 3] as [number, number];
            const A = [-4, 3] as [number, number];
            const B = [4, 3] as [number, number];
            const P_top = [0, 5] as [number, number];

            puntosPivote.push(A, B, M);
            lineasAzules.push({ inicio: A, fin: B });
            lineasAzules.push({ inicio: O, fin: P_top });

            etiquetas.push({ texto: 'A', pos: [-4.8, 3], esPunto: true });
            etiquetas.push({ texto: 'B', pos: [4.8, 3], esPunto: true });
            etiquetas.push({ texto: 'M', pos: [0.6, 2.4], esPunto: true });

            if (dif === 'avanzado') {
              // 🔥 FIX 1: DIBUJAMOS LA HIPOTENUSA (Usando lineasAzules para forzar el render)
              lineasAzules.push({ inicio: O, fin: A });

              etiquetas.push({
                texto: getAlg(['radio']),
                pos: [-2.5, 1.2],
                esPunto: false,
              });
              etiquetas.push({
                texto: getAlg(['dist']),
                pos: [0.8, 1.5],
                esPunto: false,
              });
              etiquetas.push({ texto: 'x', pos: [-2, 3.8], esPunto: false });
            } else {
              etiquetas.push({
                texto: getAlg(['mitad1', 'mitad']),
                pos: [-2, 3.8],
                esPunto: false,
              });
              etiquetas.push({
                texto: dif === 'basico' ? 'x' : getAlg(['mitad2', 'x']),
                pos: [2, 3.8],
                esPunto: false,
              });
            }
          } else if (tipo === 3) {
            // 🔹 FIG 3: Cuerdas Paralelas
            const A = getP(140);
            const B = getP(40);
            const C = getP(220);
            const D = getP(320);

            puntosPivote.push(A, B, C, D);
            lineasAzules.push({ inicio: A, fin: B });
            lineasAzules.push({ inicio: C, fin: D });

            arcosVerdes.push(getCircularArc(140, 220, 0.4));
            arcosVerdes.push(getCircularArc(320, 400, 0.4));

            etiquetas.push({
              texto:
                dif === 'basico' ? 'x' : getAlg(['arco1', 'arco', 'x'], true),
              pos: getP(180, 2.0),
              esPunto: false,
            });
            etiquetas.push({
              texto: getAlg(['arco2', 'arco'], true),
              pos: getP(0, 2.0),
              esPunto: false,
            });

            etiquetas.push({ texto: 'A', pos: getP(140, 0.8), esPunto: true });
            etiquetas.push({ texto: 'B', pos: getP(40, 0.8), esPunto: true });
            etiquetas.push({ texto: 'C', pos: getP(220, 0.8), esPunto: true });
            etiquetas.push({ texto: 'D', pos: getP(320, 0.8), esPunto: true });
          } else if (tipo === 4) {
            // 🔹 FIG 4: Teorema de Pitot
            const A = [-5, -5] as [number, number];
            const B = [5, -5] as [number, number];
            const C = [5, 5] as [number, number];
            const D = [-5, 5] as [number, number];

            puntosPivote.push(A, B, C, D);
            lineasAzules.push(
              { inicio: A, fin: B },
              { inicio: B, fin: C },
              { inicio: C, fin: D },
              { inicio: D, fin: A },
            );

            etiquetas.push({
              texto: getAlg(['abajo']),
              pos: [0, -5.5],
              esPunto: false,
            });
            etiquetas.push({
              texto: getAlg(['arriba']),
              pos: [0, 5.5],
              esPunto: false,
            });
            etiquetas.push({
              texto: getAlg(['izq']),
              pos: [-5.8, 0],
              esPunto: false,
            });
            etiquetas.push({
              texto: dif === 'basico' ? 'x' : getAlg(['der', 'x']),
              pos: [5.8, 0],
              esPunto: false,
            });

            etiquetas.push({ texto: 'A', pos: [-5.8, -5.8], esPunto: true });
            etiquetas.push({ texto: 'B', pos: [5.8, -5.8], esPunto: true });
            etiquetas.push({ texto: 'C', pos: [5.8, 5.8], esPunto: true });
            etiquetas.push({ texto: 'D', pos: [-5.8, 5.8], esPunto: true });
          }

          return {
            type: 'geometry_mafs',
            theme: 'propiedades_circunferencia',
            radio,
            puntosPivote,
            lineasAzules,
            lineasAzulesPunteadas,
            arcosVerdes,
            etiquetas,
          };
        }

        case 'triangulo_angulos': {
          const esBasico = plantilla.id.includes('basico');
          const esIntermedio = plantilla.id.includes('intermedio');
          const esAvanzado = plantilla.id.includes('avanzado');
          const esExperto = plantilla.id.includes('experto');

          if (!esBasico && !esIntermedio && !esAvanzado && !esExperto) break;

          interface ArcoVisual {
            centro: [number, number];
            inicio: number;
            fin: number;
            etiqueta: string;
            colorIdx: number;
            labelVertice: string;
            exterior?: boolean;
          }

          // 🔥 ALGORITMO DE INGENIERÍA INVERSA (ADIÓS VALORES ABSURDOS)
          const x = Math.floor(Math.random() * 6) + 10; // x entre 10 y 15
          valores.x = x;
          valores.respuesta = x;

          // 1. Generamos Ángulos Internos Sanos (entre 40° y 80°)
          const int1 = Math.floor(Math.random() * 40) + 40;
          const int2 = Math.floor(Math.random() * 40) + 40;
          const int3 = 180 - int1 - int2;

          let a1, b1, a2, b2, a3, b3, a4, b4;
          let ang1 = int1;
          let ang2 = int2;

          if (esBasico || esIntermedio) {
            // Ecuaciones para los ángulos internos
            a1 = Math.floor(Math.random() * 3) + 1; // 1x, 2x o 3x
            b1 = int1 - a1 * x; // Forzará negativos si a*x > int1

            a2 = Math.floor(Math.random() * 3) + 1;
            b2 = int2 - a2 * x;

            a3 = Math.floor(Math.random() * 3) + 1;
            b3 = int3 - a3 * x;

            // Para intermedio: Ángulo exterior en B = int1 + int3
            const extB = int1 + int3;
            a4 = Math.floor(Math.random() * 2) + 2; // 2x o 3x
            b4 = extB - a4 * x;
          } else {
            // Avanzado / Experto: Ángulos Externos
            const ext1 = 180 - int1;
            const ext2 = 180 - int2;
            const ext3 = 180 - int3;

            a1 = Math.floor(Math.random() * 3) + 1;
            b1 = ext1 - a1 * (esExperto ? x * x : x);

            a2 = Math.floor(Math.random() * 3) + 1;
            b2 = ext2 - a2 * x;

            a3 = Math.floor(Math.random() * 3) + 1;
            b3 = ext3 - a3 * x;
          }

          const baseWidth = 7;
          const rad1 = (ang1 * Math.PI) / 180;
          const rad2 = (ang2 * Math.PI) / 180;

          const p1: [number, number] = [0, 0];
          const p2: [number, number] = [baseWidth, 0];
          const p3x =
            (baseWidth * Math.tan(rad2)) / (Math.tan(rad1) + Math.tan(rad2));
          const p3y = Math.max(p3x * Math.tan(rad1), 4);
          const p3: [number, number] = [p3x, p3y];

          const puntos: [number, number][] = [p1, p2, p3];

          const getAngle = (from: [number, number], to: [number, number]) => {
            return (
              Math.atan2(to[1] - from[1], to[0] - from[0]) * (180 / Math.PI)
            );
          };

          const ang_p1_p2 = getAngle(puntos[0], puntos[1]);
          const ang_p1_p3 = getAngle(puntos[0], puntos[2]);
          const ang_p2_p1 = getAngle(puntos[1], puntos[0]);
          const ang_p2_p3 = getAngle(puntos[1], puntos[2]);
          const ang_p3_p1 = getAngle(puntos[2], puntos[0]);
          const ang_p3_p2 = getAngle(puntos[2], puntos[1]);

          const fx = (a: any, b: any, forceX2 = false) => {
            const exp = forceX2 ? '²' : '';
            let eq = a === 1 ? `x${exp}` : !a || a === 0 ? '' : `${a}x${exp}`;
            if (b !== undefined && b !== 0) {
              eq += b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`;
            }
            return eq === '' ? '0°' : eq + '°';
          };

          const arcos: ArcoVisual[] = [];
          let lineasExtra: any[] = [];

          if (esBasico) {
            arcos.push({
              centro: puntos[0],
              inicio: ang_p1_p2,
              fin: ang_p1_p3,
              etiqueta: fx(a1, b1),
              colorIdx: 0,
              labelVertice: 'A',
            });
            arcos.push({
              centro: puntos[1],
              inicio: ang_p2_p3,
              fin: ang_p2_p1,
              etiqueta: fx(a2, b2),
              colorIdx: 1,
              labelVertice: 'B',
            });
            arcos.push({
              centro: puntos[2],
              inicio: ang_p3_p1,
              fin: ang_p3_p2,
              etiqueta: fx(a3, b3),
              colorIdx: 2,
              labelVertice: 'C',
            });
          } else if (esIntermedio) {
            arcos.push({
              centro: puntos[0],
              inicio: ang_p1_p2,
              fin: ang_p1_p3,
              etiqueta: fx(a1, b1),
              colorIdx: 0,
              labelVertice: 'A',
            });
            arcos.push({
              centro: puntos[2],
              inicio: ang_p3_p1,
              fin: ang_p3_p2,
              etiqueta: fx(a2, b2),
              colorIdx: 2,
              labelVertice: 'C',
            });
            arcos.push({
              centro: puntos[1],
              inicio: 0,
              fin: ang_p2_p3,
              etiqueta: fx(a4, b4),
              colorIdx: 1,
              labelVertice: 'B',
              exterior: true,
            });
            lineasExtra.push({ puntos: [puntos[1], [baseWidth + 2, 0]] });
          } else {
            // 🔥 NIVELES AVANZADOS: Arcos externos imanados correctamente
            arcos.push({
              centro: puntos[0],
              inicio: ang_p1_p3,
              fin: ang_p1_p2 + 180,
              etiqueta: fx(a1, b1, esExperto),
              colorIdx: 0,
              labelVertice: 'A',
              exterior: true,
            });
            arcos.push({
              centro: puntos[1],
              inicio: ang_p2_p1,
              fin: ang_p2_p3 + 180,
              etiqueta: fx(a2, b2, esExperto),
              colorIdx: 1,
              labelVertice: 'B',
              exterior: true,
            });
            arcos.push({
              centro: puntos[2],
              inicio: ang_p3_p2,
              fin: ang_p3_p1 + 180,
              etiqueta: fx(a3, b3, esExperto),
              colorIdx: 2,
              labelVertice: 'C',
              exterior: true,
            });

            // 🔥 PROYECCIONES DE SOPORTE CORREGIDAS
            const prolongar = (pA: [number, number], pB: [number, number]) => {
              const ang = Math.atan2(pB[1] - pA[1], pB[0] - pA[0]);
              return [pB[0] + 2.5 * Math.cos(ang), pB[1] + 2.5 * Math.sin(ang)];
            };

            lineasExtra = [
              { puntos: [puntos[0], prolongar(puntos[1], puntos[0])] }, // Prolongación BA -> A
              { puntos: [puntos[1], prolongar(puntos[2], puntos[1])] }, // Prolongación CB -> B
              { puntos: [puntos[2], prolongar(puntos[0], puntos[2])] }, // Prolongación AC -> C
            ];
          }

          return {
            type: 'geometry_mafs',
            theme: 'triangulos',
            puntos,
            arcos,
            lineasExtra,
            respuestaSobreescrita: x,
          };
        }

        case 'triangulos_notables': {
          const id = plantilla.id;
          const esBasico = id.includes('basico');
          const esIntermedio = id.includes('intermedio');
          const esAvanzado = id.includes('avanzado');
          const esExperto = id.includes('experto');

          // 🔥 FUNCIONES DE CONTROL DE LÍMITES (M.C.M)
          const gcd = (a: number, b: number): number =>
            b === 0 ? a : gcd(b, a % b);
          const lcm = (a: number, b: number): number =>
            Math.abs(a * b) / gcd(a, b);

          // DICCIONARIO DE TRIÁNGULOS NOTABLES (Opuesto, Adyacente, Hipotenusa)
          const T = [
            {
              ang: [30, 60],
              prop: [1, 'sqrt(3)', 2],
              num: [1, 1.732, 2],
              name: '30°-60°',
            },
            {
              ang: [45, 45],
              prop: [1, 1, 'sqrt(2)'],
              num: [1, 1, 1.414],
              name: '45°-45°',
            },
            { ang: [37, 53], prop: [3, 4, 5], num: [3, 4, 5], name: '37°-53°' },
            {
              ang: [16, 74],
              prop: [7, 24, 25],
              num: [7, 24, 25],
              name: '16°-74°',
            },
            {
              ang: [23, 67],
              prop: [5, 12, 13],
              num: [5, 12, 13],
              name: '5k-12k-13k',
            },
          ];

          let tVisual = T[Math.floor(Math.random() * T.length)];
          const k = Math.floor(Math.random() * 5) + 2;

          let respuestaFinal: string | number = '';
          let enunciadoForzado = plantilla.enunciado;
          let etiqLados = ['', '', ''];

          // =====================================
          // BÁSICO E INTERMEDIO
          // =====================================
          if (esBasico || esIntermedio) {
            const ladoConocidoIdx = Math.floor(Math.random() * 3);
            let ladoIncognitaIdx = Math.floor(Math.random() * 3);
            while (ladoIncognitaIdx === ladoConocidoIdx)
              ladoIncognitaIdx = Math.floor(Math.random() * 3);

            const formatSide = (prop: any, factor: number) =>
              typeof prop === 'string'
                ? `${factor}√${prop.match(/\d+/)![0]}`
                : `${prop * factor}`;

            etiqLados[ladoConocidoIdx] = formatSide(
              tVisual.prop[ladoConocidoIdx],
              k,
            );
            etiqLados[ladoIncognitaIdx] = 'x';
            respuestaFinal = formatSide(tVisual.prop[ladoIncognitaIdx], k);
          }

          // =====================================
          // AVANZADO
          // =====================================
          else if (esAvanzado) {
            let mcmVal = 0;
            let tFantasma = T[0];
            let intentos = 0;

            // Busca un par con MCM <= 100 para evitar números gigantes
            do {
              tVisual = T[Math.floor(Math.random() * T.length)];
              tFantasma = T[Math.floor(Math.random() * T.length)];

              const hipFan = tFantasma.prop[2];
              const adyVis = tVisual.prop[1];

              if (typeof hipFan === 'number' && typeof adyVis === 'number') {
                mcmVal = lcm(hipFan, adyVis);
              } else {
                mcmVal = 999;
              }
              intentos++;
            } while ((mcmVal > 100 || tFantasma === tVisual) && intentos < 50);

            // Fallback de seguridad
            if (intentos >= 50) {
              tVisual = T[2]; // 37-53
              tFantasma = T[4]; // 5-12-13
              mcmVal = 52; // LCM(13, 4)
            }

            const k_fan = mcmVal / (tFantasma.prop[2] as number);
            const k_vis = mcmVal / (tVisual.prop[1] as number);

            const catMenorFan = (tFantasma.prop[0] as number) * k_fan;

            respuestaFinal =
              typeof tVisual.prop[2] === 'string'
                ? `${k_vis}√${(tVisual.prop[2] as string).match(/\d+/)![0]}`
                : k_vis * (tVisual.prop[2] as number);

            enunciadoForzado = `La hipotenusa de un triángulo notable de ${tFantasma.name} (cuyo cateto opuesto al ángulo menor mide ${catMenorFan}) es congruente con el cateto adyacente al ángulo de ${tVisual.ang[0]}° del triángulo mostrado. Halla la hipotenusa x.`;
            etiqLados[2] = 'x';
          }

          // =====================================
          // EXPERTO: ECUACIONES LIMITADAS
          // =====================================
          else if (esExperto) {
            let mcmVal = 0;
            let tFantasma = T[0];
            let intentos = 0;

            // Solo triángulos con catetos/hipotenusas enteras y que su MCM sea <= 100
            do {
              tVisual = [T[2], T[3], T[4]][Math.floor(Math.random() * 3)];
              tFantasma = [T[2], T[3], T[4]][Math.floor(Math.random() * 3)];
              mcmVal = lcm(
                tFantasma.prop[2] as number,
                tVisual.prop[1] as number,
              );
              intentos++;
            } while ((mcmVal > 100 || tFantasma === tVisual) && intentos < 50);

            if (intentos >= 50) {
              tVisual = T[2];
              tFantasma = T[4];
              mcmVal = 52;
            }

            const k_fan = mcmVal / (tFantasma.prop[2] as number);
            const k_vis = mcmVal / (tVisual.prop[1] as number);

            const catMenorFan = (tFantasma.prop[0] as number) * k_fan;

            const catOpuestoReal = (tVisual.prop[0] as number) * k_vis;
            const hipotenusaReal = (tVisual.prop[2] as number) * k_vis;

            const xVal = Math.floor(Math.random() * 8) + 3; // Respuesta (x) entre 3 y 10

            // 🔥 CONTROL DE CONSTANTES: Asegura que b esté entre -50 y +100
            const generateEq = (target: number, x: number) => {
              let a, b;
              let att = 0;
              do {
                a = Math.floor(Math.random() * 5) + 2; // a entre 2 y 6
                b = target - a * x;
                att++;
              } while ((b < -50 || b > 100) && att < 20);
              return { a, b };
            };

            const eq1 = generateEq(catOpuestoReal, xVal);
            const eq2 = generateEq(hipotenusaReal, xVal);

            // Formateador elegante de ecuaciones
            const fx = (a: number, b: number) =>
              b === 0
                ? `${a}x`
                : b > 0
                  ? `${a}x + ${b}`
                  : `${a}x - ${Math.abs(b)}`;

            etiqLados[0] = fx(eq1.a, eq1.b);
            etiqLados[2] = fx(eq2.a, eq2.b);
            respuestaFinal = xVal;

            enunciadoForzado = `La hipotenusa de un triángulo notable de ${tFantasma.name} (cuyo cateto opuesto al ángulo menor mide ${catMenorFan}) es congruente con el cateto adyacente del triángulo mostrado. Plantea la proporcionalidad y halla x.`;
          }

          // =====================================
          // RENDERIZADO VISUAL
          // =====================================
          const baseVisual = 8;
          const hVisual = (tVisual.num[0] / tVisual.num[1]) * baseVisual;
          const puntos: [number, number][] = [
            [0, 0],
            [baseVisual, 0],
            [0, hVisual],
          ];

          const etiquetasLados: { pos: [number, number]; texto: string }[] = [];
          if (etiqLados[1])
            etiquetasLados.push({
              pos: [baseVisual / 2, -0.8],
              texto: etiqLados[1],
            });
          if (etiqLados[0])
            etiquetasLados.push({
              pos: [-1.4, hVisual / 2],
              texto: etiqLados[0],
            });
          if (etiqLados[2])
            etiquetasLados.push({
              pos: [baseVisual / 2 + 1.2, hVisual / 2 + 0.8],
              texto: etiqLados[2],
            });

          // 🔥 Tipado explícito a any[] para que TS no llore (y el verde de siempre)
          const arcos: any[] = [];
          arcos.push({
            centro: [baseVisual, 0],
            inicio: 180 - tVisual.ang[0],
            fin: 180,
            etiqueta: `${tVisual.ang[0]}°`,
            colorIdx: 2,
            labelVertice: '',
          });

          if (esBasico) {
            arcos.push({
              centro: [0, hVisual],
              inicio: 270,
              fin: 360 - tVisual.ang[0],
              etiqueta: `${tVisual.ang[1]}°`,
              colorIdx: 0,
              labelVertice: '',
            });
          }

          return {
            type: 'geometry_mafs',
            theme: 'triangulos',
            puntos,
            arcos,
            esRectangulo: true,
            etiquetasLados,
            lineasExtra: [],
            respuestaSobreescrita: respuestaFinal,
            enunciadoForzado,
          };
        }

        case 'paralelas_abanico': {
          const id = plantilla.id;
          const numAngulos = Math.floor(Math.random() * 2) + 4; // 4 o 5 ángulos

          // 1. GENERACIÓN DE ÁNGULOS (Suma = 180°)
          const angulosReales: number[] = [];
          let sumaTemp = 0;
          for (let i = 0; i < numAngulos - 1; i++) {
            const a = Math.floor(Math.random() * 25) + 25;
            angulosReales.push(a);
            sumaTemp += a;
          }
          angulosReales.push(180 - sumaTemp);

          // 2. INGENIERÍA INVERSA DE ECUACIONES
          const xVal = Math.floor(Math.random() * 8) + 4;
          const ecuaciones = angulosReales.map((ang) => {
            const a = Math.floor(Math.random() * 3) + 1;
            const b = ang - a * xVal;
            return { a, b, real: ang };
          });

          const fx = (a: number, b: number) =>
            b === 0
              ? `${a}x°`
              : b > 0
                ? `${a}x + ${b}°`
                : `${a}x - ${Math.abs(b)}°`;

          // 3. CÁLCULO VECTORIAL DE COORDENADAS
          const pts: [number, number][] = [];
          let currentP: [number, number] = [0, 5];
          pts.push(currentP);

          let currentDir = 0;
          const dirs = [0];

          for (let i = 0; i < numAngulos - 1; i++) {
            currentDir -= angulosReales[i];
            dirs.push(currentDir);
            const rad = currentDir * (Math.PI / 180);
            const L = 3.5;
            currentP = [
              currentP[0] + L * Math.cos(rad),
              currentP[1] + L * Math.sin(rad),
            ];
            pts.push(currentP);
          }

          // 🔥 CÁLCULO DEL CENTRO DE GRAVEDAD (Para alinear L1 y L2)
          const xCoords = pts.map((p) => p[0]);
          const minX = Math.min(...xCoords);
          const maxX = Math.max(...xCoords);
          const midX = (minX + maxX) / 2;
          const L_WIDTH = 10; // Ancho total = 20 unidades (Súper largas y simétricas)

          // 4. CONSTRUCCIÓN DE LÍNEAS Y PROYECCIONES REALES
          const lineasExtra: any[] = [];

          // L1 (Superior - Centrada)
          lineasExtra.push({
            puntos: [
              [midX - L_WIDTH, pts[0][1]],
              [midX + L_WIDTH, pts[0][1]],
            ],
          });
          // L2 (Inferior - Centrada)
          const lastP = pts[pts.length - 1];
          lineasExtra.push({
            puntos: [
              [midX - L_WIDTH, lastP[1]],
              [midX + L_WIDTH, lastP[1]],
            ],
          });

          // Dibujamos los segmentos principales del abanico
          for (let i = 0; i < pts.length - 1; i++) {
            lineasExtra.push({ puntos: [pts[i], pts[i + 1]] });
          }

          // 🔥 PROYECCIONES FRONTALES (Para que los arcos descansen sobre una línea)
          const PROJ_LEN = 2.5; // Largo de la "colita"
          for (let i = 1; i < pts.length; i++) {
            // La dirección de la línea que 'entra' al vértice
            const dirRad = dirs[i] * (Math.PI / 180);
            const pProj = [
              pts[i][0] + PROJ_LEN * Math.cos(dirRad),
              pts[i][1] + PROJ_LEN * Math.sin(dirRad),
            ];
            lineasExtra.push({ puntos: [pts[i], pProj] });
          }

          // Etiquetas de L1 y L2 (Alineadas a la derecha)
          const etiquetasLados: { pos: [number, number]; texto: string }[] = [
            { pos: [midX + L_WIDTH - 1, pts[0][1] + 0.5], texto: 'L1' },
            { pos: [midX + L_WIDTH - 1, lastP[1] + 0.5], texto: 'L2' },
          ];

          // 5. CÁLCULO DE ARCOS
          const arcos: any[] = [];
          for (let i = 0; i < numAngulos; i++) {
            const center = pts[i];
            let startA, endA;

            if (i === 0) {
              startA = 360 + dirs[1];
              endA = 360;
            } else if (i === numAngulos - 1) {
              startA = 180;
              endA = 180 + angulosReales[i];
            } else {
              startA = 360 + dirs[i + 1];
              endA = 360 + dirs[i];
            }

            arcos.push({
              centro: center,
              inicio: startA,
              fin: endA,
              etiqueta: fx(ecuaciones[i].a, ecuaciones[i].b),
              colorIdx: i % 4,
              labelVertice: '',
            });
          }

          return {
            type: 'geometry_mafs',
            theme: 'triangulos',
            puntos: [],
            arcos,
            lineasExtra,
            etiquetasLados,
            respuestaSobreescrita: xVal,
            enunciadoForzado:
              "En la figura, las rectas L1 y L2 son paralelas. Sabiendo que se cumple la 'Propiedad del Abanico', plantea la ecuación correspondiente y determina el valor de x.",
          };
        }

        case 'area_rombo': {
          const v = valores || {};
          const id = plantilla.id || '';
          const esExperto = id.includes('experto');

          const realD1 = Number(v.d1) || 12;
          const realD2 = Number(v.d2) || 16;
          const d1Visual = 8;
          const d2Visual = d1Visual * (realD2 / realD1);

          const pTop: [number, number] = [0, d2Visual / 2];
          const pBot: [number, number] = [0, -d2Visual / 2];
          const pRight: [number, number] = [d1Visual / 2, 0];
          const pLeft: [number, number] = [-d1Visual / 2, 0];
          const puntos: [number, number][] = [pTop, pRight, pBot, pLeft];

          const lineasExtra: any[] = [
            { puntos: [pTop, pBot] },
            { puntos: [pLeft, pRight] },
          ];

          const etiquetasLados: any[] = [
            { pos: [-d1Visual / 2 - 0.4, 0], texto: 'A' },
            { pos: [0, d2Visual / 2 + 0.4], texto: 'B' },
            { pos: [d1Visual / 2 + 0.4, 0], texto: 'C' },
            { pos: [0, -d2Visual / 2 - 0.4], texto: 'D' },
          ];

          // 🔥 EL FORMATEADOR ANTI-CERO (Garantiza que NUNCA imprima "0")
          const fx = (a: any, b: any, fallback: number) => {
            const valA = Number(a) || 0;
            const valB = Number(b) || 0;

            // Si el álgebra se anula por completo, devuelve el valor real (fallback)
            if (valA === 0 && valB === 0) return `${fallback}`;
            if (valA === 0) return `${valB}`;

            let pre = valA === 1 ? 'x' : valA === -1 ? '-x' : `${valA}x`;
            if (valB === 0) return pre;
            return valB > 0 ? `${pre} + ${valB}` : `${pre} - ${Math.abs(valB)}`;
          };

          let enunciadoForzado = plantilla.enunciado;
          if (!esExperto) {
            let txtD1 = id.includes('basico')
              ? `${realD1}`
              : id.includes('intermedio')
                ? `${v.a ?? 1}x`
                : fx(v.a, v.b, realD1);
            // Inyectamos realD2 como salvavidas por si v.c y v.d fallan
            let txtD2 = id.includes('basico')
              ? `${realD2}`
              : fx(v.c, v.d, realD2);

            etiquetasLados.push(
              { pos: [d1Visual / 4, -0.4], texto: txtD1 },
              { pos: [0.4, d2Visual / 4], texto: txtD2 },
            );
            enunciadoForzado = `Calcula el área del rombo ABCD sabiendo que la diagonal AC mide ${txtD1} cm y la diagonal BD mide ${txtD2} cm.`;
          } else {
            etiquetasLados.push({
              pos: [d1Visual / 4, -0.6],
              texto: `${v.diag_dada || 10}`,
            });
            etiquetasLados.push({
              pos: [d1Visual / 4 + 0.8, d2Visual / 4 + 0.8],
              texto: `${v.lado || 13}`,
            });
            lineasExtra.push(
              {
                puntos: [
                  [0, 0.4],
                  [0.4, 0.4],
                ],
              },
              {
                puntos: [
                  [0.4, 0.4],
                  [0.4, 0],
                ],
              },
            );
            enunciadoForzado = `Calcula el área del rombo ABCD sabiendo que su lado mide ${v.lado || 13} cm y la diagonal AC mide ${v.diag_dada || 10} cm.`;
          }

          return {
            type: 'geometry_mafs',
            theme: 'triangulos',
            puntos,
            esArea: true,
            etiquetasLados,
            lineasExtra,
            arcos: [],
            enunciadoForzado,
          };
        }

        // ========== ÁREA DE RECTÁNGULO ==========
        case 'area_rectangulo':
        case 'rectangulo_area': {
          const v = valores || {};
          const id = plantilla.id || '';
          const esExperto = id.includes('experto');

          const valX = Number(v.x) || 5;
          const valA = Number(v.a) || (esExperto ? 2 : 0);
          const valB = Number(v.b) || 4;
          const valC = Number(v.c) || (esExperto ? 1 : 0);
          const valD = Number(v.d) || 3;

          let baseReal = valA === 0 ? valX + valB : valA * valX + valB;
          let altReal = valC === 0 ? valX + valD : valC * valX + valD;
          if (baseReal <= 0 || isNaN(baseReal)) baseReal = 10;
          if (altReal <= 0 || isNaN(altReal)) altReal = 5;

          const baseVisual = 8;
          const hVisual = baseVisual * (altReal / baseReal);
          const puntos: [number, number][] = [
            [0, 0],
            [baseVisual, 0],
            [baseVisual, hVisual],
            [0, hVisual],
          ];

          const etiquetasLados: any[] = [
            { pos: [-0.3, -0.3], texto: 'A' },
            { pos: [baseVisual + 0.3, -0.3], texto: 'B' },
            { pos: [baseVisual + 0.3, hVisual + 0.3], texto: 'C' },
            { pos: [-0.3, hVisual + 0.3], texto: 'D' },
          ];

          // 🔥 EL FORMATEADOR ANTI-CERO PARA EL RECTÁNGULO
          const fx = (a: any, b: any, fallback: number) => {
            const valA = Number(a) || 0;
            const valB = Number(b) || 0;
            if (valA === 0 && valB === 0) return `${fallback}`;
            if (valA === 0) return `${valB}`;
            let pre = valA === 1 ? 'x' : valA === -1 ? '-x' : `${valA}x`;
            if (valB === 0) return pre;
            return valB > 0 ? `${pre} + ${valB}` : `${pre} - ${Math.abs(valB)}`;
          };

          const txtBase =
            id.includes('basico') || id.includes('intermedio')
              ? `x + ${v.b || 4}`
              : fx(valA, valB, baseReal);
          const txtAlt =
            id.includes('basico') || id.includes('intermedio')
              ? valC === 0
                ? `${valD || 5}`
                : `x + ${valD || 5}`
              : fx(valC, valD, altReal);

          etiquetasLados.push({ pos: [baseVisual / 2, -0.6], texto: txtBase });
          etiquetasLados.push({ pos: [-1.4, hVisual / 2], texto: txtAlt });

          const lineasExtra: any[] = [];
          if (esExperto)
            lineasExtra.push({
              puntos: [
                [0, 0],
                [baseVisual, hVisual],
              ],
            });

          return {
            type: 'geometry_mafs',
            theme: 'triangulos',
            puntos,
            esArea: true,
            etiquetasLados,
            lineasExtra,
            arcos: [],
          };
        }
     
       case 'geo_area_triangulo_basico':
        case 'geo_area_triangulo_intermedio':
        case 'geo_area_triangulo_avanzado':
        case 'geo_area_triangulo_experto':
        case 'area_triangulo': {
          const id = plantilla.id || '';
          const v = valores || {};
          
          const v_t = Number(v.var_t ?? 0);
          const v_k = Number(v.var_k ?? 1);
          const v_x = Number(v.var_x ?? 3); 
          const v_flip = Number(v.var_flip ?? 0);
          const v_hide = Number(v.var_hide ?? 0);

          const ternas = [ {a:3, b:4, c:5}, {a:5, b:12, c:13}, {a:8, b:15, c:17}, {a:6, b:8, c:10} ];
          const terna = ternas[v_t % 4];
          const cat1 = terna.a * v_k; 
          const cat2 = terna.b * v_k; 
          const hipo = terna.c * v_k;

          const flipX = (v_flip & 1) ? -1 : 1;
          const flipY = (v_flip & 2) ? -1 : 1;
          const swapXY = (v_flip & 4) !== 0;

          // 🔥 MOTOR DE 12 ARQUETIPOS
          const variante = (v_t + v_flip) % 3; 

          let ptsBase: [number, number][] = [];
          const labels: any[] = [];
          const lines: any[] = [];
          let resFinal = 0;
          let bFin=0, hFin=0, hiFin=0;

          const sym90 = { puntos: [[0, 1], [1, 1], [1, 0]], color: "red", tipo: 'angulo' };

          // 📐 NIVEL BÁSICO
          if (id.includes('basico')) {
            bFin = cat1; hFin = cat2; hiFin = hipo;
            resFinal = (bFin * hFin) / 2;

            if (variante === 0) {
              ptsBase = [[0,0], [bFin,0], [0,hFin]]; lines.push(sym90);
              labels.push({ pos: [0, hFin], dir: [-1, 1], texto: 'A', tipo: 'vertice' });
              labels.push({ pos: [0, 0], dir: [-1, -1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [bFin, 0], dir: [1, -1], texto: 'C', tipo: 'vertice' });
              labels.push({ pos: [bFin/2, 0], dir: [0, -1], texto: (v_hide===0)? `x` : `${bFin} u`, tipo: "base" });
              labels.push({ pos: [0, hFin/2], dir: [-1, 0], texto: (v_hide===0)? `${hFin} u` : `h`, tipo: "h" });
              labels.push({ pos: [bFin/2, hFin/2], dir: [1, 1], texto: `${hiFin} u`, tipo: "hipo" });
            } else if (variante === 1) {
              ptsBase = [[0,hFin], [bFin,hFin], [0,0]]; lines.push({ puntos: [[0, hFin-1], [1, hFin-1], [1, hFin]], color: "red", tipo:'angulo' });
              labels.push({ pos: [0, 0], dir: [-1, -1], texto: 'A', tipo: 'vertice' });
              labels.push({ pos: [0, hFin], dir: [-1, 1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [bFin, hFin], dir: [1, 1], texto: 'C', tipo: 'vertice' });
              labels.push({ pos: [bFin/2, hFin], dir: [0, 1], texto: (v_hide===0)? `x` : `${bFin} u`, tipo: "base" });
              labels.push({ pos: [0, hFin/2], dir: [-1, 0], texto: (v_hide===0)? `${hFin} u` : `h`, tipo: "h" });
              labels.push({ pos: [bFin/2, hFin/2], dir: [1, -1], texto: `${hiFin} u`, tipo: "hipo" });
            } else {
              ptsBase = [[0,0], [bFin,0], [bFin,hFin]]; lines.push({ puntos: [[bFin-1, 0], [bFin-1, 1], [bFin, 1]], color: "red", tipo:'angulo' });
              labels.push({ pos: [0, 0], dir: [-1, -1], texto: 'A', tipo: 'vertice' });
              labels.push({ pos: [bFin, 0], dir: [1, -1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [bFin, hFin], dir: [1, 1], texto: 'C', tipo: 'vertice' });
              labels.push({ pos: [bFin/2, 0], dir: [0, -1], texto: (v_hide===0)? `x` : `${bFin} u`, tipo: "base" });
              labels.push({ pos: [bFin, hFin/2], dir: [1, 0], texto: (v_hide===0)? `${hFin} u` : `h`, tipo: "h" });
              labels.push({ pos: [bFin/2, hFin/2], dir: [-1, 1], texto: `${hiFin} u`, tipo: "hipo" });
            }
          } 
          // 📐 NIVEL INTERMEDIO
          else if (id.includes('intermedio')) {
            if (variante === 0) {
              bFin = cat1 * 2; hFin = cat2; hiFin = hipo; resFinal = (bFin * hFin) / 2;
              ptsBase = [[-cat1, 0], [cat1, 0], [0, hFin]];
              labels.push({ pos: [-cat1, 0], dir: [-1, -1], texto: 'A', tipo: 'vertice' });
              labels.push({ pos: [0, hFin], dir: [0, 1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [cat1, 0], dir: [1, -1], texto: 'C', tipo: 'vertice' });
              lines.push({ puntos: [[0, hFin], [0, 0]], color: "green", estilo: "dashed" }); 
              lines.push({ puntos: [[-1, 0], [-1, 1], [0, 1]], color: "red", tipo:'angulo' }); 
              labels.push({ pos: [0, 0], dir: [0, -1], texto: `${bFin} cm`, tipo: "base" });
              labels.push({ pos: [0, hFin/2], dir: [1, 0], texto: `h`, tipo: "h" });
              labels.push({ pos: [cat1/2, hFin/2], dir: [1, 1], texto: `${hiFin} cm`, tipo: "hipo" });
            } else if (variante === 1) {
              hFin = hipo; bFin = cat1 + cat2; resFinal = (bFin * hFin) / 2;
              ptsBase = [[-cat1, 0], [cat2, 0], [0, hFin]]; 
              labels.push({ pos: [-cat1, 0], dir: [-1, -1], texto: 'A', tipo: 'vertice' });
              labels.push({ pos: [0, hFin], dir: [0, 1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [cat2, 0], dir: [1, -1], texto: 'C', tipo: 'vertice' });
              lines.push({ puntos: [[0, hFin], [0, 0]], color: "green", estilo: "dashed" }); 
              lines.push({ puntos: [[-1, 0], [-1, 1], [0, 1]], color: "red", tipo:'angulo' }); 
              labels.push({ pos: [-cat1/2, 0], dir: [0, -1], texto: `${cat1} cm`, tipo: "base" });
              labels.push({ pos: [cat2/2, 0], dir: [0, -1], texto: `${cat2} cm`, tipo: "base" });
              labels.push({ pos: [0, hFin/2], dir: [1, 0], texto: `h`, tipo: "h" });
            } else {
              bFin = cat1 * 2; hFin = cat2; hiFin = hipo; resFinal = (bFin * hFin) / 2;
              ptsBase = [[0, -cat1], [0, cat1], [hFin, 0]];
              labels.push({ pos: [0, cat1], dir: [-1, 1], texto: 'A', tipo: 'vertice' });
              labels.push({ pos: [hFin, 0], dir: [1, 0], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [0, -cat1], dir: [-1, -1], texto: 'C', tipo: 'vertice' });
              lines.push({ puntos: [[hFin, 0], [0, 0]], color: "green", estilo: "dashed" }); 
              lines.push({ puntos: [[0, 1], [1, 1], [1, 0]], color: "red", tipo:'angulo' }); 
              labels.push({ pos: [0, 0], dir: [-1.4, 0], texto: `${bFin} cm`, tipo: "base_tumbada" });
              labels.push({ pos: [hFin/2, 0], dir: [0, -1.3], texto: `h`, tipo: "h_tumbada" });
              labels.push({ pos: [hFin/2, cat1/2], dir: [1.3, 1], texto: `${hiFin} cm`, tipo: "hipo_tumbada" });
            }
          } 
          // 📐 NIVEL AVANZADO
         else if (id.includes('avanzado')) {
            // 🔥 FIX: Base dinámica (8 * v_k) en lugar de un 8 fijo
            bFin = 8 * v_k; 
            hFin = cat2; 
            hiFin = hipo; 
            const proy = cat1;
            resFinal = (bFin * hFin) / 2;

            if (variante === 0) {
              ptsBase = [[0,0], [bFin,0], [-proy, hFin]];
              labels.push({ pos: [0, 0], dir: [0.5, -1], texto: 'A', tipo: 'vertice' }); 
              labels.push({ pos: [-proy, hFin], dir: [-1, 1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [bFin, 0], dir: [1, -1], texto: 'C', tipo: 'vertice' });
              lines.push({ puntos: [[-proy, hFin], [-proy, 0], [0, 0]], color: "green", estilo: "dashed" }); 
              lines.push({ puntos: [[-proy, 1], [-proy+1, 1], [-proy+1, 0]], color: "red", tipo:'angulo' }); 
              labels.push({ pos: [bFin/2, 0], dir: [0, -1.2], texto: `${bFin} m`, tipo: "base" });
              labels.push({ pos: [-proy, hFin/2], dir: [-1.2, 0], texto: `h`, tipo: "h" });
              labels.push({ pos: [-proy/2, 0], dir: [0, -1.2], texto: `${proy} m`, tipo: "proy" });
              labels.push({ pos: [-proy/2, hFin/2], dir: [-1, 1.2], texto: `${hiFin} m`, tipo: "hipo_ext" });
            } else if (variante === 1) {
              ptsBase = [[0,0], [bFin,0], [bFin + proy, hFin]];
              labels.push({ pos: [0, 0], dir: [-1, -1], texto: 'A', tipo: 'vertice' }); 
              labels.push({ pos: [bFin + proy, hFin], dir: [1, 1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [bFin, 0], dir: [-0.5, -1], texto: 'C', tipo: 'vertice' });
              lines.push({ puntos: [[bFin + proy, hFin], [bFin + proy, 0], [bFin, 0]], color: "green", estilo: "dashed" }); 
              lines.push({ puntos: [[bFin + proy - 1, 0], [bFin + proy - 1, 1], [bFin + proy, 1]], color: "red", tipo:'angulo' }); 
              labels.push({ pos: [bFin/2, 0], dir: [0, -1.2], texto: `${bFin} m`, tipo: "base" });
              labels.push({ pos: [bFin + proy, hFin/2], dir: [1.2, 0], texto: `h`, tipo: "h" });
              labels.push({ pos: [bFin + proy/2, 0], dir: [0, -1.2], texto: `${proy} m`, tipo: "proy" });
              labels.push({ pos: [bFin + proy/2, hFin/2], dir: [1.2, 1], texto: `${hiFin} m`, tipo: "hipo_ext" });
            } else {
              ptsBase = [[0,0], [0, bFin], [hFin, -proy]];
              labels.push({ pos: [0, bFin], dir: [-1, 1], texto: 'A', tipo: 'vertice' }); 
              labels.push({ pos: [hFin, -proy], dir: [1, -1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [0, 0], dir: [-1, 0.5], texto: 'C', tipo: 'vertice' });
              lines.push({ puntos: [[hFin, -proy], [0, -proy], [0, 0]], color: "green", estilo: "dashed" }); 
              lines.push({ puntos: [[0, -proy + 1], [1, -proy + 1], [1, -proy]], color: "red", tipo:'angulo' }); 
              labels.push({ pos: [0, bFin/2], dir: [-1.2, 0], texto: `${bFin} m`, tipo: "base" });
              labels.push({ pos: [hFin/2, -proy], dir: [0, -1.2], texto: `h`, tipo: "h" });
              labels.push({ pos: [0, -proy/2], dir: [-1.2, 0], texto: `${proy} m`, tipo: "proy" });
              labels.push({ pos: [hFin/2, -proy/2], dir: [1.2, -1], texto: `${hiFin} m`, tipo: "hipo_ext" });
            }
          } 
          // 📐 NIVEL EXPERTO
          else { 
            if (variante === 0) {
              bFin = 3*v_x; hFin = 4*v_x; resFinal = (bFin * hFin) / 2;
              ptsBase = [[0,0], [bFin,0], [0,hFin]]; lines.push(sym90);
              labels.push({ pos: [0, hFin], dir: [-1, 1], texto: 'A', tipo: 'vertice' });
              labels.push({ pos: [0, 0], dir: [-1, -1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [bFin, 0], dir: [1, -1], texto: 'C', tipo: 'vertice' });
              labels.push({ pos: [bFin/2, 0], dir: [0, -1], texto: `3x`, tipo: "algebra" });
              labels.push({ pos: [0, hFin/2], dir: [-1, 0], texto: `4x`, tipo: "algebra" });
              labels.push({ pos: [bFin/2, hFin/2], dir: [1, 1], texto: `5x`, tipo: "algebra" });
            } else if (variante === 1) {
              bFin = 6*v_x; hFin = 4*v_x; resFinal = (bFin * hFin) / 2;
              ptsBase = [[-bFin/2, 0], [bFin/2, 0], [0, hFin]];
              labels.push({ pos: [-bFin/2, 0], dir: [-1, -1], texto: 'A', tipo: 'vertice' });
              labels.push({ pos: [0, hFin], dir: [0, 1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [bFin/2, 0], dir: [1, -1], texto: 'C', tipo: 'vertice' });
              labels.push({ pos: [0, 0], dir: [0, -1], texto: `6x`, tipo: "algebra" });
              labels.push({ pos: [-bFin/4, hFin/2], dir: [-1, 1], texto: `5x`, tipo: "algebra" });
              labels.push({ pos: [bFin/4, hFin/2], dir: [1, 1], texto: `5x`, tipo: "algebra" });
            } else {
              bFin = 12*v_x; hFin = 8*v_x; resFinal = (bFin * hFin) / 2;
              ptsBase = [[-bFin/2, 0], [bFin/2, 0], [0, hFin]];
              labels.push({ pos: [-bFin/2, 0], dir: [-1, -1], texto: 'A', tipo: 'vertice' });
              labels.push({ pos: [0, hFin], dir: [0, 1], texto: 'B', tipo: 'vertice' });
              labels.push({ pos: [bFin/2, 0], dir: [1, -1], texto: 'C', tipo: 'vertice' });
              labels.push({ pos: [0, 0], dir: [0, -1], texto: `12x`, tipo: "algebra" });
              labels.push({ pos: [-bFin/4, hFin/2], dir: [-1, 1], texto: `10x`, tipo: "algebra" });
              labels.push({ pos: [bFin/4, hFin/2], dir: [1, 1], texto: `10x`, tipo: "algebra" });
            }
          }

          // ROTACIONES
          const rotar = (px: number, py: number): [number, number] => {
            let nx = px * flipX; let ny = py * flipY;
            if (swapXY) { const tmp = nx; nx = ny; ny = tmp; }
            return [nx, ny];
          };

          const pts = ptsBase.map(([px, py]) => rotar(px, py));
          const lineasExtra = lines.map(l => ({ ...l, puntos: l.puntos.map(([px, py]) => rotar(px, py)) }));
          const etiquetas = labels.map(l => ({ ...l, pos: rotar(l.pos[0], l.pos[1]), dir: rotar(l.dir[0], l.dir[1]) }));

          return {
            valores: v, 
            respuesta: Math.round(resFinal),
            tipo_render: 'geometry_mafs',
            data: {
              type: 'geometry_mafs',
              theme: 'area_triangulo',
              puntos: pts,
              esArea: true,
              etiquetas,
              lineasExtra,
              arcos: [],
              respuestaSobreescrita: Math.round(resFinal)
            }
          };
        }

        // Añadir los demas casos

        default:
          console.log(
            `⚠️ [DEBUG] Cayó en default. Subtipo no reconocido o case ausente:`,
            plantilla.subtipo,
          );
          return null;
      }
    }

    if (plantilla.tema === 'razonamiento_matematico') {
      switch (plantilla.id) {

        case 'rm_conteo_triangulos_basico':
        case 'rm_conteo_triangulos_intermedio':
        case 'rm_conteo_triangulos_avanzado':
        case 'rm_conteo_triangulos_experto': {
          const id = plantilla.id || '';
          let typeShape = "";
          let params = {};
          let total = 0;

          if (id.includes('basico')) {
            // Triángulo simple con N cevianas (Fórmula: n*(n+1)/2)
            const n = Math.floor(Math.random() * 5) + 2; // 2 a 6 espacios
            typeShape = "cevianas_base";
            params = { espacios: n };
            total = (n * (n + 1)) / 2;
          } 
          else if (id.includes('intermedio')) {
            // Triángulo con cevianas Y líneas horizontales
            const n = Math.floor(Math.random() * 4) + 2; // 2 a 5 espacios base
            const h = Math.floor(Math.random() * 3) + 2; // 2 a 4 pisos horizontales
            typeShape = "cevianas_malla";
            params = { espacios: n, pisos: h };
            total = h * ((n * (n + 1)) / 2);
          }
          else if (id.includes('avanzado')) {
            // Cuadriláteros cruzados (El clásico cuadrado con 2 diagonales = 8 triángulos)
            // Variación: Cuadrado cruzado con cruz interna (16 triángulos)
            const varA = Math.random() > 0.5 ? 1 : 2;
            if (varA === 1) {
              typeShape = "cuadrado_diagonales"; // Cuadrado con X
              total = 8;
            } else {
              typeShape = "cuadrado_asterisco"; // Cuadrado con X y + cruzados
              total = 16;
            }
          }
          else {
            // Experto: Estrellas y Mallas Compuestas
            const varE = Math.floor(Math.random() * 3);
            if (varE === 0) {
              typeShape = "estrella_5"; // Estrella de 5 puntas continua (siempre 10 triángulos)
              total = 10;
            } else if (varE === 1) {
              typeShape = "estrella_david"; // Dos triángulos superpuestos (Estrella de 6) -> 8 triángulos
              total = 8;
            } else {
              // Triángulo con cevianas y una transversal que cruza todo (Fórmula compleja, la daremos fija para evitar errores visuales)
              typeShape = "cevianas_transversal";
              params = { espacios: 4 }; // Fijo para el gráfico experto
              total = 27; // 4 base, 1 transversal cruzando todos
            }
          }

          return {
            type: 'graphic_counting',
            data: { shape: typeShape, params },
            respuestaSobreescrita: total
          };
        }
        
        case 'rm_distribucion_hombrecito_basico':
        case 'rm_distribucion_hombrecito_intermedio':
        case 'rm_distribucion_hombrecito_avanzado':
        case 'rm_distribucion_hombrecito_experto':
        case 'rm_distribucion_hombrecito':
        case 'distribucion_grafica': {
          const id = plantilla.id || '';
          
          // Asignar banco de fórmulas según el nivel del ID
          let patrones: number[] = [];
          if (id.includes('basico')) patrones = [1, 2]; // Sumas y restas simples
          else if (id.includes('avanzado')) patrones = [5, 6]; // Combos de Multiplicación
          else if (id.includes('experto')) patrones = [7, 8]; // Cuadrados y combinaciones duras
          else patrones = [3, 4]; // INTERMEDIO (Default)

          const patronElegido = patrones[Math.floor(Math.random() * patrones.length)];

          const generarHombrecito = () => {
            let b1=0, b2=0, p1=0, p2=0, cabeza=0;
            
            if (patronElegido === 1) { // (b1+b2) + (p1+p2)
                b1 = Math.floor(Math.random()*20)+1; b2 = Math.floor(Math.random()*20)+1;
                p1 = Math.floor(Math.random()*15)+1; p2 = Math.floor(Math.random()*15)+1;
                cabeza = b1 + b2 + p1 + p2;
            } else if (patronElegido === 2) { // (b1+b2) - (p1+p2)
                b1 = Math.floor(Math.random()*20)+10; b2 = Math.floor(Math.random()*20)+10;
                // Blindaje: p1 y p2 suman menos que los brazos
                const maxPiernas = b1 + b2 - 2; 
                p1 = Math.floor(Math.random()*(maxPiernas/2))+1;
                p2 = Math.floor(Math.random()*(maxPiernas/2))+1;
                cabeza = (b1 + b2) - (p1 + p2);
            } else if (patronElegido === 3) { // (b1 * b2) - (p1 + p2)
                b1 = Math.floor(Math.random()*9)+3; b2 = Math.floor(Math.random()*9)+3;
                const prod = b1 * b2;
                p1 = Math.floor(Math.random()*(prod/2 - 1))+1;
                p2 = Math.floor(Math.random()*(prod/2 - 1))+1;
                cabeza = prod - (p1 + p2);
            } else if (patronElegido === 4) { // (b1 * p1) + (b2 * p2)
                b1 = Math.floor(Math.random()*8)+2; p1 = Math.floor(Math.random()*8)+2;
                b2 = Math.floor(Math.random()*8)+2; p2 = Math.floor(Math.random()*8)+2;
                cabeza = (b1 * p1) + (b2 * p2);
            } else if (patronElegido === 5) { // (b1 * b2) - (p1 * p2)
                b1 = Math.floor(Math.random()*7)+5; b2 = Math.floor(Math.random()*7)+5;
                const prod = b1 * b2;
                // Blindaje: p1*p2 debe ser menor que b1*b2
                p1 = Math.floor(Math.random()*4)+2; // 2 a 5
                p2 = Math.floor(Math.random()*4)+2; // 2 a 5
                if(p1*p2 >= prod) { p1=2; p2=2; } // Seguro de emergencia
                cabeza = prod - (p1 * p2);
            } else if (patronElegido === 6) { // (b1 + b2) * (p1 + p2)
                b1 = Math.floor(Math.random()*6)+2; b2 = Math.floor(Math.random()*6)+2;
                p1 = Math.floor(Math.random()*5)+1; p2 = Math.floor(Math.random()*5)+1;
                cabeza = (b1 + b2) * (p1 + p2);
            } else if (patronElegido === 7) { // EXPERTO: (b1² + b2²) - (p1+p2)
                b1 = Math.floor(Math.random()*5)+3; // 3 a 7
                b2 = Math.floor(Math.random()*5)+3; // 3 a 7
                const sumaCuadrados = (b1*b1) + (b2*b2);
                p1 = Math.floor(Math.random()*(sumaCuadrados/2 - 2))+1;
                p2 = Math.floor(Math.random()*(sumaCuadrados/2 - 2))+1;
                cabeza = sumaCuadrados - (p1 + p2);
            } else if (patronElegido === 8) { // EXPERTO: (b1² - p1) + (b2² - p2)
                b1 = Math.floor(Math.random()*6)+4; // 4 a 9
                b2 = Math.floor(Math.random()*6)+4; // 4 a 9
                p1 = Math.floor(Math.random()*(b1*b1 - 2))+1;
                p2 = Math.floor(Math.random()*(b2*b2 - 2))+1;
                cabeza = (b1*b1 - p1) + (b2*b2 - p2);
            }
            return [cabeza, b1, b2, p1, p2];
          };

          const fig1 = generarHombrecito();
          const fig2 = generarHombrecito();
          const fig3 = generarHombrecito();
          const respuestaFinal = fig3[0];
          fig3[0] = "x" as any;

          return {
            type: 'graphic_distribution',
            data: { shape: 'stickman', figures: [fig1, fig2, fig3] },
            respuestaSobreescrita: respuestaFinal
          };
        }

        // 🔥 RM: CRIPTOARITMÉTICA (NIVELES ESCALONADOS) 🔥
        case 'rm_criptoaritmetica_basico':
        case 'rm_criptoaritmetica_intermedio':
        case 'rm_criptoaritmetica_avanzado':
        case 'rm_criptoaritmetica_experto':
        case 'rm_criptoaritmetica_suma':
        case 'criptoaritmetica': {
          const id = plantilla.id || '';
          
          // 1. Dificultad determina el tamaño del número
          let min = 100, max = 899; // Básico (3 cifras)
          let cantOcultas = 1;
          
          if (id.includes('intermedio')) {
            min = 1000; max = 8999; cantOcultas = 2; // 4 cifras
          } else if (id.includes('avanzado')) {
            min = 10000; max = 89999; cantOcultas = 2; // 5 cifras
          } else if (id.includes('experto')) {
            min = 10000; max = 89999; cantOcultas = 3; // 5 cifras, más ocultas
          }

          // 2. Elegimos si es suma o resta (Básico siempre es suma)
          const esSuma = id.includes('basico') ? true : Math.random() > 0.5;
          
          // 3. Generación matemática estricta (num1 > num2 siempre para evitar negativos)
          const num1 = Math.floor(Math.random() * max) + min; 
          const num2 = Math.floor(Math.random() * (num1 - min)) + min; 
          
          const resultado = esSuma ? num1 + num2 : num1 - num2;

          const str1 = num1.toString().split('');
          const str2 = num2.toString().split('');
          const strRes = resultado.toString().split('');

          let sumaOcultas = 0;

          // Función segura para ocultar asteriscos sin pasarse
          const ocultarAlAzar = (arr: string[], maxOcultas: number) => {
            let indices = Array.from({length: arr.length}, (_, i) => i);
            indices.sort(() => Math.random() - 0.5); 
            // Nunca ocultar TODO el número, dejar al menos 1 pista
            const aOcultar = Math.min(maxOcultas, arr.length - 1);
            for(let i = 0; i < aOcultar; i++) {
              let idx = indices[i];
              if (arr[idx] !== "*") {
                sumaOcultas += Number(arr[idx]);
                arr[idx] = "*";
              }
            }
          };

          ocultarAlAzar(str1, cantOcultas);
          ocultarAlAzar(str2, cantOcultas);
          ocultarAlAzar(strRes, cantOcultas);

          return {
            type: 'crypto_grid',
            data: { operator: esSuma ? "+" : "-", rows: [str1, str2, strRes] },
            respuestaSobreescrita: sumaOcultas
          };
        }

       
      
       // 🔥 RM: CRIPTOARITMÉTICA MULTIPLICACIÓN (VERSIÓN BLINDADA CONAMAT) 🔥
        case 'rm_criptoaritmetica_mult_basico':
        case 'rm_criptoaritmetica_mult_intermedio':
        case 'rm_criptoaritmetica_mult_avanzado':
        case 'rm_criptoaritmetica_mult_experto':
        case 'rm_criptoaritmetica_mult': {
          const id = plantilla.id || '';
          
          let num1 = 0, num2 = 0, cantOcultas = 1;
          
          // FORZAMOS RANGOS ESTRICTOS
          if (id.includes('basico')) { 
            num1 = Math.floor(Math.random() * 89) + 10; // 10 a 98
            num2 = Math.floor(Math.random() * 89) + 10; // 10 a 98 -> 2 DÍGITOS SÍ O SÍ
            cantOcultas = 4;
          } else if (id.includes('intermedio')) { 
            num1 = Math.floor(Math.random() * 899) + 100; // 100 a 999
            num2 = Math.floor(Math.random() * 89) + 10;  // 10 a 99
            cantOcultas = 5;
          } else if (id.includes('avanzado')) { 
            num1 = Math.floor(Math.random() * 899) + 100; 
            num2 = Math.floor(Math.random() * 899) + 100; // 3 DÍGITOS
            cantOcultas = 7;
          } else if (id.includes('experto')) {
            num1 = Math.floor(Math.random() * 8999) + 1000; 
            num2 = Math.floor(Math.random() * 899) + 100; 
            cantOcultas = 9;
          } else {
            num1 = 25; num2 = 15; // Emergencia
          }

          const productoFinal = num1 * num2;
          let rows: string[][] = [];
          rows.push(num1.toString().split('')); // Fila 0
          rows.push(num2.toString().split('')); // Fila 1

          // MOTOR DE SUBPRODUCTOS (Si num2 > 9, genera escalera)
          const strNum2 = num2.toString();
          if (num2 > 9) {
            for (let i = strNum2.length - 1; i >= 0; i--) {
              const digito = Number(strNum2[i]);
              const subProd = (num1 * digito).toString().split('');
              const cerosDesplazamiento = (strNum2.length - 1) - i;
              for (let s = 0; s < cerosDesplazamiento; s++) subProd.push(" "); 
              rows.push(subProd);
            }
          }
          rows.push(productoFinal.toString().split(''));

          // OCULTAMIENTO
          let sumaOcultas = 0;
          let asteriscosPuestos = 0;
          let totalNumeros = 0;
          rows.forEach(r => r.forEach(c => { if(c !== " " && c !== "*") totalNumeros++; }));
          const maxAocultar = Math.min(cantOcultas, totalNumeros - 2); 

          while (asteriscosPuestos < maxAocultar) {
            const f = Math.floor(Math.random() * rows.length);
            const c = Math.floor(Math.random() * rows[f].length);
            if (rows[f][c] !== "*" && rows[f][c] !== " ") { 
              sumaOcultas += Number(rows[f][c]);
              rows[f][c] = "*";
              asteriscosPuestos++;
            }
          }

          return {
            type: 'crypto_mult',
            data: { operator: "x", rows: rows },
            respuestaSobreescrita: sumaOcultas
          };
        }

        case 'rm_distribucion_casita_basico':
        case 'rm_distribucion_casita_intermedio':
        case 'rm_distribucion_casita_avanzado':
        case 'rm_distribucion_casita_experto':
        case 'rm_distribucion_casita': {
          const id = plantilla.id || '';
          
          let patrones: number[] = [];
          if (id.includes('basico')) patrones = [1, 2]; // Operaciones combinadas
          else if (id.includes('intermedio')) patrones = [3, 4]; // Cuadrados y dobles
          else if (id.includes('avanzado')) patrones = [5, 6, 7]; // Raíces y diferencias
          else patrones = [8, 9, 10]; // EXPERTO: Suma de cifras, potencias

          const patronElegido = patrones[Math.floor(Math.random() * patrones.length)];

          const generarCasita = (esIncognita = false) => {
            let v1=0, v2=0, p=0, techo=0;
            
            switch (patronElegido) {
              case 1: // (V1 * V2) - P
                v1 = Math.floor(Math.random()*8)+3; v2 = Math.floor(Math.random()*8)+3; 
                p = Math.floor(Math.random()*5)+1; techo = (v1 * v2) - p; break;
              case 2: // (V1 + V2) * P
                v1 = Math.floor(Math.random()*9)+1; v2 = Math.floor(Math.random()*9)+1;
                p = Math.floor(Math.random()*4)+2; techo = (v1 + v2) * p; break;
              case 3: // V1² + V2² - P
                v1 = Math.floor(Math.random()*6)+2; v2 = Math.floor(Math.random()*6)+2;
                p = Math.floor(Math.random()*10)+1; techo = (v1*v1) + (v2*v2) - p; break;
              case 4: // (V1 * P) + V2²
                v1 = Math.floor(Math.random()*6)+3; p = Math.floor(Math.random()*5)+2;
                v2 = Math.floor(Math.random()*5)+2; techo = (v1 * p) + (v2*v2); break;
              case 5: // √(V1) * √(V2) + P (Cuadrados perfectos)
                let base1 = Math.floor(Math.random()*6)+2; let base2 = Math.floor(Math.random()*6)+2;
                v1 = base1*base1; v2 = base2*base2; 
                p = Math.floor(Math.random()*10)+1; techo = (base1 * base2) + p; break;
              case 6: // V1² - V2² + P
                v1 = Math.floor(Math.random()*5)+5; v2 = Math.floor(Math.random()*4)+1; // v1 > v2
                p = Math.floor(Math.random()*15)+1; techo = (v1*v1) - (v2*v2) + p; break;
              case 7: // (V1 * V2) / P (División exacta)
                p = Math.floor(Math.random()*4)+2; // 2 a 5
                v1 = p * (Math.floor(Math.random()*4)+1); v2 = Math.floor(Math.random()*6)+2;
                techo = (v1 * v2) / p; break;
              case 8: // V1 elevado a la V2 + P
                v1 = Math.floor(Math.random()*4)+2; v2 = Math.floor(Math.random()*2)+2; // max 5^3
                p = Math.floor(Math.random()*20)+1; techo = Math.pow(v1, v2) + p; break;
              case 9: // Suma de cifras de (V1 * V2 * P)
                v1 = Math.floor(Math.random()*9)+5; v2 = Math.floor(Math.random()*9)+5; p = Math.floor(Math.random()*5)+3;
                let prodStr = (v1 * v2 * p).toString();
                techo = prodStr.split('').reduce((acc, curr) => acc + Number(curr), 0); break;
              case 10: // (V1 + P)² - V2
                v1 = Math.floor(Math.random()*4)+1; p = Math.floor(Math.random()*4)+1;
                v2 = Math.floor(Math.random()*10)+1; techo = Math.pow(v1 + p, 2) - v2; break;
            }

            let obj = { techo, v1, v2, p, incognitaReal: 0 };
            if (esIncognita) {
              // Solo pedimos puerta si es fácil de despejar
              if (Math.random() > 0.6 && patronElegido <= 2) { 
                obj.incognitaReal = p; obj.p = "x" as any;
              } else {
                obj.incognitaReal = techo; obj.techo = "x" as any;
              }
            }
            return obj;
          };

          const c1 = generarCasita(); const c2 = generarCasita(); const c3 = generarCasita(true);
          return { type: 'graphic_distribution', data: { shape: 'house', figures: [c1, c2, c3] }, respuestaSobreescrita: c3.incognitaReal };
        }



        // 🔥 RM: CRIPTOARITMÉTICA DIVISIÓN (MOTOR DE CASCADA EXACTA)
        case 'rm_criptoaritmetica_div_basico':
        case 'rm_criptoaritmetica_div_intermedio':
        case 'rm_criptoaritmetica_div_avanzado':
        case 'rm_criptoaritmetica_div_experto': {
          const id = plantilla.id || '';
          let dsr = 0, q = 0;

          // RANGOS ESTRICTOS CONAMAT (Garantiza divisibilidad y proceso inverso)
          if (id.includes('basico')) { dsr = Math.floor(Math.random()*7)+3; q = Math.floor(Math.random()*9)+10; } 
          else if (id.includes('intermedio')) { dsr = Math.floor(Math.random()*8)+2; q = Math.floor(Math.random()*40)+20; }
          else if (id.includes('avanzado')) { dsr = Math.floor(Math.random()*40)+11; q = Math.floor(Math.random()*80)+20; }
          else { dsr = Math.floor(Math.random()*40)+11; q = Math.floor(Math.random()*80)+20; }

          const dnd = dsr * q; // Exacta (puedes sumar +residuo luego si quieres inexactas)
          const dndS = dnd.toString();
          const dsrS = dsr.toString();
          const qS = q.toString();
          
          let steps: any[] = [];
          
          // --- ALGORITMO DE CASCADA MATEMÁTICA ---
          let dIdx = 0;
          let chunk = "";
          
          // Buscar el primer bloque que se puede dividir
          while (dIdx < dndS.length && Number(chunk + dndS[dIdx]) < dsr) {
            chunk += dndS[dIdx]; dIdx++;
          }
          if (dIdx < dndS.length) { chunk += dndS[dIdx]; dIdx++; }

          // Función para alinear a la derecha dentro de la cuadrícula
          const alinearDerecha = (str: string, endIdx: number, length: number) => {
            let row = Array(length).fill(" ");
            for (let i = 0; i < str.length; i++) row[endIdx - str.length + 1 + i] = str[i];
            return row;
          };

          for (let i = 0; i < qS.length; i++) {
            const dq = Number(qS[i]);
            const prod = dsr * dq;
            const prodStr = prod.toString();

            // Producto alineado con el último dígito usado (dIdx - 1)
            const prodRow = alinearDerecha(prodStr, dIdx - 1, dndS.length);
            const resta = Number(chunk) - prod;
            let restaRow = Array(dndS.length).fill(" ");

            if (i === qS.length - 1) { // ÚLTIMO PASO
              if (resta === 0) {
                // Rayitas exactas bajo el producto
                for (let j = 0; j < prodStr.length; j++) restaRow[dIdx - 1 - j] = "-";
              } else {
                restaRow = alinearDerecha(resta.toString(), dIdx - 1, dndS.length);
              }
            } else { // PASOS INTERMEDIOS
              let restaStr = resta === 0 ? "" : resta.toString();
              let nextDigit = dndS[dIdx];
              chunk = restaStr + nextDigit;

              // Alinear el residuo y bajar el siguiente número
              for (let j = 0; j < restaStr.length; j++) restaRow[dIdx - 1 - restaStr.length + 1 + j] = restaStr[j];
              restaRow[dIdx] = nextDigit;
              dIdx++;
            }
            steps.push({ producto: prodRow, resta: restaRow });
          }

          const data = {
            dividendo: dndS.split(''),
            divisor: dsrS.split(''),
            cociente: qS.split(''),
            pasos: steps
          };

          // --- SISTEMA DE OCULTAMIENTO (Cajas Rojas) ---
          let sumaOcultas = 0;
          const ocultar = (arr: any[]) => {
            if (!Array.isArray(arr)) return;
            arr.forEach((char, idx) => {
              if (char !== " " && char !== "-" && Math.random() > 0.6) {
                sumaOcultas += Number(char);
                arr[idx] = "*";
              }
            });
          };

          // Ocultamos manteniendo siempre la primera cifra del divisor visible
          ocultar(data.dividendo);
          for(let i=1; i<data.divisor.length; i++) { if(Math.random()>0.5){ sumaOcultas+=Number(data.divisor[i]); data.divisor[i]="*"; } }
          ocultar(data.cociente);
          data.pasos.forEach(p => { ocultar(p.producto); ocultar(p.resta); });

          return {
            type: 'crypto_div',
            data: data,
            respuestaSobreescrita: sumaOcultas
          };
        }







       case 'rm_distribucion_circular_basico':
        case 'rm_distribucion_circular_intermedio':
        case 'rm_distribucion_circular_avanzado':
        case 'rm_distribucion_circular_experto':
        case 'rm_distribucion_circular': {
          const id = plantilla.id || '';
          
          let patronesC: number[] = [];
          if (id.includes('basico')) patronesC = [1, 2]; 
          else if (id.includes('intermedio')) patronesC = [3, 4, 5]; 
          else if (id.includes('avanzado')) patronesC = [6, 7, 8]; 
          else patronesC = [9, 10]; // EXPERTO PURO

          const patronElegido = patronesC[Math.floor(Math.random() * patronesC.length)];

          const generarCirculo = (esX = false) => {
            let n1=0, n2=0, n3=0, centro=0;

            switch(patronElegido) {
              case 1: // (n1 * n2) - n3
                n1 = Math.floor(Math.random()*8)+3; n2 = Math.floor(Math.random()*8)+3; n3 = Math.floor(Math.random()*15)+1;
                centro = (n1 * n2) - n3; break;
              case 2: // (n1 + n2) * n3
                n1 = Math.floor(Math.random()*9)+2; n2 = Math.floor(Math.random()*9)+2; n3 = Math.floor(Math.random()*5)+2;
                centro = (n1 + n2) * n3; break;
              case 3: // n1² + (n2 * n3)
                n1 = Math.floor(Math.random()*7)+3; n2 = Math.floor(Math.random()*9)+2; n3 = Math.floor(Math.random()*9)+2;
                centro = (n1 * n1) + (n2 * n3); break;
              case 4: // √(n1) * n2 + n3
                let b1 = Math.floor(Math.random()*7)+2; n1 = b1*b1;
                n2 = Math.floor(Math.random()*6)+2; n3 = Math.floor(Math.random()*20)+1;
                centro = (b1 * n2) + n3; break;
              case 5: // n1² - n2² + n3
                n1 = Math.floor(Math.random()*6)+5; n2 = Math.floor(Math.random()*4)+1; n3 = Math.floor(Math.random()*15)+1;
                centro = (n1 * n1) - (n2 * n2) + n3; break;
              case 6: // (n1 * n2 * n3) / 2
                n1 = Math.floor(Math.random()*5)*2 + 2; n2 = Math.floor(Math.random()*5)+2; n3 = Math.floor(Math.random()*5)+2;
                centro = (n1 * n2 * n3) / 2; break;
              case 7: // n1³ + n2 - n3
                n1 = Math.floor(Math.random()*4)+2; n2 = Math.floor(Math.random()*20)+5; n3 = Math.floor(Math.random()*10)+1;
                centro = Math.pow(n1, 3) + n2 - n3; break;
              case 8: // Suma de cifras de (n1² * n2)
                n1 = Math.floor(Math.random()*6)+4; n2 = Math.floor(Math.random()*6)+4; n3 = Math.floor(Math.random()*20)+1;
                let calc = ((n1*n1) * n2).toString();
                centro = calc.split('').reduce((a, b) => a + Number(b), 0) + n3; break;
              case 9: // √(n1 + n2) * n3
                let b2 = Math.floor(Math.random()*6)+3; let sumPerfecta = b2*b2;
                n1 = Math.floor(Math.random()*(sumPerfecta-2))+1; n2 = sumPerfecta - n1;
                n3 = Math.floor(Math.random()*8)+3;
                centro = b2 * n3; break;
              case 10: // n1 elevado a la (n2 - n3)
                n1 = Math.floor(Math.random()*3)+2; // base 2 a 4
                let exp = Math.floor(Math.random()*3)+1; // exp 1 a 3
                n2 = Math.floor(Math.random()*10)+exp+1; n3 = n2 - exp;
                centro = Math.pow(n1, exp); break;
            }
            return { vals: [n1, n2, n3], centro: esX ? "x" : centro, real: centro };
          };

          const f1 = generarCirculo(); const f2 = generarCirculo(); const f3 = generarCirculo(true);
          return { type: 'graphic_distribution', data: { shape: 'circle', figures: [f1, f2, f3] }, respuestaSobreescrita: f3.real };
        }


      // 🔥 MEGA-MOTOR UNIVERSAL: CATÁLOGO MASIVO (Letras, Escaleras, Estrellas, Trapecios) 🔥
        case 'rm_conteo_triangulos_basico':
        case 'rm_conteo_triangulos_intermedio':
        case 'rm_conteo_triangulos_avanzado':
        case 'rm_conteo_triangulos_experto':
        case 'rm_conteo_cuadrilateros_basico':
        case 'rm_conteo_cuadrilateros_experto':
        case 'rm_conteo_angulos_basico':
        case 'rm_conteo_sectores_basico':
        case 'rm_conteo_cubos_basico':
        case 'rm_conteo_cubos_experto':
        case 'conteo_figuras': {
          const id = plantilla.id || '';
          const v = valores || {};
          let resFinal = 0;
          const lines: any[] = [];
          const polys3D: any[] = []; 
          
          let tipo = 'tri';
          if (id.includes('cuadrilatero')) tipo = 'cuad';
          else if (id.includes('angulo')) tipo = 'ang';
          else if (id.includes('sectore')) tipo = 'sec';
          else if (id.includes('cubo')) tipo = 'cub';

          const lineColor = "#16a34a"; 
          const w = 2;

          // ==========================================
          // 📐 1. TRIÁNGULOS Y ÁNGULOS (Variedad Extrema)
          // ==========================================
          if (tipo === 'tri' || tipo === 'ang') {
            
            // Filtro por dificultad (Le decimos a TypeScript que es un array de strings)
            let opciones: string[] = [];
            
            if (id.includes('basico')) opciones = ['triangulo_pisos', 'cuadrado_x'];
            else if (id.includes('intermedio')) opciones = ['triangulo_pisos', 'cuadrado_cruz', 'trapecio'];
            else if (id.includes('avanzado')) opciones = ['cuadrado_cruz', 'rectangulo_doble', 'trapecio', 'estrella'];
            else opciones = ['triangulo_pisos', 'rectangulo_doble', 'estrella']; // Experto

            const formaElegida = opciones[Math.floor(Math.random() * opciones.length)];

            if (formaElegida === 'triangulo_pisos') {
              const n = Math.floor(Math.random() * 4) + 3; 
              const m = id.includes('basico') ? 1 : Math.floor(Math.random() * 3) + 2; 
              resFinal = m * ((n * (n + 1)) / 2);
              const b = 16, h = 14, xA = -b/2, xC = b/2;
              const xB = [-5, 0, 5][Math.floor(Math.random() * 3)]; 
              
              lines.push({ puntos: [[xA, 0], [xC, 0], [xB, h], [xA, 0]], color: lineColor, weight: w });
              for (let i = 1; i < n; i++) lines.push({ puntos: [[xB, h], [xA + (b/n)*i, 0]], color: lineColor, weight: w });
              for (let j = 1; j < m; j++) {
                const yk = (h/m)*j;
                lines.push({ puntos: [[xA + (xB - xA)*(yk/h), yk], [xC + (xB - xC)*(yk/h), yk]], color: lineColor, weight: w });
              }
            } 
            else if (formaElegida === 'cuadrado_x') {
              resFinal = 8;
              const a = 8;
              lines.push({ puntos: [[-a,-a], [a,-a], [a,a], [-a,a], [-a,-a]], color: lineColor, weight: w });
              lines.push({ puntos: [[-a,-a], [a,a]], color: lineColor, weight: w });
              lines.push({ puntos: [[-a,a], [a,-a]], color: lineColor, weight: w });
            }
            else if (formaElegida === 'cuadrado_cruz') {
              resFinal = 16;
              const a = 8;
              lines.push({ puntos: [[-a,-a], [a,-a], [a,a], [-a,a], [-a,-a]], color: lineColor, weight: w });
              lines.push({ puntos: [[-a,-a], [a,a]], color: lineColor, weight: w });
              lines.push({ puntos: [[-a,a], [a,-a]], color: lineColor, weight: w });
              lines.push({ puntos: [[-a,0], [a,0]], color: lineColor, weight: w });
              lines.push({ puntos: [[0,-a], [0,a]], color: lineColor, weight: w });
            }
            else if (formaElegida === 'rectangulo_doble') {
              resFinal = 16; // 8 en el izq, 8 en el der
              const a = 6;
              // Contorno y division
              lines.push({ puntos: [[-a*2,-a], [a*2,-a], [a*2,a], [-a*2,a], [-a*2,-a]], color: lineColor, weight: w });
              lines.push({ puntos: [[0,-a], [0,a]], color: lineColor, weight: w });
              // X izquierda y X derecha
              lines.push({ puntos: [[-a*2,-a], [0,a]], color: lineColor, weight: w });
              lines.push({ puntos: [[-a*2,a], [0,-a]], color: lineColor, weight: w });
              lines.push({ puntos: [[0,-a], [a*2,a]], color: lineColor, weight: w });
              lines.push({ puntos: [[0,a], [a*2,-a]], color: lineColor, weight: w });
            }
            else if (formaElegida === 'trapecio') {
              resFinal = 8;
              const bM = 8, bm = 4, h = 6;
              lines.push({ puntos: [[-bM, -h/2], [bM, -h/2], [bm, h/2], [-bm, h/2], [-bM, -h/2]], color: lineColor, weight: w });
              lines.push({ puntos: [[-bM, -h/2], [bm, h/2]], color: lineColor, weight: w });
              lines.push({ puntos: [[bM, -h/2], [-bm, h/2]], color: lineColor, weight: w });
            }
            else if (formaElegida === 'estrella') {
              resFinal = 10;
              const R = 10, pE: [number, number][] = [];
              for(let i=0; i<5; i++) pE.push([R * Math.cos(Math.PI/2 + i*(4*Math.PI/5)), R * Math.sin(Math.PI/2 + i*(4*Math.PI/5))]);
              lines.push({ puntos: [...pE, pE[0]], color: lineColor, weight: w });
            }
          }
          // ==========================================
          // 🟩 2. CUADRILÁTEROS
          // ==========================================
          else if (tipo === 'cuad') {
            const cols = Math.floor(Math.random() * 4) + 3; 
            const rows = Math.floor(Math.random() * 3) + 2; 
            resFinal = ((cols * (cols + 1)) / 2) * ((rows * (rows + 1)) / 2);
            
            const skew = id.includes('experto') ? 0.5 : 0; 
            const wl = 16, hl = 10, dx = wl/cols, dy = hl/rows;
            const getPt = (c: number, r: number): [number, number] => [-wl/2 + c*dx + (-hl/2 + r*dy)*skew, -hl/2 + r*dy];

            const colorC = "#8b5cf6"; 
            lines.push({ puntos: [getPt(0,0), getPt(cols,0), getPt(cols,rows), getPt(0,rows), getPt(0,0)], color: colorC, weight: 2 });
            for(let i=1; i<cols; i++) lines.push({ puntos: [getPt(i,0), getPt(i,rows)], color: colorC, weight: 2 });
            for(let j=1; j<rows; j++) lines.push({ puntos: [getPt(0,j), getPt(cols,j)], color: colorC, weight: 2 });
          }
          // ==========================================
          // 🍕 3. SECTORES CIRCULARES
          // ==========================================
          else if (tipo === 'sec') {
            const n = Math.floor(Math.random() * 5) + 4; 
            const m = Math.floor(Math.random() * 3) + 2; 
            resFinal = m * ((n * (n + 1)) / 2);

            const R = 12, angMin = Math.PI/6, angMax = 5*Math.PI/6, step = (angMax - angMin)/n;
            const colorS = "#f97316"; 

            for(let j=1; j<=m; j++) {
              const rAct = (R/m) * j;
              const arcoPts: [number, number][] = [];
              for(let a = angMin; a <= angMax; a += 0.05) arcoPts.push([rAct * Math.cos(a), rAct * Math.sin(a)]);
              arcoPts.push([rAct * Math.cos(angMax), rAct * Math.sin(angMax)]); // Cierre perfecto
              lines.push({ puntos: arcoPts, color: colorS, weight: 2 });
            }
            for(let i=0; i<=n; i++) {
              lines.push({ puntos: [[0,0], [R * Math.cos(angMin + i * step), R * Math.sin(angMin + i * step)]], color: colorS, weight: 2 });
            }
          }
         
         
         // ==========================================
          // 📦 FAMILIA 4: CUBOS ISOMÉTRICOS (DISEÑOS COMPLEJOS Y VOLUMÉTRICOS)
          // ==========================================
          else if (tipo === 'cub') {
            const sc = 1.8; 
            const proj = (x: number, y: number, z: number): [number, number] => {
                return [(x - y) * 0.866 * sc, (-x * 0.5 - y * 0.5 + z) * sc];
            };

            // 🔥 CATÁLOGO MAESTRO DE DISEÑOS ARQUITECTÓNICOS (Blueprints) 🔥
            const designs = {
                geometric: {
                    cross: [[0,1,0],[1,1,1],[0,1,0]],
                    u:     [[1,0,1],[1,0,1],[1,1,1]],
                    t:     [[1,1,1],[0,1,0],[0,1,0]],
                    square: [[1,1],[1,1]]
                },
                letters: {
                    f: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
                    l: [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]], // ✅ Ahora está aquí
                    s: [[1,1,1,1],[1,0,0,0],[1,1,1,1],[0,0,0,1],[1,1,1,1]],
                    e: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,1,1,1]],
                    plus:[[0,2,0],[2,3,2],[0,2,0]]
                },
                volume: {
                    // Volumetric Pyramid (Step Pyramid)
                    pyramid: [
                        [1,1,1,1,1],
                        [1,2,2,2,1],
                        [1,2,3,2,1],
                        [1,2,2,2,1],
                        [1,1,1,1,1]
                    ],
                    // Volumetric ZigZag/Spiral Complex Stair
                    zigzag: [
                        [3,2,1,0],
                        [2,1,0,1],
                        [1,0,1,2],
                        [0,1,2,3]
                    ],
                    // Complex City/Castle with Towers
                    castle: [
                        [3,1,1,3],
                        [1,1,1,1],
                        [1,2,2,1],
                        [3,1,1,3]
                    ]
                }
            };

            // 1. SELECCIÓN DE MATRIZ BASE (Blueprint)
            let matrix: number[][] = [];
            const rnd = Math.random();

            // Lógica de complejidad paramétrica
            if (id.includes('basico')) {
                // Letras simples (F, L, U), achatadas (H:1-2). Total 3-9 cubos.
                if (rnd < 0.4) matrix = Math.random()>0.5 ? designs.letters.f : designs.letters.l;
                else if (rnd < 0.7) matrix = designs.geometric.u;
                else matrix = [[2,1,0],[2,1,0],[2,1,0]]; // Escalera simple
                // Aplanar: randomize a alturas 1 o 2 max.
                matrix = matrix.map(r => r.map(v => v > 0 ? (Math.random()>0.5?2:1) : 0));
            } 
            else if (id.includes('intermedio')) {
                // Matrices volumetricas (Piramide, Letras complejas S,E), alturas 1-3. Total 10-20.
                if (rnd < 0.4) {
                    matrix = designs.volume.pyramid;
                    matrix = matrix.map(r => r.map(v => v > 2 ? 2 : v)); // Flatten slightly
                } else {
                    matrix = Math.random()>0.5 ? designs.letters.s : designs.letters.e;
                    matrix = matrix.map(r => r.map(v => v > 0 ? (Math.floor(Math.random()*3)+1) : 0)); // Alturas 1-3
                }
            }
            else { // AVANZADO / EXPERTO
                // Arquitectura compleja multi-nivel (Ciudad, Escaleras espirales, Piramide con Torres). Total 20-40+.
                if (rnd < 0.4) { // Pyramid Base + Towers
                    matrix = designs.volume.pyramid;
                    // Exageramos paramétricamente las torres
                    matrix = matrix.map(r => r.map(v => v > 1 ? (v + (Math.random()>0.7?2:1)) : v));
                } else if (rnd < 0.8) { // Volumetric City/Castle + Complex Pillars
                    matrix = designs.volume.castle;
                    // Exageramos paramétricamente las torres randomly +2 o +3
                    matrix = matrix.map(r => r.map(v => v > 1 ? (v + Math.floor(Math.random()*3)+1) : v));
                } else { // Dynamic Stairs Complex
                    matrix = designs.volume.zigzag;
                }
                // Asegurar base conectada para que no floten
                matrix = matrix.map(r => r.map(v => v > 0 ? v : (Math.random()>0.97?1:0)));
            }

            const maxX = matrix.length;
            const maxY = matrix[0].length;

            let maxZ = 0;
            for(let x=0; x<maxX; x++) {
              for(let y=0; y<maxY; y++) {
                resFinal += matrix[x][y];
                if (matrix[x][y] > maxZ) maxZ = matrix[x][y];
              }
            }

            // Colores de sombreado (Mantenemos técnica Z-Oclusión)
            const cTop = "#ffffff", cLeft = "#f1f5f9", cRight = "#cbd5e1", bColor = "#1e293b";

            // 🔥 ALGORITMO DEL PINTOR (Oclusión Sólida)
            for(let z = 0; z < maxZ; z++) {
                for(let x = 0; x < maxX; x++) {
                    for(let y = 0; y < maxY; y++) {
                        if (z < matrix[x][y]) {
                            
                            // Vértices frontales
                            const vFB = proj(x+1, y+1, z), vRB = proj(x+1, y, z), vLB = proj(x, y+1, z);
                            const vFT = proj(x+1, y+1, z+1), vRT = proj(x+1, y, z+1), vLT = proj(x, y+1, z+1), vBT = proj(x, y, z+1);

                            // Caras frontales sólidas
                            const pT: [number, number][]   = [vFT, vRT, vBT, vLT];
                            const pR: [number, number][] = [vFT, vFB, vRB, vRT];
                            const pL: [number, number][]  = [vFT, vLT, vLB, vFB];

                            polys3D.push({ puntos: pR, color: cRight, borde: bColor });
                            polys3D.push({ puntos: pL, color: cLeft, borde: bColor });
                            polys3D.push({ puntos: pT, color: cTop, borde: bColor });
                        }
                    }
                }
            }
          }

          v.total = resFinal; v.respuesta = resFinal;

          return {
            valores: v, respuesta: resFinal, tipo_render: 'geometry_mafs',
            data: {
              type: 'geometry_mafs', theme: 'area_triangulo',
              puntos: [], 
              poligonosExtra: polys3D, 
              esArea: false, etiquetas: [],
              lineasExtra: lines, arcos: [],
              respuestaSobreescrita: resFinal
            }
          };
        }




      }
    }
    return null;
  }
} 
