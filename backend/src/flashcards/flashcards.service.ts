import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FlashcardDeck } from './flashcard_deck.entity';
import { FlashcardCard } from './flashcard_card.entity';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectRepository(FlashcardDeck)
    private deckRepository: Repository<FlashcardDeck>,

    @InjectRepository(FlashcardCard)
    private cardRepository: Repository<FlashcardCard>,
  ) {}

  createDeck(deckData: Partial<FlashcardDeck>) {
    const deck = this.deckRepository.create(deckData);
    return this.deckRepository.save(deck);
  }

  getAllDecks() {
    return this.deckRepository.find();
  }

  async deleteDeck(id: number) {
    await this.deckRepository.delete(id);

    return {
      message: 'Deck deleted successfully',
    };
  }

  createCard(cardData: Partial<FlashcardCard>) {
    const card = this.cardRepository.create(cardData);
    return this.cardRepository.save(card);
  }

  getCardsByDeck(deckId: number) {
    return this.cardRepository.find({
      where: { deckId },
    });
  }

  async updateCard(
    id: number,
    cardData: Partial<FlashcardCard>,
  ) {
    await this.cardRepository.update(id, cardData);

    return this.cardRepository.findOne({
      where: { id },
    });
  }

  async deleteCard(id: number) {
    await this.cardRepository.delete(id);

    return {
      message: 'Card deleted successfully',
    };
  }
}