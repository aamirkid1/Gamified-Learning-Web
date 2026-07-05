import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Lesson } from './lesson.entity';
import { Course } from '../course/course.entity';

import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lesson,
      Course,
    ]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}