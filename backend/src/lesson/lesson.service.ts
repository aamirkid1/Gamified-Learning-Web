import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lesson } from './lesson.entity';
import { Course } from '../course/course.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,

    @InjectRepository(Course)
private courseRepository: Repository<Course>,
  ) {}

 async create(data: any) {
  const course = await this.courseRepository.findOne({
    where: {
      id: data.courseId,
    },
    relations: ["teacher"],
  });

  if (!course) {
    throw new NotFoundException("Course not found");
  }

  if (course.teacher.id !== Number(data.teacherId)) {
    throw new ForbiddenException(
      "You cannot add lessons to another teacher's course"
    );
  }

  const lesson = this.lessonRepository.create({
    title: data.title,
    content: data.content,
    videoUrl: data.videoUrl,
    pdfUrl: data.pdfUrl,
    courseId: data.courseId,
  });

  return this.lessonRepository.save(lesson);
}

  findAll() {
    return this.lessonRepository.find();
  }

  async findByCourse(courseId: number) {
  return await this.lessonRepository.find({
    where: {
      courseId,
    },
  });
}
}