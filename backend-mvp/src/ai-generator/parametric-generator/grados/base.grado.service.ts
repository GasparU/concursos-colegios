import { Injectable } from '@nestjs/common';
import { Plantilla } from '../parametric-generator.service';
import { formatNum, formatRespuesta } from '../utils/formatters';

@Injectable()
export abstract class BaseGradoService {
  protected formatNum = formatNum; // ✅ solo una vez

  abstract construirEnunciado(
    plantilla: Plantilla,
    valores: Record<string, any>,
    scope: Record<string, any>,
    respuesta: any,
  ): string;

  procesarRespuesta(respuesta: any, formato: any): any {
    return formatRespuesta(respuesta, formato);
  }
}
