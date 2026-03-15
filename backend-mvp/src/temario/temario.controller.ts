import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { TEMARIO_MAESTRO } from './temario.db';

// 🔥 CAMBIAMOS DE 'api/topics' A SOLO 'topics' para seguir tu estándar
@Controller('topics')
export class TemarioController {
  @Get(':grado')
  obtenerTemasPorGrado(@Param('grado') grado: string) {
    const temas = (TEMARIO_MAESTRO as any)[grado];
    if (!temas) {
      throw new NotFoundException(`No hay temas para el grado ${grado}`);
    }
    return temas;
  }
}