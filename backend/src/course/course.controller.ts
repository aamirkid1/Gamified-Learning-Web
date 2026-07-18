import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from "@nestjs/common";
import { CourseService } from "./course.service";

@Controller("courses")
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.courseService.create(body);
  }

  // Student page uses this
  @Get()
  findAll() {
    return this.courseService.findAll();
  }


  @Get(":id")
findOne(
  @Param("id") id: string,
) {
  return this.courseService.findOne(
    Number(id),
  );
}

  // Teacher dashboard uses this
  @Get("teacher/:teacherId")
  findByTeacher(
    @Param("teacherId") teacherId: string,
  ) {
    return this.courseService.findByTeacher(
      Number(teacherId),
    );
  }
}