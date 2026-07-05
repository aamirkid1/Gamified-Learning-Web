import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FlashcardDeck } from './flashcard_deck.entity';
import { FlashcardCard } from './flashcard_card.entity';

import { FlashcardsController } from './flashcards.controller';
import { FlashcardsService } from './flashcards.service';

import { Enrollment } from '../enrollment/enrollment.entity';

import { PersonalDeck } from './personal_deck.entity';
import { PersonalCard } from './personal_card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FlashcardDeck,
      FlashcardCard,
      Enrollment,
      PersonalDeck,
      PersonalCard,
    ]),
  ],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
})
export class FlashcardsModule {}