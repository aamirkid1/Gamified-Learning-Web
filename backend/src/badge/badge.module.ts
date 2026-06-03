import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Badge } from './badge.entity';

import { BadgeController } from './badge.controller';

import { BadgeService } from './badge.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Badge,
    ]),
  ],

  controllers: [
    BadgeController,
  ],

  providers: [
    BadgeService,
  ],

  exports: [
    BadgeService,
  ],
})
export class BadgeModule {}