import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class FlashcardCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  question!: string;

  @Column('text')
  answer!: string;

  @Column()
  deckId!: number;
}