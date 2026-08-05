import {
  Controller,
  Get,
  Param,
} from "@nestjs/common";

import { CourseProgressService } from "./course-progress.service";

@Controller("course-progress")
export class CourseProgressController {
  constructor(
    private readonly service: CourseProgressService,
  ) {}

  @Get(":studentId/:courseId")
  find(
    @Param("studentId") studentId: string,
    @Param("courseId") courseId: string,
  ) {
    return this.service.findProgress(
      Number(studentId),
      Number(courseId),
    );
  }
}