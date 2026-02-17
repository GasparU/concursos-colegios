import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 🔥 Opcional: Hace que no tengas que importarlo en cada módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- ESTO ES CRÍTICO
})
export class PrismaModule {}
