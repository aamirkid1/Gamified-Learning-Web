import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UserBadge } from './user-badge.entity';

import { UserBadgeController } from './user-badge.controller';

import { UserBadgeService } from './user-badge.service';
import { Badge } from '../badge/badge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserBadge,
      Badge,
    ]),
  ],

  controllers: [
    UserBadgeController,
  ],

  providers: [
    UserBadgeService,
  ],

  exports: [
    UserBadgeService,
  ],
})
export class UserBadgeModule {}