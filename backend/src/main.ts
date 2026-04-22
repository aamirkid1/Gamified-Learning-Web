// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors(); 

//   await app.listen(5000);
// }
// bootstrap();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ ENABLE CORS
  app.enableCors({
    origin: 'http://localhost:3001', // frontend URL
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();