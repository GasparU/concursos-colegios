import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  // Obtener todos los exámenes (para la lista)
  async findAll() {
    return this.prisma.exam.findMany({
      include: {
        // 🔥 Cambiamos 'teacher' por 'docente' para que coincida con tu esquema
        docente: {
          select: { nombre: true, email: true },
        },
      },
    });
  }

  // Crear un examen (para el generador)
  async create(data: any, userId: string) {
    return this.prisma.exam.create({
      data: {
        ...data,
        // 🔥 Cambiamos 'teacherId' por 'docenteId'
        docenteId: userId,
      },
    });
  }
}
