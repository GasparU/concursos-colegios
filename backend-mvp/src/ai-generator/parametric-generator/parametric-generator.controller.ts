import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { ParametricGeneratorService } from './parametric-generator.service';

@Controller('parametric')
export class ParametricGeneratorController {
  
  // 🔥 El constructor correcto para que TypeScript no se queje
  constructor(private readonly parametricService: ParametricGeneratorService) {}

 @Post('generar')
  generarProblema(@Body() body: any) {
    const { topic, grado, dificultad, variacion = 0, valoresFijos = {}, plantillaId } = body;

    // 🔥 1. Si el frontend manda un plantillaId (al regenerar), usamos ese.
    let idParaGenerar = plantillaId;

    // 🔥 2. Si no manda (es la primera vez), buscamos una nueva plantilla variada
    if (!idParaGenerar) {
      const plantilla = this.parametricService.buscarPlantillaPorCriterios(
        topic, 
        grado, 
        dificultad, 
        variacion
      );
      idParaGenerar = plantilla.id;
    }

    // 3. Generamos la matemática con el ID definitivo
    return this.parametricService.generarProblema(idParaGenerar, valoresFijos);
  }

  // 🛡️ TUS RUTAS GET INTACTAS (Son vitales para consultar la base de datos de plantillas)
  @Get('plantillas')
  listarPlantillas(
    @Query('grado') grado?: string,
    @Query('tema') tema?: string,
  ): any {
    return this.parametricService.obtenerPlantillas({ grado, tema });
  }

  @Get('plantillas/:id')
  obtenerPlantilla(@Param('id') id: string): any {
    return this.parametricService.obtenerPlantillaPorId(id);
  }


  @Get('temas-disponibles')
async getTemas() {
  // Llama a la lista de plantillas que ya tienes cargadas en el Service
  const plantillas = this.parametricService.obtenerPlantillas();
  
  const mapa = {};
  plantillas.forEach(p => {
    if (!mapa[p.grado]) mapa[p.grado] = new Set();
    mapa[p.grado].add(p.tema);
  });

  // Convertimos los Sets a Arrays para el JSON
  const resultado = {};
  for (const grado in mapa) {
    resultado[grado] = Array.from(mapa[grado]).map(nombre => ({
      nombre,
      tipo: "conamat" 
    }));
  }
  return resultado;
}

}