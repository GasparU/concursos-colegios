import {
  Controller,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AiGeneratorService } from './ai-generator.service';

@Controller('ai')
export class AiGeneratorController {
  private readonly logger = new Logger('AiGeneratorController');

  constructor(private readonly aiService: AiGeneratorService) {}

  // 🔥 CAMBIADO: De 'problem' a 'generar' para coincidir con el Frontend
  @Post('generar')
  async createProblem(@Body() body: any) {
    // 🎯 MAPEADO INTELIGENTE: Aceptamos tanto inglés como español
    const rawTopics = body.topics || [body.topic];
    const topics = Array.isArray(rawTopics) ? rawTopics : [rawTopics];
    const grade = body.grade || body.grado; // <--- Soporta ambos
    const difficulty = body.difficulty || body.dificultad; // <--- Soporta ambos
    const model = body.model;
    const quantity = body.quantity || 1;
    const styleConstraint = body.styleConstraint;
    const stage = body.stage || ""; // Evitamos el undefined

    this.logger.log(`📥 Multi-Topic Request: [${topics.join(', ')}] | Cantidad: ${quantity}`);

    const promises: Promise<any>[] = [];

    for (let i = 0; i < quantity; i++) {
      const currentTopic = topics[i % topics.length];
      promises.push(
        this.aiService.generateProblem(
          currentTopic,
          grade,
          stage,
          difficulty,
          model,
          styleConstraint,
        )
        .catch(e => {
          this.logger.error(`Error en generación IA: ${e.message}`);
          return null;
        })
      );
    }

    const results = await Promise.all(promises);
    const validResults = results.filter((r) => r && r?.success === true);

    if (validResults.length > 0) {
      // 🚀 Para que el Frontend no sufra, devolvemos el primer resultado 
      // si quantity es 1 (que es lo que pide el streaming)
      if (quantity === 1) {
        return validResults[0].data; 
      }
      return { data: validResults.map(r => r.data) };
    } else {
      throw new HttpException(
        'La IA no pudo generar el problema.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Post('restyle')
  async restyleText(@Body() body: { baseText: string; topic: string; grade: string; model?: string; isSimulacro?: boolean }) {
    const { baseText, topic, grade, model, isSimulacro } = body;

    if (!baseText) {
      throw new BadRequestException('El texto base es obligatorio.');
    }

    try {
      const styledText = await this.aiService.restyleCreativeText(baseText, topic, grade, model, isSimulacro);
      return { styledText };
    } catch (error: any) {
      this.logger.error(`Error en restyle: ${error?.message || 'Error desconocido'}`);
      return { styledText: baseText }; 
    }
  }
}