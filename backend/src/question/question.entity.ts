import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quizId!: number;

  @Column()
  question!: string;

  @Column()
  type!: string;

  @Column({ nullable: true })
  optionA!: string;

  @Column({ nullable: true })
  optionB!: string;

  @Column({ nullable: true })
  optionC!: string;

  @Column({ nullable: true })
  optionD!: string;

  @Column({ nullable: true })
  correctAnswers!: string;

  @Column({
    type: 'int',
    default: 10,
  })
  marks!: number;
}