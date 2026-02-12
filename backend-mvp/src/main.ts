import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use((req, res, next) => {
    res.setTimeout(120000, () => {
      console.log('Request has timed out.');
      res.send(408);
    });
    next();
  });




  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Cerebro corriendo en: http://localhost:3000`);
}
bootstrap();
