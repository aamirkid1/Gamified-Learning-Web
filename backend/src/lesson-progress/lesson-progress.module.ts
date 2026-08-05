import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LessonProgress } from "./lesson-progress.entity";
import { User } from "../user/user.entity";

import { LessonProgressController } from "./lesson-progress.controller";
import { LessonProgressService } from "./lesson-progress.service";

import { Lesson } from "../lesson/lesson.entity";
import { Quiz } from "../quiz/quiz.entity";

import { CourseProgressModule } from "../course-progress/course-progress.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
  LessonProgress,
  User,
  Lesson,
  Quiz,
]),
CourseProgressModule,
  ],

  controllers: [
    LessonProgressController,
  ],

  providers: [
    LessonProgressService,
  ],

  exports: [
    LessonProgressService,
  ],
})
export class LessonProgressModule {}