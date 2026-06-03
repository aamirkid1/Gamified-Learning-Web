import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Badge } from './badge.entity';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge)
    private repo: Repository<Badge>,
  ) {}

  create(data: any) {
    const badge =
      this.repo.create(data);

    return this.repo.save(
      badge,
    );
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }
}