import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'; // Ajusta la ruta
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    console.log('🔍 Buscando usuario con email:', email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('❌ Usuario no encontrado');
      throw new UnauthorizedException('Credenciales inválidas');
    }
    console.log('✅ Usuario encontrado:', user.email);
    console.log('🔐 Comparando contraseñas:', {
      ingresada: password,
      almacenada: user.password,
    });
    if (user.password !== password) {
      console.log('❌ Contraseña incorrecta');
      throw new UnauthorizedException('Credenciales inválidas');
    }
    console.log('✅ Contraseña correcta');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nombre: user.nombre,
      },
    };
  }
}