import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Quiz } from './quiz.entity';
import { Lesson } from '../lesson/lesson.entity';

import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

import { QuizAttempt } from "../quiz-attempt/quiz-attempt.entity";
import { Enrollment } from "../enrollment/enrollment.entity";

import { User } from "../user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
  Quiz,
  Lesson,
  QuizAttempt,
  Enrollment,
  User,
]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})


export class QuizModule {}