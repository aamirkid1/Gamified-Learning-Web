// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserModule } from './user/user.module';
// import { CourseModule } from './course/course.module';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: '123456',
//       database: 'gamified_app',
//       autoLoadEntities: true,
//       synchronize: true,
//     }),

//     UserModule, // THIS FIXES EVERYTHING
//     CourseModule,
//   ],
// })
// export class AppModule {}



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UploadModule } from './uploads/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  // imports: [
  //   TypeOrmModule.forRoot({
  //     type: 'postgres',
  //     host: 'localhost',
  //     port: 5432,
  //     username: 'postgres',
  //     password: '123456',
  //     database: 'gamified_app',
  //     autoLoadEntities: true,
  //     synchronize: true,
  //   }),

  //   UserModule,
  //   CourseModule,
  //   LessonModule,
  //   DashboardModule,
  //   UploadModule,
  // ],


  imports: [

  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
    serveRoot: '/uploads',
  }),

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

  UserModule,
  CourseModule,
  LessonModule,
  DashboardModule,
  UploadModule,
],
})
export class AppModule {}