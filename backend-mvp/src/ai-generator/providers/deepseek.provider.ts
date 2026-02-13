import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { IAiProvider } from '../interfaces/ai-provider.interface';
import { JsonOutputParser } from "@langchain/core/output_parsers";

@Injectable()
export class DeepSeekProvider implements IAiProvider {
  public readonly providerName = 'DeepSeek Chat';
  private model: ChatOpenAI;
  private logger = new Logger(DeepSeekProvider.name);

  constructor(private configService: ConfigService) {
    this.model = new ChatOpenAI({
      configuration: {
        baseURL: 'https://api.deepseek.com',
        apiKey: this.configService.get<string>('DEEPSEEK_API_KEY'),
      },
      model: 'deepseek-chat',
      temperature: 0.3,
      maxTokens: 8000,
      apiKey: this.configService.get<string>('DEEPSEEK_API_KEY'),
      modelKwargs: {
        response_format: { type: 'json_object' },
      },
    });
  }

  async generateStructured<T>(messages: any[], schema: any): Promise<T> {
    const parser = new JsonOutputParser();
    const lastMessage = messages[messages.length - 1];

    // 🔥 INSTRUCCIÓN MUY EXPLÍCITA
    const promptWithFormat = `${lastMessage.content}

  IMPORTANTE: 
  - Responde ÚNICAMENTE con un JSON válido y plano. 
  - NO uses bloques de código markdown (ni \`\`\`json, ni \`\`\`).  
  - El JSON DEBE contener la propiedad "math_data" con TODOS los parámetros requeridos.
  - math_data.params.x_value DEBE ser un número (ej: 18, 6.5), NO texto.
  - Si no puedes generar math_data, responde con un JSON vacío {} (pero entonces el backend reintentará).`;

    const messagesToSend = [
      ...messages.slice(0, -1),
      { ...lastMessage, content: promptWithFormat },
    ];

    try {
      const response = await this.model.invoke(messagesToSend);
      let rawText = response.content as string;

      // 🔥 LIMPIEZA AGRESIVA
      rawText = rawText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*$/g, '')
        .trim();

      // 🔥 EXTRAER PRIMER OBJETO JSON COMPLETO
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        const error = new Error('No se encontró JSON en la respuesta');
        (error as any).rawResponse = rawText; // adjuntamos crudo
        throw error;
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // 🔥 VALIDACIÓN CLAVE: math_data debe existir
      if (!parsed.math_data) {
        const error = new Error('La IA no generó math_data');
        (error as any).rawResponse = rawText;
        throw error;
      }

      return parsed as T;
    } catch (e: any) {
      this.logger.error(
        `Error parseando JSON de DeepSeek. Respuesta cruda: ${e.rawResponse || 'no disponible'}`,
      );
      // Aseguramos que el error tenga la respuesta cruda para el log superior
      if (!e.rawResponse && (e as any).rawResponse === undefined) {
        (e as any).rawResponse = 'No capturada';
      }
      throw e;
    }
  }
}