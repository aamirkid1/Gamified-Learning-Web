import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from '../course/course.entity';
import { Lesson } from '../lesson/lesson.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,

    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
  ) {}

  async getStats() {
    const totalCourses = await this.courseRepo.count();

    const totalLessons = await this.lessonRepo.count();

    return {
      totalCourses,
      totalLessons,
      activeQuizzes: 0,
    };
  }
}