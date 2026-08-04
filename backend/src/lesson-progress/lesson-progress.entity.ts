import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class LessonProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  studentId!: number;

  @Column()
  lessonId!: number;

  @Column({
    default: false,
  })
  completed!: boolean;

  @CreateDateColumn()
  completedAt!: Date;
}