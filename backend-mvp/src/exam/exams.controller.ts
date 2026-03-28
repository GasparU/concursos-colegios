import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Delete,
  Query,
  Req
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubmitExamDto } from './dto/submit-exam.dto';

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get('student/list')
  @UseGuards(JwtAuthGuard)
  async getStudentExams(@Req() req) {
    // 🔥 DEBUG EXTREMO: Mira tu terminal cuando Ariana entre a la lista
    console.log("👤 ¿Quién pide la lista?:", req.user);

    // Intentamos sacar el ID de todos los escondites posibles
    const userId = req.user?.id || req.user?.sub || req.user?.userId;

    if (!userId) {
      console.error("🚨 ALERTA: No se encontró ID en req.user. Revisa tu JwtStrategy.");
    }

    return this.examsService.findAllForStudent(userId);
  }

  // 2. Lista general (Docente)
  @Get()
  findAll() {
    return this.examsService.findAll();
  }

  // 3. Crear examen
  @Post()
  create(@Body() body: any, @Request() req) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.examsService.create(body, userId);
  }

  // 4. Iniciar (Placeholder para logs)
  @Post(':id/start')
  startExam(@Param('id') id: string) {
    return { status: 'started', examId: id, startTime: new Date() };
  }

  // 5. Enviar respuestas
  @Post(':id/submit')
  async submitExam(
    @Param('id') id: string,
    @Body() dto: SubmitExamDto,
    @Request() req,
  ) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.examsService.submitExam(id, userId, dto);
  }

  // 6. Obtener un examen específico
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  // 7. Obtener resultados de un alumno
  @Get(':id/results')
  async getResult(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || req.user.id;
    return this.examsService.getResult(id, userId);
  }

  // 8. Verificar si el examen ya fue realizado
  @Get(':id/check')
  async check(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || req.user.id;
    const finished = await this.examsService.checkResultExists(id, userId);
    return { finished };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.examsService.remove(id);
  }
}