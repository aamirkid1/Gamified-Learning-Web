import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  lessonId!: number;

  @Column()
  courseId!: number;

  @Column({
  default: 40,
})
passingPercentage!: number;

@Column({
  default: true,
})
isRequired!: boolean;
}