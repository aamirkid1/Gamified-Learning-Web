import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FlashcardDeck } from './flashcard_deck.entity';
import { FlashcardCard } from './flashcard_card.entity';

import { FlashcardsController } from './flashcards.controller';
import { FlashcardsService } from './flashcards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FlashcardDeck,
      FlashcardCard,
    ]),
  ],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
})
export class FlashcardsModule {}