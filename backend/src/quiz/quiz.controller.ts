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
  create(@Body() body: any) {
    return this.quizService.create(body);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get('teacher/:teacherId')
  async findByTeacher(
    @Param('teacherId') teacherId: string,
  ) {
    // Temporary implementation.
    // We'll filter properly after JWT integration.
    return this.quizService.findAll();
  }

  @Get("course/:courseId")
findByCourse(
  @Param("courseId") courseId: string,
) {
  return this.quizService.findByCourse(
    Number(courseId),
  );
}

@Get(":quizId/students")
getQuizStudents(
  @Param("quizId") quizId: string,
) {
  return this.quizService.getQuizStudents(
    Number(quizId),
  );
}

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.quizService.findOne(
      Number(id),
    );
  }
}