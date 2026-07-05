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
  create(@Body() body: any) {
    return this.quizAttemptService.create(body);
  }

  @Get()
  findAll() {
    return this.quizAttemptService.findAll();
  }

  // All pending answers (existing)
  @Get('pending')
  getPending() {
    return this.quizAttemptService.getPending();
  }

  // Teacher-specific pending answers (new)
  @Get('pending/:teacherId')
  getPendingByTeacher(
    @Param('teacherId')
    teacherId: string,
  ) {
    return this.quizAttemptService.getPendingByTeacher(
      Number(teacherId),
    );
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

  @Get('check/:userId/:quizId')
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

  @Post('review/:id')
  review(
    @Param('id')
    id: string,

    @Body()
    body: any,
  ) {
    return this.quizAttemptService.reviewAttempt(
      Number(id),
      body.score,
    );
  }
}