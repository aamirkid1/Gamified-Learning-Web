import {
  Controller,
  Post,
  Get,
  Body,
  Param,
} from "@nestjs/common";

import { LessonProgressService } from "./lesson-progress.service";


@Controller("lesson-progress")
export class LessonProgressController {
  constructor(
    private lessonProgressService: LessonProgressService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.lessonProgressService.create(body);
  }

  @Post("complete")
completeLesson(@Body() body: any) {
  return this.lessonProgressService.completeLesson(
    body.studentId,
    body.lessonId,
  );
}

  @Get()
  findAll() {
    return this.lessonProgressService.findAll();
  }

  @Get("student/:studentId")
  findByStudent(
    @Param("studentId")
    studentId: string,
  ) {
    return this.lessonProgressService.findByStudent(
      Number(studentId),
    );
  }

  @Get(":studentId/:lessonId")
  findByLesson(
    @Param("studentId")
    studentId: string,

    @Param("lessonId")
    lessonId: string,
  ) {
    return this.lessonProgressService.findByLesson(
      Number(studentId),
      Number(lessonId),
    );
  }
}