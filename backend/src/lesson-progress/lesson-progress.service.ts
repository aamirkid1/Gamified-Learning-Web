import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { LessonProgress } from "./lesson-progress.entity";

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,
  ) {}

  create(data: any) {
    const progress =
      this.lessonProgressRepository.create(data);

    return this.lessonProgressRepository.save(progress);
  }

  findAll() {
    return this.lessonProgressRepository.find();
  }

  findByStudent(studentId: number) {
    return this.lessonProgressRepository.find({
      where: {
        studentId,
      },
    });
  }

  findByLesson(studentId: number, lessonId: number) {
    return this.lessonProgressRepository.findOne({
      where: {
        studentId,
        lessonId,
      },
    });
  }

  async completeLesson(
    studentId: number,
    lessonId: number,
  ) {
    let progress =
      await this.lessonProgressRepository.findOne({
        where: {
          studentId,
          lessonId,
        },
      });

    if (!progress) {
      progress =
        this.lessonProgressRepository.create({
          studentId,
          lessonId,
          completed: true,
          completedAt: new Date(),
        });
    } else {
      progress.completed = true;
      progress.completedAt = new Date();
    }

    return this.lessonProgressRepository.save(
      progress,
    );
  }

  async isLessonCompleted(
    studentId: number,
    lessonId: number,
  ) {
    const progress =
      await this.lessonProgressRepository.findOne({
        where: {
          studentId,
          lessonId,
        },
      });

    return progress?.completed ?? false;
  }
}