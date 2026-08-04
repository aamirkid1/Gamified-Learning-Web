import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LessonProgress } from "./lesson-progress.entity";
import { User } from "../user/user.entity";

import { LessonProgressController } from "./lesson-progress.controller";
import { LessonProgressService } from "./lesson-progress.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
  LessonProgress,
  User,
]),
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