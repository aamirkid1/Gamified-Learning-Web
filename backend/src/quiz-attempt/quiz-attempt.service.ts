import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { QuizAttempt } from './quiz-attempt.entity';

import { User } from '../user/user.entity';

import { UserBadgeService } from '../user-badge/user-badge.service';

import { BadgeService } from '../badge/badge.service';

@Injectable()
export class QuizAttemptService {
    constructor(
        @InjectRepository(QuizAttempt)
        private repo: Repository<QuizAttempt>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        private userBadgeService: UserBadgeService,

        private badgeService: BadgeService,
    ) { }

    private async evaluateBadges(user: User) {
        const totalAttempts =
            await this.repo.count({
                where: {
                    userId: user.id,
                },
            });

        // Scholar
        if (totalAttempts >= 1) {
            await this.userBadgeService.awardBadge(
                user.id,
                1,
            );
        }

        // Expert
        if (user.level >= 5) {
            await this.userBadgeService.awardBadge(
                user.id,
                2,
            );
        }

        // Fast Learner
        if (totalAttempts >= 5) {
            await this.userBadgeService.awardBadge(
                user.id,
                4,
            );
        }
    }

    async create(data: any) {
        const existingAttempt =
            await this.repo.findOne({
                where: {
                    userId: data.userId,
                    quizId: data.quizId,
                },
            });

        if (existingAttempt) {
            return {
                message: 'Quiz already attempted',
            };
        }

        const attempt =
            this.repo.create(data);

        const savedAttempt =
            await this.repo.save(
                attempt,
            );

        const user =
            await this.userRepo.findOne({
                where: {
                    id: data.userId,
                },
            });

        if (user) {
            user.xp += data.xpEarned;

            user.level =
                Math.floor(
                    user.xp / 100,
                ) + 1;

            await this.userRepo.save(
                user,
            );

            await this.evaluateBadges(
                user,
            );
        }

        return {
            message:
                'Quiz submitted successfully',

            attempt:
                savedAttempt,

            xp:
                user?.xp,

            level:
                user?.level,
        };
    }

    //   async getPending() {
    //     return this.repo.find({
    //       where: {
    //         reviewed: false,
    //       },
    //       order: {
    //         submittedAt: 'DESC',
    //       },
    //     });
    //   }

    async getPending() {
        const attempts =
            await this.repo.find({
                where: {
                    reviewed: false,
                },

                order: {
                    submittedAt: 'DESC',
                },
            });

        return attempts.filter(
            (attempt) => {
                const answers =
                    JSON.parse(
                        attempt.answers
                    );

                return Object.values(
                    answers
                ).some(
                    (a) =>
                        typeof a ===
                        'string'
                );
            },
        );
    }

    async reviewAttempt(
        attemptId: number,
        score: number,
    ) {
        const attempt =
            await this.repo.findOne({
                where: {
                    id: attemptId,
                },
            });

        if (!attempt) {
            return {
                message:
                    'Attempt not found',
            };
        }

        if (attempt.reviewed) {
            return {
                message:
                    'Already reviewed',
            };
        }

        attempt.teacherScore =
            score;

        attempt.score = score;

        attempt.xpEarned = score;

        attempt.reviewed = true;

        await this.repo.save(
            attempt,
        );

        const user =
            await this.userRepo.findOne({
                where: {
                    id: attempt.userId,
                },
            });

        if (user) {
            user.xp += score;

            user.level =
                Math.floor(
                    user.xp / 100,
                ) + 1;

            await this.userRepo.save(
                user,
            );

            await this.evaluateBadges(
                user,
            );
        }

        return attempt;
    }

    findAll() {
        return this.repo.find({
            order: {
                submittedAt:
                    'DESC',
            },
        });
    }

    findByUser(
        userId: number,
    ) {
        return this.repo.find({
            where: {
                userId,
            },

            order: {
                submittedAt:
                    'DESC',
            },
        });
    }

    findByQuiz(
        quizId: number,
    ) {
        return this.repo.find({
            where: {
                quizId,
            },
        });
    }

    async findUserQuizAttempt(
        userId: number,
        quizId: number,
    ) {
        const attempt =
            await this.repo.findOne({
                where: {
                    userId,
                    quizId,
                },
            });

        return attempt || null;
    }
}