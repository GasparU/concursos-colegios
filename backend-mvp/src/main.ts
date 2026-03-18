import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configurar Prefijo ANTES de todo
  app.setGlobalPrefix('api');

  // 2. Configurar CORS (UNA SOLA VEZ)
  app.enableCors({
    origin: ['https://concursos-colegios-ariana.vercel.app', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // 🔥 BORRÉ EL SEGUNDO app.enableCors() QUE TENÍAS AQUÍ, ESE ERA EL ERROR

  // 3. Middleware de Timeout (Corregido para NestJS/Express moderno)
  app.use((req, res, next) => {
    res.setTimeout(120000, () => {
      console.log('Request has timed out.');
      if (!res.headersSent) {
        // Evitar error si ya se respondió
        res.status(408).send('Request Timeout');
      }
    });
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Cerebro corriendo en: http://localhost:3000/api`);
}
bootstrap();
