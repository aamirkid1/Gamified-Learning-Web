import {
  Controller,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';

import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(
    private questionService: QuestionService,
  ) {}

  @Post()
  create(@Body() body) {
    return this.questionService.create(
      body,
    );
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get('quiz/:quizId')
  findByQuiz(
    @Param('quizId') quizId: string,
  ) {
    return this.questionService.findByQuiz(
      Number(quizId),
    );
  }
}