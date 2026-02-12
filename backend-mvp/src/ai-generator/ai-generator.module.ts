import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiProvider } from './providers/gemini.provider';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { AiGeneratorController } from './ai-generator.controller';
import { AiGeneratorService } from './ai-generator.service';

@Module({
    imports: [ConfigModule],
    controllers: [AiGeneratorController],
    providers: [AiGeneratorService, DeepSeekProvider, GeminiProvider,],
})
export class AiGeneratorModule { }