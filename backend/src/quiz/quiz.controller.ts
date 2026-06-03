import {
  Controller,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';

import { QuizService } from './quiz.service';

@Controller('quizzes')
export class QuizController {
  constructor(
    private quizService: QuizService,
  ) {}

  @Post()
  create(@Body() body) {
    return this.quizService.create(body);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(
      Number(id),
    );
  }
}