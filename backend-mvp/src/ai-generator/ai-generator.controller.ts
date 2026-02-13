import {
  Controller,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AiGeneratorService } from './ai-generator.service';

@Controller('ai')
export class AiGeneratorController {
    private readonly logger = new Logger(AiGeneratorService.name);

    constructor(private readonly aiService: AiGeneratorService) { }

    @Post('problem')
    async createProblem(@Body() body: any) {
        // 🔥 AÑADIDO: Extraemos 'styleConstraint' del body
        const { topic, grade, stage, difficulty, model, quantity = 1, styleConstraint } = body;

        this.logger.log(`📥 REQUEST RECIBIDO: ${JSON.stringify(body)}`);

        const promises: Promise<any>[] = [];

        // 🔥 OJO: Si quantity > 1 y usas el loop del controller, la variedad depende de que el frontend mande estilos distintos
        // Si el frontend manda 1 a 1 (como configuramos en el 'streaming'), esto funciona perfecto.
        for (let i = 0; i < quantity; i++) {
            // await new Promise(r => setTimeout(r, 100 * i)); // Delay opcional

            promises.push(
                this.aiService.generateProblem(
                    topic,
                    grade,
                    stage,
                    difficulty,
                    model, // forceModel
                    styleConstraint // <--- 🔥 IMPORTANTE: Pasamos el estilo al servicio
                )
                    .catch(e => {
                        this.logger.error(`Error en iteración ${i}: ${e.message}`);
                        return null;
                    })
            );
        }

        const results = await Promise.all(promises);
        const validResults = results.filter((r) => r && r?.success === true);

        if (validResults.length > 0) {
            this.logger.log(`✅ Enviando ${validResults.length} problema(s) generado(s).`);
            // Retornamos el array de datas. El frontend ya sabe manejar arrays.
            return { data: validResults.map(r => r.data) };
        } else {
            throw new HttpException(
              'La IA no pudo generar el problema.',
              HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }
    }
}