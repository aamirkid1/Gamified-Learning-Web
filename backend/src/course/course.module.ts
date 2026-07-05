// import { Module } from '@nestjs/common';
// import { CourseController } from './course.controller';
// import { CourseService } from './course.service';

// @Module({
//   controllers: [CourseController],
//   providers: [CourseService],
// })
// export class CourseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './course.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { User } from "../user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Course,
        User,
    ])
],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}