import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'gamified_app',
      autoLoadEntities: true,
      synchronize: true,
    }),

    UserModule, // 🔥 THIS FIXES EVERYTHING
  ],
})
export class AppModule {}