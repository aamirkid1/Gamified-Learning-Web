import {
  Injectable,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { QuizAttempt } from "./quiz-attempt.entity";
import { User } from "../user/user.entity";
import { Quiz } from "../quiz/quiz.entity";
import { Course } from "../course/course.entity";

import { UserBadgeService } from "../user-badge/user-badge.service";
import { BadgeService } from "../badge/badge.service";
import { Question } from "../question/question.entity";
import { LessonProgressService } from "../lesson-progress/lesson-progress.service";
import { Lesson } from "../lesson/lesson.entity";
import { LessonProgress } from "../lesson-progress/lesson-progress.entity";
import { CourseProgressService } from "../course-progress/course-progress.service";


@Injectable()
export class QuizAttemptService {
  constructor(
    @InjectRepository(QuizAttempt)
    private repo: Repository<QuizAttempt>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Quiz)
    private quizRepo: Repository<Quiz>,

    @InjectRepository(Course)
    private courseRepo: Repository<Course>,

    @InjectRepository(Question)
    private questionRepo: Repository<Question>,

    private userBadgeService: UserBadgeService,

    private badgeService: BadgeService,
    //private lessonProgressService: LessonProgressService,

    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,

    private lessonProgressService: LessonProgressService,

    private courseProgressService: CourseProgressService,
  ) { }

  private async evaluateBadges(user: User) {
    const totalAttempts = await this.repo.count({
      where: {
        userId: user.id,
      },
    });

    // Scholar
    if (totalAttempts >= 1) {
      await this.userBadgeService.awardBadge(
        user.id,
        1,
      );
    }

    // Expert
    if (user.level >= 5) {
      await this.userBadgeService.awardBadge(
        user.id,
        2,
      );
    }

    // Fast Learner
    if (totalAttempts >= 5) {
      await this.userBadgeService.awardBadge(
        user.id,
        4,
      );
    }
  }

  //   private async checkLessonCompletion(
  //   userId: number,
  //   lessonId: number,
  // ) {
  //   /*
  //    * Get all required quizzes of this lesson
  //    */
  //   const quizzes =
  //     await this.quizRepo.find({
  //       where: {
  //         lessonId,
  //         isRequired: true,
  //       },
  //     });

  //   if (quizzes.length === 0) {
  //     return;
  //   }

  //   /*
  //    * Check if every required quiz is passed
  //    */
  //   for (const quiz of quizzes) {
  //     const attempt =
  //       await this.repo.findOne({
  //         where: {
  //           userId,
  //           quizId: quiz.id,
  //           passed: true,
  //         },
  //       });

  //     if (!attempt) {
  //       return;
  //     }
  //   }

  //   /*
  //    * All quizzes passed
  //    */
  //   await this.lessonProgressService.completeLesson(
  //     userId,
  //     lessonId,
  //   );
  // }

  async create(data: any) {
    const existingAttempt =
      await this.repo.findOne({
        where: {
          userId: data.userId,
          quizId: data.quizId,
        },
      });

    if (existingAttempt) {
      return {
        message: "Quiz already attempted",
      };
    }

    const attempt = new QuizAttempt();

    Object.assign(attempt, {
      ...data,
      mcqScore: data.score,
      shortAnswerScore: 0,
    });

    const savedAttempt =
      await this.repo.save(attempt);

    let courseCompleted = false;

    const user =
      await this.userRepo.findOne({
        where: {
          id: data.userId,
        },
      });

   /*
 * Load quiz
 */
const quiz =
  await this.quizRepo.findOne({
    where: {
      id: data.quizId,
    },
  });

if (quiz) {

  /*
   * Load all questions of this quiz
   */
  const questions =
    await this.questionRepo.find({
      where: {
        quizId: quiz.id,
      },
    });

  

  /*
   * Does this quiz contain any short-answer question?
   */
  const hasShortAnswer =
    questions.some(
      (q: any) =>
        q.type?.toLowerCase() === "short",
    );

  /*
   * Calculate total marks
   */
  const totalMarks =
    questions.reduce(
      (sum, q) => sum + q.marks,
      0,
    );

  const passingPercentage =
    quiz.passingPercentage ?? 40;

  const percentage =
    totalMarks > 0
      ? (data.score / totalMarks) * 100
      : 0;

  /*
   * Save MCQ evaluation
   */
  savedAttempt.totalMarks =
    totalMarks;

  savedAttempt.percentage =
    percentage;

  savedAttempt.passed =
    percentage >= passingPercentage;

  /*
   * ------------------------------------------
   * QUIZZES WITH SHORT ANSWERS
   * ------------------------------------------
   *
   * Wait for teacher review.
   * Do NOT complete lesson.
   * Do NOT complete course.
   * Do NOT show popup.
   */
  if (hasShortAnswer) {

    savedAttempt.reviewed = false;

    await this.repo.save(
      savedAttempt,
    );

  }

  /*
   * ------------------------------------------
   * MCQ-ONLY QUIZZES
   * ------------------------------------------
   */
  else {

    savedAttempt.reviewed = true;

    await this.repo.save(
      savedAttempt,
    );

    if (savedAttempt.passed) {

      courseCompleted =
        await this.finishLessonIfPassed(
          data.userId,
          quiz.lessonId,
        );

    }

  }

}
    return {

      message:
        "Quiz submitted successfully",

      attempt: savedAttempt,

      xp: user?.xp,

      level: user?.level,

      courseCompleted,

    };
  }

  async getPending() {
    const attempts =
      await this.repo.find({
        where: {
          reviewed: false,
        },

        order: {
          submittedAt: "DESC",
        },
      });

    return attempts.filter((attempt) => {
      const answers = JSON.parse(
        attempt.answers,
      );

      return Object.values(
        answers,
      ).some(
        (a) => typeof a === "string",
      );
    });
  }

  async getPendingByTeacher(
    teacherId: number,
  ) {
    const courses =
      await this.courseRepo.find({
        where: {
          teacher: {
            id: teacherId,
          },
        },
      });

    const courseIds = courses.map(
      (course) => course.id,
    );

    const quizzes =
      await this.quizRepo.find();

    const quizIds = quizzes
      .filter((quiz) =>
        courseIds.includes(
          quiz.courseId,
        ),
      )
      .map((quiz) => quiz.id);

    const attempts =
      await this.repo.find({
        where: {
          reviewed: false,
        },

        order: {
          submittedAt: "DESC",
        },
      });

    return attempts.filter(
      (attempt) => {
        if (
          !quizIds.includes(
            attempt.quizId,
          )
        ) {
          return false;
        }

        const answers =
          JSON.parse(
            attempt.answers,
          );

        return Object.values(
          answers,
        ).some(
          (a) =>
            typeof a === "string",
        );
      },
    );
  }

  private async checkCourseCompletion(
    userId: number,
    lessonId: number,
  ) {
    const lesson =
      await this.lessonRepo.findOne({
        where: {
          id: lessonId,
        },
      });

    if (!lesson) {
      return false;
    }

    /*
     * Find the LAST lesson
     */
    const lastLesson =
      await this.lessonRepo.findOne({
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
     * If current lesson is NOT the last one,
     * course isn't finished yet.
     */
    if (lesson.id !== lastLesson.id) {
      return false;
    }

    /*
     * Student reached last lesson.
     * Mark course completed.
     */
    await this.courseProgressService.completeCourse(
      userId,
      lesson.courseId,
    );

    return true;
  }


  private async finishLessonIfPassed(
    userId: number,
    lessonId: number,
  ) {
    await this.lessonProgressService.completeLesson(
      userId,
      lessonId,
    );

    return await this.checkCourseCompletion(
      userId,
      lessonId,
    );
  }

  async reviewAttempt(
    attemptId: number,
    score: number,
  ) {
    const attempt =
      await this.repo.findOne({
        where: {
          id: attemptId,
        },
      });

    if (!attempt) {
      return {
        message:
          "Attempt not found",
      };
    }

    if (attempt.reviewed) {
      return {
        message:
          "Already reviewed",
      };
    }

    attempt.teacherScore = score;

    attempt.shortAnswerScore = score;

    attempt.score =
      attempt.mcqScore + score;

    /*
     * Calculate total quiz marks
     */
    const questions =
      await this.questionRepo.find({
        where: {
          quizId: attempt.quizId,
        },
      });

    const totalMarks = questions.reduce(
      (sum, question) => sum + question.marks,
      0,
    );

    attempt.totalMarks = totalMarks;

    /*
     * Calculate percentage
     */
    attempt.percentage =
      totalMarks > 0
        ? (attempt.score / totalMarks) * 100
        : 0;

    /*
     * Get passing percentage
     */
    const quiz =
      await this.quizRepo.findOne({
        where: {
          id: attempt.quizId,
        },
      });

    attempt.passed =
      attempt.percentage >=
      (quiz?.passingPercentage ?? 40);

    attempt.xpEarned =
      attempt.score;

    attempt.reviewed = true;

    await this.repo.save(
      attempt,
    );

    //     if (attempt.passed) {
    //   await this.checkLessonCompletion(
    //     attempt.userId,
    //     quiz!.lessonId,
    //   );
    // }

    let courseCompleted = false;

    if (
      attempt.passed &&
      quiz
    ) {
      courseCompleted =
        await this.finishLessonIfPassed(
          attempt.userId,
          quiz.lessonId,
        );
    }

    const user =
      await this.userRepo.findOne({
        where: {
          id: attempt.userId,
        },
      });

    if (user) {
      user.xp += score;

      user.level =
        Math.floor(
          user.xp / 100,
        ) + 1;

      await this.userRepo.save(
        user,
      );

      await this.evaluateBadges(
        user,
      );
    }

    return {
      attempt,
      courseCompleted,
    };
  }

  findAll() {
    return this.repo.find({
      order: {
        submittedAt:
          "DESC",
      },
    });
  }

  findByUser(
    userId: number,
  ) {
    return this.repo.find({
      where: {
        userId,
      },

      order: {
        submittedAt:
          "DESC",
      },
    });
  }

  findByQuiz(
    quizId: number,
  ) {
    return this.repo.find({
      where: {
        quizId,
      },
    });
  }

  async findUserQuizAttempt(
    userId: number,
    quizId: number,
  ) {
    const attempt =
      await this.repo.findOne({
        where: {
          userId,
          quizId,
        },
      });

    if (!attempt) {
      return null;
    }

    const quiz =
      await this.quizRepo.findOne({
        where: {
          id: quizId,
        },
      });

    let courseCompleted = false;

    if (quiz) {
      const lesson =
        await this.lessonRepo.findOne({
          where: {
            id: quiz.lessonId,
          },
        });

      if (lesson) {
        const progress =
          await this.courseProgressService.findProgress(
            userId,
            lesson.courseId,
          );

        courseCompleted =
          progress?.completed ?? false;
      }
    }

    return {
      ...attempt,
      courseCompleted,
    };
  }
}