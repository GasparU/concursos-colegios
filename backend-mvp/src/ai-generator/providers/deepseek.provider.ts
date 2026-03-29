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
  - Para problemas MATEMÁTICOS, el JSON DEBE contener "math_data" con parámetros y x_value numérico.
  - Para problemas de LENGUAJE/LETRAS, pon "math_data": null y asegúrate de enviar el objeto "options" con 5 alternativas.`;

    const messagesToSend = [
      ...messages.slice(0, -1),
      { ...lastMessage, content: promptWithFormat },
    ];

    let rawText = '';

    try {
      const response = await this.model.invoke(messagesToSend);
      let rawText = response.content as string;

      console.log('📤 [DeepSeek] Respuesta cruda:', rawText);

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
      let mathData = parsed.math_data;
      if (!mathData && parsed.visual_data?.math_data) {
        mathData = parsed.visual_data.math_data;
      }

      const tieneTextoYAlternativas = parsed.question_markdown && parsed.options;

      if (!mathData && !tieneTextoYAlternativas) {
        const error = new Error(
          'La IA no generó math_data (ni en raíz ni en visual_data)',
        );
        (error as any).rawResponse = rawText;
        throw error;
      }

      // 🔥 Reemplazar parsed.math_data por el encontrado
      parsed.math_data = mathData || null;

      return parsed as T;
    } catch (e: any) {
      if (e.rawResponse) {
        this.logger.error(`🔥 RAW RESPONSE (DeepSeek): ${e.rawResponse}`);
      } else {
        this.logger.error(
          `Error parseando JSON de DeepSeek. Respuesta cruda: ${e.rawResponse || 'no disponible'}`,
        );
        if (!e.rawResponse) (e as any).rawResponse = rawText; 
        throw e;
      }
      throw e;
    }
  }
}