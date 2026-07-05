import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { FlashcardDeck } from './flashcard_deck.entity';
import { FlashcardCard } from './flashcard_card.entity';

import { Enrollment } from '../enrollment/enrollment.entity';

import { PersonalDeck } from './personal_deck.entity';
import { PersonalCard } from './personal_card.entity';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectRepository(FlashcardDeck)
    private deckRepository: Repository<FlashcardDeck>,

    @InjectRepository(FlashcardCard)
    private cardRepository: Repository<FlashcardCard>,

    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(PersonalDeck)
    private personalDeckRepository: Repository<PersonalDeck>,

    @InjectRepository(PersonalCard)
    private personalCardRepository: Repository<PersonalCard>,
  ) {}

  createDeck(deckData: Partial<FlashcardDeck>) {
    const deck = this.deckRepository.create(deckData);
    return this.deckRepository.save(deck);
  }

  getAllDecks() {
    return this.deckRepository.find({
      relations: {
        course: true,
      },
    });
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

  async getStudentDecks(studentId: number) {
    const enrollments =
      await this.enrollmentRepository.find({
        where: { studentId },
      });

    const courseIds = enrollments.map(
      (e) => e.courseId,
    );

    return this.deckRepository.find({
      where: {
        courseId: In(courseIds),
      },
      relations: {
        course: true,
      },
    });
  }

  createPersonalDeck(
    deckData: Partial<PersonalDeck>,
  ) {
    const deck =
      this.personalDeckRepository.create(
        deckData,
      );

    return this.personalDeckRepository.save(
      deck,
    );
  }

  getPersonalDecks(studentId: number) {
    return this.personalDeckRepository.find({
      where: { studentId },
      relations: {
        cards: true,
      },
    });
  }

  createPersonalCard(
    cardData: Partial<PersonalCard>,
  ) {
    const card =
      this.personalCardRepository.create(
        cardData,
      );

    return this.personalCardRepository.save(
      card,
    );
  }

  getPersonalCards(deckId: number) {
    return this.personalCardRepository.find({
      where: { deckId },
    });
  }

  async deletePersonalCard(id: number) {
    await this.personalCardRepository.delete(id);

    return {
      message: 'Personal card deleted successfully',
    };
  }

}