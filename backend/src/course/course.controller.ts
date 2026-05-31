import { Controller, Get, Post, Body } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.courseService.create(body);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }
}