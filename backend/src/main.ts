import * as dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
//  app.enableCors({
//   origin: [
//     'http://localhost:3001',
//     'http://10.43.59.172:3001',
//   ],
//   credentials: true,
// });

 app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Serve static files from uploads folder
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads')),
  );

const port = process.env.PORT || 3000;

await app.listen(port, '0.0.0.0');}

bootstrap();