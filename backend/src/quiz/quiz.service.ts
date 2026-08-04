import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Quiz } from './quiz.entity';
import { Lesson } from '../lesson/lesson.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private repo: Repository<Quiz>,

    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
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
}