import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
// 🔥 OJO: Debe decir './auth/auth.module', NO './auth.module'
import { AuthModule } from './auth/auth.module';
import { ExamsModule } from './exam/exams.module';
import { AiGeneratorModule } from './ai-generator/ai-generator.module';
import { SimpleGeneratorModule } from './ai-generator/simple-generator/simple-generator.module';
import { TemarioController } from './temario/temario.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ExamsModule,
    AiGeneratorModule,
    SimpleGeneratorModule,
  ],
  controllers: [TemarioController],
  providers: [],
})
export class AppModule {}
