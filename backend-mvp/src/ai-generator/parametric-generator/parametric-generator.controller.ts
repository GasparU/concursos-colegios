import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ParametricGeneratorService } from './parametric-generator.service';
import { Plantilla } from './plantillas.types';

@Controller('parametric')
export class ParametricGeneratorController {
  constructor(private readonly service: ParametricGeneratorService) {}

  @Get('plantillas')
  listarPlantillas(
    @Query('grado') grado?: string,
    @Query('tema') tema?: string,
  ): any {
    return this.service.obtenerPlantillas({ grado, tema });
  }

  @Get('plantillas/:id')
  obtenerPlantilla(@Param('id') id: string): any {
    return this.service.obtenerPlantillaPorId(id);
  }

  @Post('generar')
  generarProblema(@Body() body: { plantillaId: string; valoresFijos?: any }) {
    console.log('📦 Body recibido:', body);
    return this.service.generarProblema(body.plantillaId, body.valoresFijos);
  }
}
