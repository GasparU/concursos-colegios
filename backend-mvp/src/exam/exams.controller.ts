import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('exams') // 🔥 Esto crea la ruta /api/exams
@UseGuards(JwtAuthGuard) // Protegemos todo el controlador
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  findAll() {
    return this.examsService.findAll();
  }

  @Post()
  create(@Body() body: any, @Request() req) {
    // Asignamos el examen al usuario logueado
    return this.examsService.create(body, req.user.id);
  }
  
  @Post(':id/start')
  startExam(@Param('id') id: string) {
    return { status: 'started', examId: id, startTime: new Date() };
  }

  @Post(':id/submit')
  async submitExam(
    @Param('id') id: string,
    @Body() answers: any,
    @Request() req,
  ) {
    // 👈 Aquí es donde el estudiante guarda sus resultados finales
    return { message: 'Examen entregado con éxito' };
  }
}
