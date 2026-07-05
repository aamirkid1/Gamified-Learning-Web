import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizAttempt } from './quiz-attempt.entity';
import { QuizAttemptController } from './quiz-attempt.controller';
import { QuizAttemptService } from './quiz-attempt.service';

import { User } from '../user/user.entity';

import { UserBadgeModule } from '../user-badge/user-badge.module';
import { BadgeModule } from '../badge/badge.module';
import { Course } from "../course/course.entity";
import { Quiz } from "../quiz/quiz.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
    QuizAttempt,
    User,
    Quiz,
    Course,
]),

    UserBadgeModule,
    BadgeModule,
  ],

  controllers: [
    QuizAttemptController,
  ],

  providers: [
    QuizAttemptService,
  ],
})
export class QuizAttemptModule {}