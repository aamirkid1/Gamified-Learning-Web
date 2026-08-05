import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { LessonProgress } from "./lesson-progress.entity";
import { User } from "../user/user.entity";
import { Lesson } from "../lesson/lesson.entity";
import { Quiz } from "../quiz/quiz.entity";

import { CourseProgressService } from "../course-progress/course-progress.service";

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,

    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    private courseProgressService: CourseProgressService,
  ) { }

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

  private async checkNoQuizCourseCompletion(
    studentId: number,
    lessonId: number,
  ) {

    const lesson =
      await this.lessonRepository.findOne({
        where: {
          id: lessonId,
        },
      });

    if (!lesson) {
      return false;
    }

    /*
     * Does this lesson contain any quiz?
     */
    const quizzes =
      await this.quizRepository.find({
        where: {
          lessonId,
        },
      });

    /*
     * If lesson has quiz,
     * do NOT complete course here.
     */
    if (quizzes.length > 0) {
      return false;
    }

    /*
     * Find last lesson
     */
    const lastLesson =
      await this.lessonRepository.findOne({

        where: {
          courseId: lesson.courseId,
        },

        order: {
          orderNumber: "DESC",
        },

      });

    if (!lastLesson) {
      return false;
    }

    /*
     * Only last lesson without quiz
     * completes course.
     */
    if (lastLesson.id !== lesson.id) {
      return false;
    }

    await this.courseProgressService.completeCourse(

      studentId,

      lesson.courseId,

    );

    return true;
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

    const courseCompleted =
      await this.checkNoQuizCourseCompletion(
        studentId,
        lessonId,
      );

    return {

      success: true,

      xpAwarded: 50,

      progress,

      user,

      courseCompleted,

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