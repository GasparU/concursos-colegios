import { Module } from '@nestjs/common';
import { ParametricGeneratorService } from './parametric-generator.service';
import { ParametricGeneratorController } from './parametric-generator.controller';
import { QuintoGradoService } from './grados/quinto.grado.service';
import { SextoGradoService } from './grados/sexto.grado.service';

@Module({
  controllers: [ParametricGeneratorController],
  providers: [
    ParametricGeneratorService,
    QuintoGradoService,
    SextoGradoService,
  ],
  exports: [ParametricGeneratorService],
})
export class ParametricGeneratorModule {}
