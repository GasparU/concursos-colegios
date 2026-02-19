import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as math from 'mathjs';
import * as plantillas5to from './plantillas/plantillas-5to.json';
// import * as plantillas6to from './plantillas/plantillas-6to.json';
// Importa más grados si los tienes


import { QuintoGradoService } from './grados/quinto.grado.service';
import { SextoGradoService } from './grados/sexto.grado.service';
import { BaseGradoService } from './grados/base.grado.service';
import { denominador, MCD, MCM, numerador } from './utils/math-helpers';

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
          } else if (def.type === 'string' && def.opciones) {
            const opciones = def.opciones;
            valores[varName] =
              opciones[Math.floor(Math.random() * opciones.length)];
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
        };

        for (const rel of plantilla.relaciones) {
          math.evaluate(rel, scope);
        }

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
        const enunciadoFinal = gradoService.construirEnunciado(
          plantilla,
          valores,
          scope,
          respuesta,
        );

        // 6. Procesar respuesta (solo se pasan respuesta y formato)
        const respuestaFinal = gradoService.procesarRespuesta(
          respuesta,
          plantilla.formato_respuesta,
        );

        return {
          plantillaId: plantilla.id,
          tema: plantilla.tema,
          enunciado: enunciadoFinal,
          valores,
          respuesta: respuestaFinal,
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
}
