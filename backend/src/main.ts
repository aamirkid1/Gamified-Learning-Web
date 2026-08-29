import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Serve static files from uploads folder
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads')),
  );

  await app.listen(3000);
}

bootstrap();