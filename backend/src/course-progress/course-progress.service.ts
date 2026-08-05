import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CourseProgress } from "./course-progress.entity";

@Injectable()
export class CourseProgressService {
  constructor(
    @InjectRepository(CourseProgress)
    private repo: Repository<CourseProgress>,
  ) {}

  async findProgress(
    studentId: number,
    courseId: number,
  ) {
    return this.repo.findOne({
      where: {
        studentId,
        courseId,
      },
    });
  }

  async completeCourse(
    studentId: number,
    courseId: number,
  ) {
    let progress =
      await this.findProgress(
        studentId,
        courseId,
      );

    if (progress?.completed) {
      return progress;
    }

    if (!progress) {
      progress =
        this.repo.create({
          studentId,
          courseId,
          completed: true,
          completedAt: new Date(),
        });
    } else {
      progress.completed = true;
      progress.completedAt = new Date();
    }

    return this.repo.save(progress);
  }
}