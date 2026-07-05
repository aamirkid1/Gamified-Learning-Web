/*import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class PersonalCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  deckId!: number;

  @Column()
  question!: string;

  @Column()
  answer!: string;
}*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PersonalDeck } from './personal_deck.entity';

@Entity()
export class PersonalCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  deckId!: number;

  @Column()
  question!: string;

  @Column()
  answer!: string;

  @ManyToOne(
    () => PersonalDeck,
    (deck) => deck.cards,
  )
  @JoinColumn({ name: 'deckId' })
  deck!: PersonalDeck;
}