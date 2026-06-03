import {
  Controller,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';

import { BadgeService } from './badge.service';

@Controller('badges')
export class BadgeController {
  constructor(
    private badgeService: BadgeService,
  ) {}

  @Post()
  create(
    @Body() body,
  ) {
    return this.badgeService.create(
      body,
    );
  }

  @Get()
  findAll() {
    return this.badgeService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.badgeService.findOne(
      Number(id),
    );
  }
}