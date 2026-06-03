import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserBadge } from './user-badge.entity';

import { Badge } from '../badge/badge.entity';


@Injectable()
export class UserBadgeService {
  constructor(
    @InjectRepository(UserBadge)
    private repo: Repository<UserBadge>,

    @InjectRepository(Badge)
    private badgeRepo: Repository<Badge>,
  ) {}

  create(data: any) {
    const badge =
      this.repo.create(data);

    return this.repo.save(
      badge,
    );
  }

  findAll() {
    return this.repo.find({
      order: {
        earnedAt: 'DESC',
      },
    });
  }

  async findByUser(
    userId: number,
  ) {
    const userBadges =
      await this.repo.find({
        where: { userId },

        order: {
          earnedAt: 'DESC',
        },
      });

    const badges: Badge[] = [];

    for (const item of userBadges) {
      const badge =
        await this.badgeRepo.findOne({
          where: {
            id: item.badgeId,
          },
        });

      if (badge) {
        badges.push(badge);
      }
    }

    return badges;
  }

  async hasBadge(
    userId: number,
    badgeId: number,
  ) {
    const badge =
      await this.repo.findOne({
        where: {
          userId,
          badgeId,
        },
      });

    return !!badge;
  }

  async awardBadge(
    userId: number,
    badgeId: number,
  ) {
    const exists =
      await this.hasBadge(
        userId,
        badgeId,
      );

    if (exists) {
      return;
    }

    const badge =
      this.repo.create({
        userId,
        badgeId,
      });

    return this.repo.save(
      badge,
    );
  }
}