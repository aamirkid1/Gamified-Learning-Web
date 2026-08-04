import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Lesson } from "./lesson.entity";
import { Course } from "../course/course.entity";

import { LessonProgress } from "../lesson-progress/lesson-progress.entity";
import { LessonProgressService } from "../lesson-progress/lesson-progress.service";

import { QuizAttempt } from "../quiz-attempt/quiz-attempt.entity";
import { Quiz } from "../quiz/quiz.entity";
import { Enrollment } from "../enrollment/enrollment.entity";
import { User } from "../user/user.entity";

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,

    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,

    @InjectRepository(QuizAttempt)
    private quizAttemptRepository: Repository<QuizAttempt>,

    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    @InjectRepository(Enrollment)
private enrollmentRepository: Repository<Enrollment>,

@InjectRepository(User)
private userRepository: Repository<User>,

    private lessonProgressService: LessonProgressService,


  ) { }

  async create(data: any) {
    const course = await this.courseRepository.findOne({
      where: {
        id: data.courseId,
      },
      relations: ["teacher"],
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    if (course.teacher.id !== Number(data.teacherId)) {
      throw new ForbiddenException(
        "You cannot add lessons to another teacher's course"
      );
    }

    const lessonCount =
      await this.lessonRepository.count({
        where: {
          courseId: data.courseId,
        },
      });

    const lesson = this.lessonRepository.create({
      title: data.title,
      content: data.content,
      videoUrl: data.videoUrl,
      pdfUrl: data.pdfUrl,
      courseId: data.courseId,
      orderNumber: lessonCount + 1,
    });

    return this.lessonRepository.save(lesson);
  }

  findAll() {
    return this.lessonRepository.find();
  }

  async findByCourse(courseId: number) {

  const lessons =
    await this.lessonRepository.find({
      where: {
        courseId,
      },
      order: {
        orderNumber: "ASC",
      },
    });

  const totalStudents =
  await this.enrollmentRepository.count({
    where: {
      courseId,
    },
  });

  const result: any[] = [];

  for (const lesson of lessons) {

    const completedStudents =
      await this.lessonProgressRepository.count({
        where: {
          lessonId: lesson.id,
          completed: true,
        },
      });

    result.push({

      id: lesson.id,

      title: lesson.title,

      orderNumber: lesson.orderNumber,

      completedStudents,

      pendingStudents:
totalStudents -
completedStudents,

    });

  }

  return result;
}

  async findByCourseForStudent(
    courseId: number,
    studentId: number,
  ) {
    const lessons =
      await this.lessonRepository.find({
        where: {
          courseId,
        },
        order: {
          orderNumber: "ASC",
        },
      });



    // Lesson completion (for UI only)
    const progress =
      await this.lessonProgressRepository.find({
        where: {
          studentId,
        },
      });

    const completedLessons =
      progress
        .filter((p) => p.completed)
        .map((p) => p.lessonId);

    // Quiz attempts that were PASSED
    const passedAttempts =
      await this.quizAttemptRepository.find({
        where: {
          userId: studentId,
          passed: true,
        },
      });

    const quizzes =
      await this.quizRepository.find({
        where: {
          courseId,
        },
      });

    return lessons.map((lesson, index) => {
      const completed =
        completedLessons.includes(lesson.id);

      let locked = true;

      // First lesson is always unlocked
      if (index === 0) {
        locked = false;
      } else {
        const previousLesson =
          lessons[index - 1];

        // Find the quiz that belongs to the previous lesson
        const previousLessonQuizzes =
          quizzes.filter(
            (quiz) =>
              quiz.lessonId === previousLesson.id &&
              quiz.isRequired
          );

        if (previousLessonQuizzes.length === 0) {
          locked = true;
        } else {
          const allPassed =
            previousLessonQuizzes.every((quiz) =>
              passedAttempts.some(
                (attempt) =>
                  attempt.quizId === quiz.id
              )
            );

          locked = !allPassed;
        }
      }

      return {
        ...lesson,
        completed,
        locked,
      };
    });
  }

  async getLessonStudents(lessonId: number) {

  const lesson =
    await this.lessonRepository.findOne({
      where: {
        id: lessonId,
      },
    });

  if (!lesson) {
    throw new NotFoundException(
      "Lesson not found",
    );
  }

  const enrollments =
    await this.enrollmentRepository.find({
      where: {
        courseId: lesson.courseId,
      },
    });

  const students: any[] = [];

  for (const enrollment of enrollments) {

    const student =
      await this.userRepository.findOne({
        where: {
          id: enrollment.studentId,
        },
      });

    if (!student) {
      continue;
    }

    const progress =
      await this.lessonProgressRepository.findOne({
        where: {
          lessonId,
          studentId: student.id,
        },
      });

    students.push({

      id: student.id,

      name: student.name,

      rollNo: student.rollNo,

      studentId: student.studentId,

      email: student.email,

      completed:
        progress?.completed ?? false,

      completedAt:
        progress?.completedAt ?? null,

      xpEarned:
        progress?.completed
          ? 50
          : 0,

    });

  }

  return students;
}
}