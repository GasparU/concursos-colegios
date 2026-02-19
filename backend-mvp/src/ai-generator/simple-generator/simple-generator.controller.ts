import { Controller, Get, Query } from '@nestjs/common';
import { SimpleGeneratorService } from './simple-generator.service';

@Controller('simple')
export class SimpleGeneratorController {
  constructor(private readonly service: SimpleGeneratorService) {}

  @Get('generar')
  generarProblema(@Query('tipo') tipo?: string) {
    const tiposValidos = ['operaciones', 'fracciones', 'sucesiones'];
    if (tipo && !tiposValidos.includes(tipo)) {
      return {
        error: 'Tipo no válido. Use: operaciones, fracciones, sucesiones',
      };
    }
    const problema = this.service.generar(tipo as any);
    console.log(
      'Problema generado:',
      JSON.stringify(problema, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
    return problema;
  }
}
