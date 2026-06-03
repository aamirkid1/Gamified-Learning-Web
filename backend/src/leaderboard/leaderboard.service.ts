import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { UserBadgeService } from '../user-badge/user-badge.service';

@Injectable()
export class LeaderboardService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,

        private userBadgeService: UserBadgeService,
    ) { }

    async getLeaderboard() {
        return this.userRepo.find({
            where: {
                role: 'student',
            },

            select: {
                id: true,
                name: true,
                xp: true,
                level: true,
            },

            order: {
                xp: 'DESC',
            },
        });
    }

    private async getStudentRank(
        userId: number,
    ): Promise<number> {
        const users =
            await this.userRepo.find({
                where: {
                    role: 'student',
                },

                order: {
                    xp: 'DESC',
                },
            });

        return (
            users.findIndex(
                (user) => user.id === userId,
            ) + 1
        );
    }

    async evaluateTopPerformer(
        userId: number,
    ) {
        const rank =
            await this.getStudentRank(
                userId,
            );

        if (
            rank > 0 &&
            rank <= 10
        ) {
            await this.userBadgeService.awardBadge(
                userId,
                5,
            );
        }
    }

    async getMyRank(
        userId: number,
    ) {
        const users =
            await this.userRepo.find({
                where: {
                    role: 'student',
                },

                order: {
                    xp: 'DESC',
                },
            });

        const rank =
            users.findIndex(
                (user) =>
                    user.id === userId,
            ) + 1;

        const currentUser =
            users.find(
                (user) =>
                    user.id === userId,
            );

        // Check if user deserves Top Performer badge
        await this.evaluateTopPerformer(
            userId,
        );

        return {
            rank,
            xp: currentUser?.xp || 0,
            level:
                currentUser?.level || 1,
        };
    }
}