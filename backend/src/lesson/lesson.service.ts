import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lesson } from './lesson.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  create(data: Partial<Lesson>) {
    const lesson = this.lessonRepository.create(data);
    return this.lessonRepository.save(lesson);
  }

  findAll() {
    return this.lessonRepository.find();
  }
}