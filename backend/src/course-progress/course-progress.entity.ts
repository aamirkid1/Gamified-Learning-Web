import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class CourseProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  studentId!: number;

  @Column()
  courseId!: number;

  @Column({
    default: false,
  })
  completed!: boolean;

  @CreateDateColumn()
  completedAt!: Date;

  @Column({
    default: false,
  })
  certificateGenerated!: boolean;

  @Column({
    nullable: true,
  })
  certificateId!: string;
}