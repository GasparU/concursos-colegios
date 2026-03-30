import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as math from 'mathjs';
import * as plantillas5to from './plantillas/plantillas-5to.json';
import * as plantillas5toGeoEst from './plantillas/plantillas-5to-geometria-estadistica.json';

import { QuintoGradoService } from './grados/quinto.grado.service';
import { SextoGradoService } from './grados/sexto.grado.service';
import { BaseGradoService } from './grados/base.grado.service';
import { denominador, MCD, MCM, numerador } from './utils/math-helpers';
import { TEMARIO_MAESTRO } from 'src/temario/temario.db';


export interface VariableDef {
  type: 'number' | 'string';
  min?: number;
  max?: number;
  step?: number;
  opciones?: string[];
}

export interface Plantilla {
  id: string;
  tema: string;
  subtipo?: string;
  grado: string;
  etapa: string[];
  dificultad: string[];
  bidireccional: boolean;
  variables: Record<string, VariableDef>;
  relaciones: string[];
  restricciones?: string[];
  incognita_directa: string | string[];
  incognitas_inversa?: string[];
  formato_respuesta: any;
  metadata: any;
  enunciado: string;
}

@Injectable()
export class ParametricGeneratorService {
  private plantillas: Plantilla[] = [
    ...((plantillas5to as any).default || plantillas5to),
    ...((plantillas5toGeoEst as any).default || plantillas5toGeoEst),
  ];

  constructor(
    private readonly quintoGradoService: QuintoGradoService,
    private readonly sextoGradoService: SextoGradoService,
  ) {}

  obtenerPlantillas(filtro?: { grado?: string; tema?: string }): Plantilla[] {
    let resultado = this.plantillas;
    if (filtro?.grado)
      resultado = resultado.filter((p) => p.grado === filtro.grado);
    if (filtro?.tema)
      resultado = resultado.filter((p) => p.tema === filtro.tema);
    return resultado;
  }

  obtenerPlantillaPorId(id: string): Plantilla { 
    const plantilla = this.plantillas.find((p) => p.id === id);
    if (!plantilla)
      throw new NotFoundException(`Plantilla ${id} no encontrada`);
    return plantilla;
  }


// 🔥 DICCIONARIO MAESTRO (CONAMAT 5TO GRADO)
  private readonly MAPA_TEMAS: Record<string, string[]> = {
    // Geometría
    "Segmentos y ángulos (clasificación)": ["segmentos", "angulos_radiales", "rectas_secantes"],
    "Segmentos": ["segmentos"],
    "Ángulos y clasificación": ["angulos_radiales", "angulos_teoricos"],
    "Rectas paralelas y perpendiculares": ["paralelas_ecuaciones", "paralelas_serrucho", "paralelas_abanico"],
    "Perímetro y área de triángulos": ["area_triangulo", "triangulo_perimetro"], // 🎯 AQUÍ: Solo triángulos
    "Área de triángulos y cuadriláteros": ["area_triangulo", "rectangulo_area", "area_rombo", "area_trapecio", "area_paralelogramo"],
    "Área de regiones sombreadas": ["area_sombreada"],
    "Circunferencia básica": ["angulos_circunferencia", "propiedades_circunferencia", "segmentos_circunferencia"],
    "Sólidos: cubo, prisma regular": ["volumen_prisma", "volumen_prisma_triangular", "volumen_piramide"],
    "Teorema de Pitágoras": ["teorema_pitagoras"],
    "Teorema de Thales": ["thales"],
    
    // Estadística
    "Gráfico de barras y pictogramas": ["grafico_barras", "pictograma"],
    "Tablas de frecuencia": ["tabla_frecuencias", "estadistica_frecuencias_01", "frecuencia_algebraica"],
    "Probabilidad básica": ["probabilidad_basica"],
    
    // Razonamiento Matemático (RM)
    "Conteo de figuras": ["conteo_figuras"],
    "Distribuciones gráficas": ["distribucion_grafica"],
    "Criptoaritmética": ["criptoaritmetica"]
  };

 
  // 1. ESTA ES LA FUNCIÓN DE ENTRADA (Conecta con seleccionarPorScore)
  buscarPlantillaPorCriterios(temaConamat: string, grado: string, dificultad: string, variacion: number = 0): Plantilla {
    const normalize = (str: string) => 
      str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[:.,\-]/g, " ").replace(/\s+/g, " ").trim() || "";
    
    const safeGrado = normalize(grado) || "5to";
    let difBuscada = (dificultad || "").toLowerCase().trim();
    
    // 🔥 EL HACK DE ORDEN MIXTO (20% Básico, 50% Inter, 30% Avanzado)
    if (difBuscada === "mixto" || difBuscada === "concurso") {
        const v = variacion % 10;
        if (v < 2) difBuscada = "basico";           
        else if (v < 7) difBuscada = "intermedio";  
        else difBuscada = "avanzado";               
    }
    
    // 1. Obtenemos TODAS las plantillas del grado para tener un "Plan B"
    const plantillasDelGrado = this.plantillas.filter(p => normalize(p.grado) === safeGrado);
    
    // 2. Filtramos solo las que coinciden con la dificultad estricta
    const plantillasDificultadEstricta = plantillasDelGrado.filter(p => 
      // 🔥 CIRUGÍA: Escudo anti-nulos por si alguna plantilla del JSON no tiene el campo "dificultad"
      (p.dificultad || []).some(d => normalize(d) === difBuscada)
    );

    try {
        // 🔥 INTENTO 1: Buscar el tema con la dificultad perfecta
        return this.seleccionarPorScore(plantillasDificultadEstricta, temaConamat, safeGrado, variacion);
    } catch (error) {
        // 🚨 SALVAVIDAS ANTI-CRASH: Si falla porque ese tema no tiene esa dificultad específica,
        // relajamos el filtro y usamos TODAS las plantillas del grado para no enviarlo a la IA
        console.warn(`⚠️ Salvavidas activado: El tema no tiene dificultad "${difBuscada}". Rescatando plantilla original...`);
        return this.seleccionarPorScore(plantillasDelGrado, temaConamat, safeGrado, variacion);
    }
  }

  // 2. TU FUNCIÓN ACTUALIZADA (A prueba de balas y conectada)
  private seleccionarPorScore(candidatas: any[], temaUsuario: string, gradoUsuario: string, variacion: number = 0): any {
  const normalize = (str: string) => 
    str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[:.,\-]/g, " ").replace(/\s+/g, " ").trim() || "";

  const temaUsrNorm = normalize(temaUsuario);
  let poolValido: any[] = [];

  // 1. INTENTO POR DICCIONARIO
  const temasDelGrado = (TEMARIO_MAESTRO as any)[gradoUsuario] || [];
  const temaEncontrado = temasDelGrado.find((t: any) => normalize(t.nombre) === temaUsrNorm);

  if (temaEncontrado && temaEncontrado.subtipos?.length > 0) {
    poolValido = candidatas.filter(p => {
      const subtiposPlantilla = Array.isArray(p.subtipo) ? p.subtipo : [p.subtipo];
      return subtiposPlantilla.some((sub: string) => 
        temaEncontrado.subtipos.map(normalize).includes(normalize(sub))
      );
    });
  }

  // 2. FALLBACK CRÍTICO: Si el diccionario falló o no dio resultados, buscar por NOMBRE DE TEMA directo en el JSON
  if (poolValido.length === 0) {
    console.warn(`⚠️ Diccionario falló para "${temaUsuario}". Buscando match directo en JSON...`);
    poolValido = candidatas.filter(p => {
      const temaJSON = normalize(p.tema);
      // 🔥 Match total o parcial
      return temaJSON === temaUsrNorm || temaJSON.includes(temaUsrNorm) || temaUsrNorm.includes(temaJSON);
    });
  }

  // 3. SELECCIÓN FINAL O ERROR
  if (poolValido.length === 0) {
    console.error(`❌ [ERROR FINAL] No hay plantillas para: "${temaUsuario}"`);
    throw new Error("TEMA_IA_PURA");
  }

  poolValido.sort((a, b) => a.id.localeCompare(b.id));
  const mejorMatch = poolValido[variacion % poolValido.length];
  console.log(`✅ [EXITO] Plantilla detectada: ${mejorMatch.id}`);
  return mejorMatch;
}

  // 🔥 ALGORITMO DE DISTANCIA (Detecta errores de tipeo como 'notavle' -> 'notable')
  private levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // Eliminación
          matrix[i][j - 1] + 1,      // Inserción
          matrix[i - 1][j - 1] + cost // Sustitución
        );
      }
    }
    return matrix[a.length][b.length];
  }

  private getGradoService(grado: string): BaseGradoService {
    switch (grado) {
      case '5to':
        return this.quintoGradoService;
      case '6to':
        return this.sextoGradoService;
      default:
        throw new BadRequestException(`Grado ${grado} no soportado`);
    }
  }

  generarProblema(plantillaId: string, valoresFijos: Record<string, any> = {}) {
    const plantilla = this.obtenerPlantillaPorId(plantillaId);
    console.log(
      '📦 [Service] Plantilla encontrada:',
      plantilla.id,
      plantilla.tema,
    );
    const gradoService = this.getGradoService(plantilla.grado);
    const maxIntentos = 200;

    for (let intento = 0; intento < maxIntentos; intento++) {
      try {
        // 1. Generar valores aleatorios para las variables no fijas
        const valores: Record<string, any> = { ...valoresFijos };
        for (const [varName, def] of Object.entries(plantilla.variables)) {
          if (valores[varName] !== undefined) continue;
          if (def.type === 'number') {
            valores[varName] = this.generarNumero(def);
          } else if (def.type === 'string' || (def as any).type === 'list') {
              const opciones = def.opciones || (def as any).values || [];
              valores[varName] = opciones.length > 0 
                ? opciones[Math.floor(Math.random() * opciones.length)] 
                : '';
          } else {
            valores[varName] = '';
          }
        }

        // 2. Evaluar relaciones
        const scope = {
          ...valores,
          MCM,
          MCD,
          numerador,
          denominador,
          floor: Math.floor,
          ceil: Math.ceil,
          round: Math.round,
          abs: Math.abs,
          str: (...args: any[]) => args.join('').replace(/\s*\+\s*\-/g, ' - ').replace(/\+\-/g, '-'),
          letra: (n: number) => {
              const idx = (Math.round(n) - 1) % 27;
              return 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'[idx < 0 ? idx + 27 : idx];
          },
        };

        for (const rel of plantilla.relaciones) {
          math.evaluate(rel, scope);
        }

        Object.assign(valores, scope);

        // 3. Verificar restricciones
        if (plantilla.restricciones && plantilla.restricciones.length > 0) {
          for (const rest of plantilla.restricciones) {
            const result = math.evaluate(rest, scope);
            if (!result) {
              throw new Error('Restricción no cumplida');
            }
          }
        }

        // 4. Obtener la respuesta (incógnita) desde el scope
        let respuesta: any;
        const incognita = plantilla.incognita_directa;
        if (Array.isArray(incognita)) {
          respuesta = {};
          for (const inc of incognita) {
            respuesta[inc] = scope[inc];
          }
        } else {
          respuesta = scope[incognita];
        }
        

        // 5. Construir enunciado
        let enunciadoFinal = gradoService.construirEnunciado(
          plantilla,
          valores,
          scope,
          respuesta,
        );

        enunciadoFinal = this.cleanAlgebraicExpression(enunciadoFinal);
        // 6. Generar visual_data (si aplica)
        const visualData = gradoService.generarVisualData(plantilla, valores);
        

        // 7. Procesar la respuesta según el formato
        let respuestaFinal = gradoService.procesarRespuesta(
          respuesta,
          plantilla.formato_respuesta,
        );
        

        // 🔥 FIX CRÍTICO: Si el visualData calculó su propia respuesta (como en Triángulos), la sobreescribimos.
        const sobreescrita = (visualData as any)?.respuestaSobreescrita ?? (visualData as any)?.data?.respuestaSobreescrita;

          if (sobreescrita !== undefined) {
            // 2. Si la encontramos, actualizamos la respuesta final del problema
            respuestaFinal = sobreescrita;

            // 3. Limpiamos para no ensuciar el JSON que va al frontend
            if ((visualData as any).respuestaSobreescrita !== undefined) delete (visualData as any).respuestaSobreescrita;
            if ((visualData as any).data?.respuestaSobreescrita !== undefined) delete (visualData as any).data.respuestaSobreescrita;
          }

          // 🔥🔥🔥 INICIO DEL BYPASS QUIRÚRGICO CONAMAT 🔥🔥🔥
        if (visualData && (visualData as any).opcionesSobreescritas) {
            console.log(`🏆 [OLIMPIADA] Bypass activado. Saltando escudo y generador genérico.`);
            return {
              plantillaId: plantilla.id,
              tema: plantilla.tema,
              enunciado: (visualData as any).enunciadoSobreescrito || enunciadoFinal,
              valores,
              respuesta: String(respuestaFinal),
              correct_answer: String(respuestaFinal), 
              correctAnswer: String(respuestaFinal),  
              options: (visualData as any).opcionesSobreescritas, 
              visual_data: (visualData as any).visualData || null,
              metadata: plantilla.metadata,
            };
        }

        // =====================================================================
        // 🔥 ESCUDO ANTI-CRASH INTELIGENTE (0 decimales para Geo, Redondeo para Aritmética)
        // =====================================================================
        const esGeometriaOCripto = plantilla.id.startsWith('geo_') || plantilla.id.startsWith('rm_');

        const esAlgebraTexto = typeof respuestaFinal === 'string';
        
        if (esGeometriaOCripto && !esAlgebraTexto) { 
            let rechazar = false;
            const resNum = Number(respuestaFinal);
            if (!isNaN(resNum) && !Number.isInteger(resNum)) rechazar = true;

            for (const key in valores) {
                const val = valores[key];
                if (typeof val === 'number' && !Number.isInteger(val)) rechazar = true;
            }

            if (rechazar) {
                throw new Error('Geometría requiere números enteros. Recalculando...');
            }
        } if (!esAlgebraTexto) {
            // REGLA SUAVE: Aritmética permite decimales, pero los REDONDEAMOS para no crashear la UI
            const redondear = (num: any) => {
                if (typeof num === 'number' && !Number.isInteger(num)) {
                    return Math.round(num * 100) / 100; // Corta a 2 decimales máximo
                }
                return num;
            };

            const resNum = Number(respuestaFinal);
            if (!isNaN(resNum)) respuestaFinal = redondear(resNum);

            for (const key in valores) {
                valores[key] = redondear(valores[key]);
            }
        }

        // 🔥 ESCUDO ANTI-NaN Y NÚMEROS INFINITOS
        const numeroValidado = Number(respuestaFinal);
        if (respuestaFinal === null || respuestaFinal === undefined) {
         throw new Error('Cálculo nulo. Reintentando...');
        }

        if (typeof respuestaFinal === 'number') {
          if (Number.isNaN(respuestaFinal) || !isFinite(respuestaFinal)) {
            throw new Error('Cálculo inválido (NaN o Infinito). Reintentando...');
          }
        }
        
        // (Borramos el escudo opcional de decimales feos porque la función 'redondear' de arriba ya hace eso)

        if (visualData && (visualData as any).enunciadoForzado) {
          enunciadoFinal = (visualData as any).enunciadoForzado;
          delete (visualData as any).enunciadoForzado;
        }

        console.log(`[Intento ${intento}] Valores generados:`, valores);
        
        
        // 🔥 CIRUGÍA 2: GENERADOR INTELIGENTE DE ALTERNATIVAS CON LATEX Y LETRA VERDE
        let opcionesMap: Record<string, string> = {};
        const subtipo = plantilla.subtipo || '';
        const resStr = String(respuestaFinal);
        let distractores: string[] = [];

        try {
            if (subtipo === 'sucesion_alfabetica') {
                const abc = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
                const idx = abc.indexOf(resStr);
                if (idx !== -1) {
                    const getL = (i: number) => abc[(i + 54) % 27];
                    distractores = [getL(idx + 1), getL(idx - 1), getL(idx + 2), getL(idx - 2)];
                }
            } else if (subtipo === 'sucesion_alfanumerica') {
                const match = resStr.match(/(\d+)([A-ZÑ])/);
                if (match) {
                    const num = parseInt(match[1]);
                    const char = match[2];
                    const abc = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
                    const cIdx = abc.indexOf(char);
                    const getL = (i: number) => abc[(i + 54) % 27];
                    distractores = [`${num + 1}${char}`, `${num - 1}${getL(cIdx + 1)}`, `${num}${getL(cIdx + 1)}`, `${num + 2}${getL(cIdx - 1)}`];
                }
            } else if (subtipo === 'sucesion_algebraica') {
                const r = valores.r || 2;
                const c = valores.c || 1;
                // 🔥 Inyectamos los $ para que ReactMarkdown los pinte como fórmulas
                const fmt = (coef: number, cte: number) => `$${coef}n ${cte < 0 ? '-' : '+'} ${Math.abs(cte)}$`;
                distractores = [fmt(r+1, c), fmt(r, c+1), fmt(r-1, c), fmt(r, c-1)];
            } else if (subtipo === 'sucesion_cuadratica') {
                const A = valores.A || 1;
                const B = valores.B || 1;
                const C = valores.C || 1;
                // 🔥 Inyectamos los $ para los cuadrados
                const fmtC = (a: number, b: number, c: number) => `$${a}n^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}n ${c < 0 ? '-' : '+'} ${Math.abs(c)}$`;
                distractores = [fmtC(A+1, B, C), fmtC(A, B+1, C), fmtC(A, B, C+1), fmtC(A, B-1, C)];
            } else {
                const num = Number(resStr);
                if (!isNaN(num)) {
                    const diff = (num > 20) ? 2 : 1;
                    distractores = [String(num + diff), String(num - diff), String(num + diff * 2), String(num - diff * 2)];
                }
            }
        } catch(e) { console.error("Error generando distractores", e); }

        let opcionesArray = [...new Set([resStr, ...distractores])].filter(Boolean);
        let saltos = 1;
        while (opcionesArray.length < 5) {
            if (!isNaN(Number(resStr))) opcionesArray.push(String(Number(resStr) + saltos * 3));
            else opcionesArray.push(`N.A. ${saltos}`);
            opcionesArray = [...new Set(opcionesArray)];
            saltos++;
        }
        opcionesArray = opcionesArray.slice(0, 5).sort(() => Math.random() - 0.5);
        const letras = ['A', 'B', 'C', 'D', 'E'];
        let letraCorrecta = 'A'; // Valor por defecto de seguridad
        
        opcionesArray.forEach((op, i) => {
            opcionesMap[letras[i]] = op;
            // 🔥 VERIFICACIÓN CRÍTICA: Encontramos en qué letra cayó la respuesta correcta
            if (op === resStr) {
                letraCorrecta = letras[i]; 
            }
        });

        console.log(`[Intento ${intento}] Respuesta correcta: ${resStr} -> Letra: ${letraCorrecta}`);

        return {
          plantillaId: plantilla.id,
          tema: plantilla.tema,
          enunciado: enunciadoFinal,
          valores,
          respuesta: resStr,
          correct_answer: letraCorrecta, // 🔥 La letra exacta para pintar verde (React)
          correctAnswer: letraCorrecta,  // 🔥 Respaldo por si acaso
          options: opcionesMap, 
          visual_data: visualData,
          metadata: plantilla.metadata,
        };
      } catch (error) {
        if (intento === maxIntentos - 1) {
          throw new BadRequestException(
            'No se pudo generar un problema que cumpla las restricciones',
          );
        }
      }
    }
    
    throw new BadRequestException('Error inesperado en la generación');
  }
  

  private generarNumero(def: VariableDef): number {
    const { min = 1, max = 10, step = 1 } = def;
    const steps = Math.floor((max - min) / step);
    let valor = min + Math.floor(Math.random() * (steps + 1)) * step;
    if (step < 1 && step.toString().includes('.')) {
      const decimales = step.toString().split('.')[1].length;
      valor = parseFloat(valor.toFixed(decimales));
    }
    return valor;
  }

  private cleanAlgebraicExpression(text: string): string {
    return text
      // 🔥 Borra el 1 si está pegado a letra o LaTeX: $1m, +1n, (1x, =1a
      .replace(/([$+\-\s(=])1(?=[a-zA-Z\\])/g, '$1')
      // 🔥 Caso especial: inicio del string o bloque LaTeX $1x -> $x
      .replace(/^1(?=[a-zA-Z\\])/, '')
      .replace(/\$1(?=[a-zA-Z\\])/g, '$')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 🔥 MÉTODO SUPREMO PARA EXÁMENES MIXTOS PERFECTOS (20% - 50% - 30%)
  generarExamenLote(temaConamat: string, grado: string, dificultad: string, cantidad: number) {
    const problemas: any[] = [];

    if (dificultad.toLowerCase() === 'mixto') {
      // 1. Calculamos cuotas exactas con redondeo
      const cantBasico = Math.round(cantidad * 0.20);
      const cantInter = Math.round(cantidad * 0.50);
      
      // El avanzado absorbe el resto para que la suma siempre dé la cantidad exacta pedida
      const cantAvanz = cantidad - cantBasico - cantInter; 

      console.log(`🧠 Generando Mixto [Total: ${cantidad}]: Básico(${cantBasico}) | Intermedio(${cantInter}) | Avanzado(${cantAvanz})`);

      // 2. Generamos en ORDEN ESTRICTO
      for (let i = 0; i < cantBasico; i++) {
        const p = this.buscarPlantillaPorCriterios(temaConamat, grado, 'basico', i);
        problemas.push(this.generarProblema(p.id));
      }
      for (let i = 0; i < cantInter; i++) {
        const p = this.buscarPlantillaPorCriterios(temaConamat, grado, 'intermedio', i);
        problemas.push(this.generarProblema(p.id));
      }
      for (let i = 0; i < cantAvanz; i++) {
        const p = this.buscarPlantillaPorCriterios(temaConamat, grado, 'avanzado', i);
        problemas.push(this.generarProblema(p.id));
      }
    } else {
      // Comportamiento normal si elige una sola dificultad (ej. Puros Expertos)
      for (let i = 0; i < cantidad; i++) {
        const p = this.buscarPlantillaPorCriterios(temaConamat, grado, dificultad, i);
        problemas.push(this.generarProblema(p.id));
      }
    }

    // 3. Imprimimos el orden (1, 2, 3...) para que la UI lo respete
    return problemas.map((p, index) => ({ ...p, order: index + 1 }));
  }
}
