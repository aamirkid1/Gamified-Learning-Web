import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true, unique: true })
  rollNo!: string;

  @Column({ nullable: true, unique: true })
  studentId!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    default: "student",
  })
  role!: string;

  @Column({ default: 0 })
  xp!: number;

  @Column({ default: 1 })
  level!: number;
}