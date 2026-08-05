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

  @Get("course/:courseId/analytics")
findTeacherLessonAnalytics(
  @Param("courseId")
  courseId: string,
) {
  return this.lessonService.findTeacherLessonAnalytics(
    Number(courseId),
  );
}

  @Get("course/:courseId/student/:studentId")
findStudentLessons(
  @Param("courseId") courseId: string,

  @Param("studentId") studentId: string,
) {
  return this.lessonService.findByCourseForStudent(
    Number(courseId),
    Number(studentId),
  );
}


@Get(":lessonId/students")
getLessonStudents(
  @Param("lessonId") lessonId: string,
) {
  return this.lessonService.getLessonStudents(
    Number(lessonId),
  );
}
}