import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizAttempt } from './quiz-attempt.entity';
import { QuizAttemptController } from './quiz-attempt.controller';
import { QuizAttemptService } from './quiz-attempt.service';

import { User } from '../user/user.entity';

import { UserBadgeModule } from '../user-badge/user-badge.module';
import { BadgeModule } from '../badge/badge.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizAttempt,
      User,
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