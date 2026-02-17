import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL no está definida');
  process.exit(1);
}

// --- CAMBIO AQUÍ: Se añaden opciones explícitas al constructor ---
// Por qué: Satisface el requerimiento de 'non-empty options' si el binario lo exige,
// y habilita logs para ver las consultas SQL en consola (útil para debug).
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
// ----------------------------------------------------------------

async function main() {
  console.log('🌱 Iniciando seed...'); // Añadido para feedback visual inmediato

  // Crear usuario docente
  await prisma.user.upsert({
    where: { email: 'docente@example.com' },
    update: {}, // Se mantiene vacío intencionalmente si ya existe
    create: {
      email: 'docente@example.com',
      password: '1234',
      role: 'DOCENTE',
      nombre: 'Docente Principal',
    },
  });

  // Crear usuario estudiante
  await prisma.user.upsert({
    where: { email: 'estudiante@example.com' },
    update: {}, // Se mantiene vacío intencionalmente si ya existe
    create: {
      email: 'estudiante@example.com',
      password: '2015',
      role: 'ESTUDIANTE',
      nombre: 'Estudiante de Prueba',
    },
  });

  console.log('✅ Usuarios creados correctamente');
}

main()
  .catch((e) => {
    console.error('🔥 Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
