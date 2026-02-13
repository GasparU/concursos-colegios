import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { IAiProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class GeminiProvider implements IAiProvider {
  public readonly providerName = 'Gemini 2.0 Flas';
  private readonly logger = new Logger(GeminiProvider.name);
  private model: ChatGoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: this.configService.get<string>('GOOGLE_API_KEY'),
      model: 'gemini-2.0-flash',
      maxOutputTokens: 8000,
      temperature: 0.3,
    });
  }

  async generateStructured<T>(messages: any[], schema: any): Promise<T> {
    try {
      const structuredLlm = this.model.withStructuredOutput(schema);
      const result = await structuredLlm.invoke(messages);
      return result as T;
    } catch (error: any) {
      // 🔥 Gemini no expone fácilmente la respuesta cruda, pero al menos logueamos el error
      this.logger.error(`Error en Gemini generateStructured: ${error.message}`);
      // Podemos intentar extraer algo de la respuesta si existe
      if (error.response) {
        this.logger.debug(
          `Respuesta Gemini (raw): ${JSON.stringify(error.response)}`,
        );
        (error as any).rawResponse = JSON.stringify(error.response);
      }
      throw error;
    }
  }
}