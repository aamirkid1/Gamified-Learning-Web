import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Enrollment } from './enrollment.entity';
import { User } from "../user/user.entity";
@Injectable()
export class EnrollmentService {
  constructor(
  @InjectRepository(Enrollment)
  private enrollmentRepository: Repository<Enrollment>,

  @InjectRepository(User)
  private userRepository: Repository<User>,
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

  async getEnrollmentCountByCourse(courseId: number) {
    const count = await this.enrollmentRepository.count({
      where: {
        courseId,
      },
    });

    return {
      count,
    };
  }

  async getStudentsByCourse(courseId: number) {

  const enrollments =
    await this.enrollmentRepository.find({
      where: {
        courseId,
      },
    });

  const students: any[] = [];

  for (const enrollment of enrollments) {

    const student =
      await this.userRepository.findOne({
        where: {
          id: enrollment.studentId,
        },
      });

    if (student) {

      students.push({

        id: student.id,

        name: student.name,

        rollNo: student.rollNo,

        studentId: student.studentId,

        email: student.email,

        xp: student.xp,

        level: student.level,

      });

    }

  }

  return students;

}
}