import { Injectable } from '@nestjs/common';
import { BaseGradoService } from './base.grado.service';
import { Plantilla } from '../parametric-generator.service';

@Injectable()
export class SextoGradoService extends BaseGradoService {
  construirEnunciado(
    plantilla: Plantilla,
    valores: Record<string, any>,
    scope: Record<string, any>,
    respuesta: any,
  ): string {
    // Por ahora, usar la misma lógica genérica del base (reemplazo de placeholders)
    let enunciado = plantilla.enunciado;
    for (const key of Object.keys(plantilla.variables)) {
      const val = valores[key];
      if (val !== undefined) {
        const strVal =
          typeof val === 'number' ? this.formatNum(val) : String(val);
        enunciado = enunciado.replace(new RegExp(`{${key}}`, 'g'), strVal);
      }
    }
    return enunciado;
  }
}
