import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
  ) {}

  @Post()
  enroll(@Body() body: any) {
    return this.enrollmentService.enroll(body);
  }

  @Get('student/:studentId')
  getStudentEnrollments(
    @Param('studentId') studentId: number,
  ) {
    return this.enrollmentService.getStudentEnrollments(
      Number(studentId),
    );
  }

  @Get('check/:studentId/:courseId')
  checkEnrollment(
    @Param('studentId') studentId: number,
    @Param('courseId') courseId: number,
  ) {
    return this.enrollmentService.checkEnrollment(
      Number(studentId),
      Number(courseId),
    );
  }

  @Get('course/:courseId')
  getCourseEnrollments(
    @Param('courseId') courseId: number,
  ) {
    return this.enrollmentService.getCourseEnrollments(
      Number(courseId),
    );
  }



  @Get("course/:courseId/count")
getEnrollmentCount(
  @Param("courseId") courseId: string,
) {
  return this.enrollmentService.getEnrollmentCountByCourse(
    Number(courseId),
  );
}

@Get("course/:courseId/students")
getStudentsByCourse(
  @Param("courseId") courseId: string,
) {
  return this.enrollmentService.getStudentsByCourse(
    Number(courseId),
  );
}

  @Delete(':id')
  unenroll(
    @Param('id') id: number,
  ) {
    return this.enrollmentService.unenroll(
      Number(id),
    );
  }
}