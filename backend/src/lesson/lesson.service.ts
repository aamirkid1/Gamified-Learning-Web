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

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,

    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,

    private lessonProgressService: LessonProgressService,
  ) {}

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
    return this.lessonRepository.find({
      where: {
        courseId,
      },
      order: {
        orderNumber: "ASC",
      },
    });
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

    console.log("================================");
    console.log("Course ID:", courseId);
    console.log("Student ID:", studentId);
    console.log("Lessons from DB:", lessons);
    console.log("================================");

    const progress =
      await this.lessonProgressRepository.find({
        where: {
          studentId,
        },
      });

    console.log("Lesson Progress:", progress);

    const completedLessons =
      progress
        .filter((p) => p.completed)
        .map((p) => p.lessonId);

    console.log(
      "Completed Lesson IDs:",
      completedLessons,
    );

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

        locked =
          !completedLessons.includes(
            previousLesson.id,
          );
      }

      return {
        ...lesson,
        completed,
        locked,
      };
    });
  }
}