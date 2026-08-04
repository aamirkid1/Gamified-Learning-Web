import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './course.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

import { User } from '../user/user.entity';
import { Enrollment } from '../enrollment/enrollment.entity';
import { Lesson } from '../lesson/lesson.entity';
import { Quiz } from '../quiz/quiz.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      User,
      Enrollment,
      Lesson,
      Quiz,
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}