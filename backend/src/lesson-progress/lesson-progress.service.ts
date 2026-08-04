import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { LessonProgress } from "./lesson-progress.entity";
import { User } from "../user/user.entity";

@Injectable()
export class LessonProgressService {
  constructor(
  @InjectRepository(LessonProgress)
  private lessonProgressRepository: Repository<LessonProgress>,

  @InjectRepository(User)
  private userRepository: Repository<User>,
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

  // Prevent claiming XP twice
  if (progress?.completed) {
    return {
      success: true,
      message: "Lesson already completed.",
      progress,
    };
  }

  if (!progress) {
    progress =
      this.lessonProgressRepository.create({
        studentId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      });
    await this.lessonProgressRepository.save(progress);
  } else {
    progress.completed = true;
    progress.completedAt = new Date();
    await this.lessonProgressRepository.save(progress);
  }

  // Find student
  const user =
    await this.userRepository.findOne({
      where: {
        id: studentId,
      },
    });

  if (user) {
    // Award lesson XP
    user.xp += 50;

    // Simple level calculation
    user.level =
      Math.floor(user.xp / 100) + 1;

    await this.userRepository.save(user);
  }

  return {
    success: true,
    xpAwarded: 50,
    progress,
    user,
  };
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