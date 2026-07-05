import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Quiz } from './quiz.entity';
import { Lesson } from '../lesson/lesson.entity';

import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      Lesson,
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}