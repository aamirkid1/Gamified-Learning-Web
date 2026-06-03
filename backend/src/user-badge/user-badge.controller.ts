import {
  Controller,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';

import { UserBadgeService } from './user-badge.service';

@Controller('user-badges')
export class UserBadgeController {
  constructor(
    private userBadgeService: UserBadgeService,
  ) {}

  @Post()
  create(
    @Body() body,
  ) {
    return this.userBadgeService.create(
      body,
    );
  }

  @Get()
  findAll() {
    return this.userBadgeService.findAll();
  }

  @Get(
    'user/:userId',
  )
  findByUser(
    @Param('userId')
    userId: string,
  ) {
    return this.userBadgeService.findByUser(
      Number(userId),
    );
  }
}