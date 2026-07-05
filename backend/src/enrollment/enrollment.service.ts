import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Enrollment } from './enrollment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async enroll(body: any) {
    const enrollment =
      this.enrollmentRepository.create(body);

    return this.enrollmentRepository.save(enrollment);
  }

  getStudentEnrollments(studentId: number) {
    return this.enrollmentRepository.find({
      where: {
        studentId,
      },
    });
  }

  getCourseEnrollments(courseId: number) {
    return this.enrollmentRepository.find({
      where: {
        courseId,
      },
    });
  }

  checkEnrollment(
    studentId: number,
    courseId: number,
  ) {
    return this.enrollmentRepository.findOne({
      where: {
        studentId,
        courseId,
      },
    });
  }

  async unenroll(id: number) {
    return this.enrollmentRepository.delete(id);
  }
}