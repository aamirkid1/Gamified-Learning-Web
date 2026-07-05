import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';

import { LessonService } from './lesson.service';

@Controller('lessons')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.lessonService.create(body);
  }

  @Get()
  findAll() {
    return this.lessonService.findAll();
  }

  @Get('course/:courseId')
  findByCourse(
    @Param('courseId') courseId: number,
  ) {
    return this.lessonService.findByCourse(
      Number(courseId),
    );
  }
}