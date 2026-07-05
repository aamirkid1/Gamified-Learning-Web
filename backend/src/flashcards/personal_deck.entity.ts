/*import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class PersonalDeck {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  studentId!: number;
}*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { PersonalCard } from './personal_card.entity';

@Entity()
export class PersonalDeck {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  studentId!: number;

  @OneToMany(
    () => PersonalCard,
    (card) => card.deck,
  )
  cards!: PersonalCard[];
}