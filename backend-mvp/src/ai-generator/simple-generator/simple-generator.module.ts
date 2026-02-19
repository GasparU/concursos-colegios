import { Module } from '@nestjs/common';
import { SimpleGeneratorController } from './simple-generator.controller';
import { SimpleGeneratorService } from './simple-generator.service';

@Module({
  controllers: [SimpleGeneratorController],
  providers: [SimpleGeneratorService],
})
export class SimpleGeneratorModule {}
