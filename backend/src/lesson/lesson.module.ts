import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Lesson } from './lesson.entity';
import { Course } from '../course/course.entity';

import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

import { LessonProgress } from "../lesson-progress/lesson-progress.entity";
import { LessonProgressModule } from "../lesson-progress/lesson-progress.module";

@Module({
  imports: [
  TypeOrmModule.forFeature([
    Lesson,
    Course,
    LessonProgress,
  ]),

  LessonProgressModule,
],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}