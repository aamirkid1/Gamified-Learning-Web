import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Question } from './question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private repo: Repository<Question>,
  ) {}

  create(data: any) {
  const question = this.repo.create({
    quizId: data.quizId,

    question: data.question,

    type: data.type,

    optionA: data.optionA,

    optionB: data.optionB,

    optionC: data.optionC,

    optionD: data.optionD,

    correctAnswers: data.correctAnswers,

    marks: data.marks ?? 10,
  });

  return this.repo.save(question);
}

  findAll() {
    return this.repo.find();
  }

  findByQuiz(quizId: number) {
    return this.repo.find({
      where: { quizId },
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }
}