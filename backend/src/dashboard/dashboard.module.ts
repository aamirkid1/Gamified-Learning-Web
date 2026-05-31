import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Course } from '../course/course.entity';
import { Lesson } from '../lesson/lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Lesson,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}