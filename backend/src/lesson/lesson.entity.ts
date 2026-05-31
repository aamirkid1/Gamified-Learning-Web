import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column({ nullable: true })
  videoUrl!: string;

  @Column({ nullable: true })
  pdfUrl!: string;

  @Column()
  courseId!: number;
}