import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/user.entity';

import { LeaderboardController } from './leaderboard.controller';

import { LeaderboardService } from './leaderboard.service';
import { UserBadgeModule }
from '../user-badge/user-badge.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    UserBadgeModule,
  ],

  controllers: [
    LeaderboardController,
  ],

  providers: [
    LeaderboardService,
  ],
})
export class LeaderboardModule {}