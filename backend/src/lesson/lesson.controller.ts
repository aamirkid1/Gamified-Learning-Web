import {
  Controller,
  Get,
  Post,
  Body,
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
}