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
    private lessonProgressService: LessonProgressService,
  ) {}

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

  private async checkLessonCompletion(
  userId: number,
  lessonId: number,
) {
  /*
   * Get all required quizzes of this lesson
   */
  const quizzes =
    await this.quizRepo.find({
      where: {
        lessonId,
        isRequired: true,
      },
    });

  if (quizzes.length === 0) {
    return;
  }

  /*
   * Check if every required quiz is passed
   */
  for (const quiz of quizzes) {
    const attempt =
      await this.repo.findOne({
        where: {
          userId,
          quizId: quiz.id,
          passed: true,
        },
      });

    if (!attempt) {
      return;
    }
  }

  /*
   * All quizzes passed
   */
  await this.lessonProgressService.completeLesson(
    userId,
    lessonId,
  );
}

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

    const attempt = this.repo.create({
      ...data,
      mcqScore: data.score,
      shortAnswerScore: 0,
    });

    const savedAttempt =
      await this.repo.save(attempt);

    const user =
      await this.userRepo.findOne({
        where: {
          id: data.userId,
        },
      });

    if (user) {
      user.xp += data.xpEarned;

      user.level =
        Math.floor(user.xp / 100) + 1;

      await this.userRepo.save(user);

      await this.evaluateBadges(user);
    }

    return {
      message: "Quiz submitted successfully",
      attempt: savedAttempt,
      xp: user?.xp,
      level: user?.level,
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

    if (attempt.passed) {
  await this.checkLessonCompletion(
    attempt.userId,
    quiz!.lessonId,
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

    return attempt;
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

    return attempt || null;
  }
}