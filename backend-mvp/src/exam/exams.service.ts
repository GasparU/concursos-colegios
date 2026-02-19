import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, userId: string) {
    // 1. Separa los datos del examen de las preguntas
    const { questions, ...examData } = data;

    // 2. Crea todo en una sola operación (Exam + Questions)
    return this.prisma.exam.create({
      data: {
        ...examData,
        docenteId: userId,
        questions: {
          create: questions.map((q: any, index: number) => ({
            order: index + 1,
            // Mapeo exacto: snake_case (IA) -> camelCase (Prisma)
            questionMarkdown: q.question_markdown,
            options: q.options,
            correctAnswer: q.correct_answer,
            solutionMarkdown: q.solution_markdown,
            mathData: q.math_data || q.mathData,
            visualData: q.visual_data || q.visualData,
          })),
        },
      },
      include: {
        questions: true, // Devuelve el examen creado con sus preguntas
      },
    });
  }

  async findAll() {
    return this.prisma.exam.findMany({
      include: {
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
