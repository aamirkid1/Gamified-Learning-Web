import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private leaderboardService: LeaderboardService,
  ) {}

  @Get()
  getLeaderboard() {
    return this.leaderboardService.getLeaderboard();
  }

  @Get('me/:id')
  getMyRank(
    @Param('id') id: string,
  ) {
    return this.leaderboardService.getMyRank(
      Number(id),
    );
  }
}