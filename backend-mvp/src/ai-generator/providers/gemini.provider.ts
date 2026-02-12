import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { IAiProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class GeminiProvider implements IAiProvider {
    public readonly providerName = 'Gemini 2.5 Pro';
    private model: ChatGoogleGenerativeAI;

    constructor(private configService: ConfigService) {
        this.model = new ChatGoogleGenerativeAI({
            apiKey: this.configService.get<string>('GOOGLE_API_KEY'),
            model: 'gemini-2.5-pro',
            maxOutputTokens: 8000,
            temperature: 0.4,
        });
    }

    async generateStructured<T>(messages: any[], schema: any): Promise<T> {
        const structuredLlm = this.model.withStructuredOutput(schema);
        const result = await structuredLlm.invoke(messages);
        return result as T;
    }
}