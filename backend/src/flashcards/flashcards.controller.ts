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