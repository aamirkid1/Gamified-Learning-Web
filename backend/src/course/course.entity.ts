import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { User } from "../user/user.entity";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ nullable: true })
  thumbnail!: string;

  /*
   * Teacher who owns this course
   */
  @ManyToOne(
    () => User,
    (user) => user.courses,
    {
      eager: true,
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({
    name: "teacherId",
  })
  teacher!: User;
}