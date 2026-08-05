import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UploadModule } from './uploads/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { QuizAttemptModule } from './quiz-attempt/quiz-attempt.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { BadgeModule } from './badge/badge.module';
import { UserBadgeModule } from './user-badge/user-badge.module';

import { FlashcardsModule } from './flashcards/flashcards.module';

import { EnrollmentModule } from './enrollment/enrollment.module';

import { LessonProgressModule } from "./lesson-progress/lesson-progress.module";
import { CourseProgressModule } from "./course-progress/course-progress.module";

@Module({
  imports: [

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'gamified_app',
      autoLoadEntities: true,
      synchronize: true,
    }),

    UserModule,
    CourseModule,
    LessonModule,
    DashboardModule,
    UploadModule,
    QuizModule,
    QuestionModule,
    QuizAttemptModule,
    LeaderboardModule,
    BadgeModule,
    UserBadgeModule,
    FlashcardsModule,
    EnrollmentModule,
    LessonProgressModule,
    CourseProgressModule,
  ],
})
export class AppModule { }