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
  async generarProblema(@Body() body: { plantillaId: string; valoresFijos?: any }) {
     console.log('📥 [Controller] Recibido plantillaId:', body.plantillaId);
    try {
      // Intentamos ejecutar el motor
      const resultado = await this.service.generarProblema(
        body.plantillaId,
        body.valoresFijos,
      );
      return resultado;
    } catch (error: any) {
      // 🔥 ATRAPAMOS EL ERROR SILENCIOSO Y LO EXPONEMOS 🔥
      console.error('\n🔥🔥🔥 ERROR CRÍTICO EN EL MOTOR PARAMÉTRICO 🔥🔥🔥');
      console.error('Plantilla que falló:', body.plantillaId);
      console.error('Mensaje del Error:', error.message);
      console.error('Stack Trace:', error.stack);
      console.error('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥\n');

      // Volvemos a lanzar el error para que NestJS responda el 400 al frontend,
      // pero ahora ya tenemos el chisme completo en la terminal.
      throw error;
    }
  }
}
