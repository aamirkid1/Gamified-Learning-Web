import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './course.entity';
import { User } from '../user/user.entity';
import { Enrollment } from "../enrollment/enrollment.entity";
import { Lesson } from "../lesson/lesson.entity";
import { Quiz } from "../quiz/quiz.entity";

@Injectable()
export class CourseService {
  constructor(
  @InjectRepository(Course)
  private readonly courseRepository: Repository<Course>,

  @InjectRepository(User)
  private readonly userRepository: Repository<User>,

  @InjectRepository(Enrollment)
  private readonly enrollmentRepository: Repository<Enrollment>,

  @InjectRepository(Lesson)
  private readonly lessonRepository: Repository<Lesson>,

  @InjectRepository(Quiz)
  private readonly quizRepository: Repository<Quiz>,
) {}

  async create(courseData: any) {
    const teacher = await this.userRepository.findOne({
      where: {
        id: Number(courseData.teacherId),
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const course = this.courseRepository.create({
      title: courseData.title,
      description: courseData.description,
      thumbnail: courseData.thumbnail,
      teacher,
    });

    return await this.courseRepository.save(course);
  }


  async findAll() {
  return await this.courseRepository.find({
    relations: ["teacher"],
  });
}

async findOne(id: number) {
  const course = await this.courseRepository.findOne({
    where: {
      id,
    },
    relations: ["teacher"],
  });

  if (!course) {
    throw new NotFoundException("Course not found");
  }

  return course;
}

 async findByTeacher(teacherId: number) {
  const courses = await this.courseRepository.find({
    where: {
      teacher: {
        id: teacherId,
      },
    },
    relations: ["teacher"],
  });

  const result: any[] = [];

  for (const course of courses) {
    const studentCount = await this.enrollmentRepository.count({
      where: {
        courseId: course.id,
      },
    });

    const lessonCount = await this.lessonRepository.count({
      where: {
        courseId: course.id,
      },
    });

    const quizCount = await this.quizRepository.count({
      where: {
        courseId: course.id,
      },
    });

    (result as any[]).push({
  id: course.id,
  title: course.title,
  description: course.description,
  thumbnail: course.thumbnail,
  teacher: course.teacher,
  studentCount,
  lessonCount,
  quizCount,
});
  }

  return result;
}


async getCourseDetails(courseId: number) {
  const course = await this.courseRepository.findOne({
    where: {
      id: courseId,
    },
    relations: ["teacher"],
  });

  if (!course) {
    throw new NotFoundException("Course not found");
  }

  const studentCount =
    await this.enrollmentRepository.count({
      where: {
        courseId,
      },
    });

  const lessonCount =
    await this.lessonRepository.count({
      where: {
        courseId,
      },
    });

  const quizCount =
    await this.quizRepository.count({
      where: {
        courseId,
      },
    });

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,

    teacherId: course.teacher.id,
    teacherName: course.teacher.name,

    studentCount,
    lessonCount,
    quizCount,
  };
}
}