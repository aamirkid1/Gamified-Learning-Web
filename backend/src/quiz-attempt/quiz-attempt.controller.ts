import {
  Controller,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';

import { QuizAttemptService } from './quiz-attempt.service';

@Controller('quiz-attempts')
export class QuizAttemptController {
  constructor(
    private quizAttemptService: QuizAttemptService,
  ) {}

  @Post()
  create(@Body() body) {
    return this.quizAttemptService.create(
      body,
    );
  }

  @Get()
  findAll() {
    return this.quizAttemptService.findAll();
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId')
    userId: string,
  ) {
    return this.quizAttemptService.findByUser(
      Number(userId),
    );
  }

  @Get('quiz/:quizId')
  findByQuiz(
    @Param('quizId')
    quizId: string,
  ) {
    return this.quizAttemptService.findByQuiz(
      Number(quizId),
    );
  }

  @Get(
    'check/:userId/:quizId',
  )
  checkAttempt(
    @Param('userId')
    userId: string,

    @Param('quizId')
    quizId: string,
  ) {
    return this.quizAttemptService.findUserQuizAttempt(
      Number(userId),
      Number(quizId),
    );
  }
}