import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Quiz } from './quiz.entity';
import { Lesson } from '../lesson/lesson.entity';

import { QuizAttempt } from "../quiz-attempt/quiz-attempt.entity";
import { Enrollment } from "../enrollment/enrollment.entity";
import { User } from "../user/user.entity";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private repo: Repository<Quiz>,

    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,

    @InjectRepository(QuizAttempt)
private quizAttemptRepository: Repository<QuizAttempt>,

@InjectRepository(Enrollment)
private enrollmentRepository: Repository<Enrollment>,

@InjectRepository(User)
private userRepository: Repository<User>,
  ) {}

  async create(data: any) {
    const lesson = await this.lessonRepository.findOne({
      where: {
        id: data.lessonId,
      },
    });

    if (!lesson) {
      throw new NotFoundException(
        'Lesson not found',
      );
    }

    if (
      lesson.courseId !== Number(data.courseId)
    ) {
      throw new ForbiddenException(
        'Invalid lesson selected.',
      );
    }

    const quiz = this.repo.create({
  title: data.title,
  courseId: data.courseId,
  lessonId: data.lessonId,

  passingPercentage:
    data.passingPercentage ?? 40,

  isRequired:
    data.isRequired ?? true,
});

    return await this.repo.save(quiz);
  }

  findAll() {
    return this.repo.find();
  }

  async findByCourse(courseId: number) {

  const quizzes = await this.repo.find({
    where: {
      courseId,
    },
  });

  const totalStudents =
    await this.enrollmentRepository.count({
      where: {
        courseId,
      },
    });

  const result: any[] = [];

  for (const quiz of quizzes) {

    const lesson =
      await this.lessonRepository.findOne({
        where: {
          id: quiz.lessonId,
        },
      });

    const completedStudents =
      await this.quizAttemptRepository.count({
        where: {
          quizId: quiz.id,
          passed: true,
        },
      });

    result.push({
      id: quiz.id,
      title: quiz.title,
      lessonTitle: lesson?.title ?? "Unknown Lesson",
      completedStudents,
      pendingStudents:
        totalStudents - completedStudents,
    });

  }

  return result;
}

  async findByTeacher(
    courseIds: number[],
  ) {
    return await this.repo.find({
      where: courseIds.map((id) => ({
        courseId: id,
      })),
    });
  }



  findOne(id: number) {
  return this.repo.findOne({
    where: {
      id,
    },
  });
}

async getQuizStudents(
  quizId: number,
) {

  const attempts =
    await this.quizAttemptRepository.find({
      where: {
        quizId,
      },
      order: {
        percentage: "DESC",
      },
    });

  const students: any[] = [];

  for (const attempt of attempts) {

    const student =
      await this.userRepository.findOne({
        where: {
          id: attempt.userId,
        },
      });

    if (!student) {
      continue;
    }

    students.push({
      id: student.id,
      name: student.name,
      rollNo: student.rollNo,
      studentId: student.studentId,
      email: student.email,
      score: attempt.score,
      percentage: attempt.percentage,
      passed: attempt.passed,
      submittedAt: attempt.submittedAt,
      xpEarned: attempt.xpEarned,
    });

  }

  return students;

}

}
