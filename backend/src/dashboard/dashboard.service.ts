import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Course } from '../course/course.entity';
import { Lesson } from '../lesson/lesson.entity';
import { Quiz } from '../quiz/quiz.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,

    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,

    @InjectRepository(Quiz)
    private quizRepo: Repository<Quiz>,
  ) {}

  async getStats(teacherId: number) {
    const courses = await this.courseRepo.find({
      where: {
        teacher: {
          id: teacherId,
        },
      },
    });

    const courseIds = courses.map(
      (course) => course.id,
    );

    const totalCourses = courseIds.length;

    let totalLessons = 0;
    let totalQuizzes = 0;

    if (courseIds.length > 0) {
      totalLessons =
        await this.lessonRepo.count({
          where: {
            courseId: In(courseIds),
          },
        });

      totalQuizzes =
        await this.quizRepo.count({
          where: {
            courseId: In(courseIds),
          },
        });
    }

    return {
      totalCourses,
      totalLessons,
      activeQuizzes: totalQuizzes,
    };
  }
}