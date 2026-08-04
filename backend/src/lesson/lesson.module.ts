import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Lesson } from './lesson.entity';
import { Course } from '../course/course.entity';

import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

import { LessonProgress } from "../lesson-progress/lesson-progress.entity";
import { LessonProgressModule } from "../lesson-progress/lesson-progress.module";

import { Quiz } from "../quiz/quiz.entity";
import { QuizAttempt } from "../quiz-attempt/quiz-attempt.entity";
import { Enrollment } from "../enrollment/enrollment.entity";
import { User } from "../user/user.entity";

@Module({
  imports: [
  TypeOrmModule.forFeature([
  Lesson,
  Course,
  LessonProgress,
  Quiz,
  QuizAttempt,
  Enrollment,
  User,
]),
  LessonProgressModule,
],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}