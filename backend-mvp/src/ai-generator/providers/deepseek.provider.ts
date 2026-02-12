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
            temperature: 0.4,
            maxTokens: 8000,
            apiKey: this.configService.get<string>('DEEPSEEK_API_KEY'),
            modelKwargs: {
                response_format: { type: "json_object" }
            }
        });
    }

    async generateStructured<T>(messages: any[], schema: any): Promise<T> {
        const parser = new JsonOutputParser();
        const lastMessage = messages[messages.length - 1];
        const promptWithFormat = `${lastMessage.content}\n\nIMPORTANTE: Responde ÚNICAMENTE con un JSON válido. NO uses bloques de código markdown (\`\`\`json), solo el texto JSON crudo.`;

        // Creamos una copia de los mensajes con la instrucción inyectada
        const messagesToSend = [
            ...messages.slice(0, -1),
            { ...lastMessage, content: promptWithFormat }
        ];

        try {
            const response = await this.model.invoke(messagesToSend);
            const rawText = response.content as string;
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            const cleanJson = jsonMatch ? jsonMatch[0] : rawText;

            const parsed = await parser.parse(cleanJson);
            return parsed as T;

        } catch (e) {
            this.logger.error("Error parseando JSON de DeepSeek", e);
            throw e;
        }
    }
}