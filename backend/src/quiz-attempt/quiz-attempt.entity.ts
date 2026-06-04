import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  quizId!: number;

  @Column({
    default: 0,
  })
  score!: number;

  @Column({
    default: 0,
  })
  xpEarned!: number;

  @Column({
    default: false,
  })
  reviewed!: boolean;

  @Column({
    default: 0,
  })
  teacherScore!: number;

  @Column({
    type: 'text',
  })
  answers!: string;

  @CreateDateColumn()
  submittedAt!: Date;
}