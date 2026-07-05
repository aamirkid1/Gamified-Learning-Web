import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { FlashcardsService } from './flashcards.service';

@Controller('flashcards')
export class FlashcardsController {
  constructor(
    private readonly flashcardsService: FlashcardsService,
  ) {}

  @Post('decks')
  createDeck(@Body() body: any) {
    return this.flashcardsService.createDeck(body);
  }

  @Get('decks')
  getAllDecks() {
    return this.flashcardsService.getAllDecks();
  }

  @Get('student/:studentId/decks')
  getStudentDecks(
    @Param('studentId') studentId: string,
  ) {
    return this.flashcardsService.getStudentDecks(
      Number(studentId),
    );
  }

  @Post('personal-decks')
  createPersonalDeck(
    @Body() body: any,
  ) {
    return this.flashcardsService.createPersonalDeck(
      body,
    );
  }

  @Get('personal-decks/student/:studentId')
  getPersonalDecks(
    @Param('studentId') studentId: string,
  ) {
    return this.flashcardsService.getPersonalDecks(
      Number(studentId),
    );
  }

  @Post('personal-cards')
  createPersonalCard(
    @Body() body: any,
  ) {
    return this.flashcardsService.createPersonalCard(
      body,
    );
  }

  @Get('personal-decks/:deckId/cards')
  getPersonalCards(
    @Param('deckId') deckId: string,
  ) {
    return this.flashcardsService.getPersonalCards(
      Number(deckId),
    );
  }

  @Delete('personal-cards/:id')
    deletePersonalCard(
      @Param('id') id: string,
    ) {
      return this.flashcardsService.deletePersonalCard(
        Number(id),
      );
    }

  @Delete('decks/:id')
    deleteDeck(
      @Param('id') id: number,
  ) {
      return this.flashcardsService.deleteDeck(
        Number(id),
      );
  }

  @Post('cards')
  createCard(@Body() body: any) {
    return this.flashcardsService.createCard(body);
  }

  @Get('decks/:deckId/cards')
  getCards(
    @Param('deckId') deckId: number,
  ) {
    return this.flashcardsService.getCardsByDeck(
      Number(deckId),
    );
  }

  @Put('cards/:id')
  updateCard(
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.flashcardsService.updateCard(
      Number(id),
      body,
    );
  }

  @Delete('cards/:id')
  deleteCard(
    @Param('id') id: number,
  ) {
    return this.flashcardsService.deleteCard(
      Number(id),
    );
  }
}