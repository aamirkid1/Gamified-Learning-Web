"use client";

import { useState } from "react";

export default function StudentFlashcardsPage() {
    const [selectedDeck, setSelectedDeck] =
        useState(null);

    const [question, setQuestion] =
        useState("");

    const [answer, setAnswer] =
        useState("");

    const [editingCardId, setEditingCardId] =
        useState(null);

  const [courseDecks] = useState([]);

  const [personalDecks, setPersonalDecks] =
    useState([]);

  const [deckName, setDeckName] =
    useState("");

  const createPersonalDeck = () => {
    if (!deckName.trim()) {
      alert("Enter a deck name");
      return;
    }

    const newDeck = {
      id: Date.now(),
      title: deckName,
      cards: [],
    };

    setPersonalDecks([
      ...personalDecks,
      newDeck,
    ]);

    setDeckName("");
  };

  const handleAddCard = () => {
    if (!question.trim() || !answer.trim()) {
      alert("Please enter both question and answer");
      return;
    }

    let updatedDecks;

    if (editingCardId) {
      updatedDecks = personalDecks.map((deck) =>
        deck.id === selectedDeck.id
          ? {
              ...deck,
              cards: deck.cards.map((card) =>
                card.id === editingCardId
                  ? {
                      ...card,
                      question,
                      answer,
                    }
                  : card
              ),
            }
          : deck
      );
    } else {
      const newCard = {
        id: Date.now(),
        question,
        answer,
      };

      updatedDecks = personalDecks.map((deck) =>
        deck.id === selectedDeck.id
          ? {
              ...deck,
              cards: [...deck.cards, newCard],
            }
          : deck
      );
    }

    setPersonalDecks(updatedDecks);

    const updatedSelectedDeck =
      updatedDecks.find(
        (deck) => deck.id === selectedDeck.id
      );

    setSelectedDeck(updatedSelectedDeck);

    setQuestion("");
    setAnswer("");
    setEditingCardId(null);
  };

  const handleDeleteCard = (cardId) => {
    const updatedDecks = personalDecks.map((deck) =>
      deck.id === selectedDeck.id
        ? {
            ...deck,
            cards: deck.cards.filter(
              (card) => card.id !== cardId
            ),
          }
        : deck
    );

    setPersonalDecks(updatedDecks);

    const updatedSelectedDeck =
      updatedDecks.find(
        (deck) => deck.id === selectedDeck.id
      );

    setSelectedDeck(updatedSelectedDeck);
  };

  return (
    <div className="space-y-10">

      <h1 className="text-4xl font-extrabold text-[#3b130d]">
        Flashcards
      </h1>

      {/* Course Decks */}

      <div className="bg-white rounded-2xl p-8 shadow">

        <h2 className="text-2xl font-bold mb-6 text-[#3b130d]">
          Course Decks
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {courseDecks.map((deck) => (
            <div
              key={deck.id}
              className="border rounded-xl p-6"
            >
              <h3 className="font-bold text-xl">
                {deck.title}
              </h3>

              <p className="text-gray-500 mt-2">
                {deck.course}
              </p>

              <p className="mt-2">
                {deck.cards} Cards
              </p>

              <button
                className="mt-4 bg-[#8b4513] text-white px-5 py-2 rounded-lg"
              >
                Study
              </button>
            </div>
          ))}

        </div>
      </div>

      {/* Personal Decks */}

      <div className="bg-white rounded-2xl p-8 shadow">

        <h2 className="text-2xl font-bold mb-6 text-[#3b130d]">
          My Personal Decks
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {personalDecks.map((deck) => (
            <div
              key={deck.id}
              className="border rounded-xl p-6"
            >
              <h3 className="font-bold text-xl">
                {deck.title}
              </h3>

              <p className="mt-2">
                {deck.cards.length} Cards
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  className="bg-[#8b4513] text-white px-5 py-2 rounded-lg"
                >
                  Study
                </button>

                <button
                  onClick={() => {
                    setSelectedDeck(deck);
                    setQuestion("");
                    setAnswer("");
                    setEditingCardId(null);
                  }}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Create Personal Deck */}

      <div className="bg-white rounded-2xl p-8 shadow">

        <h2 className="text-2xl font-bold mb-6 text-[#3b130d]">
          Create Personal Deck
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Deck Name"
            value={deckName}
            onChange={(e) =>
              setDeckName(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          />

          <button
            onClick={createPersonalDeck}
            className="bg-[#8b4513] text-white px-6 py-3 rounded-xl"
          >
            Create Deck
          </button>

        </div>

      </div>

        {selectedDeck && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow w-[700px] max-h-[80vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#3b130d]">
                  Editing: {selectedDeck.title}
                </h2>

                <button
                  onClick={() => setSelectedDeck(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border rounded-xl p-3"
                />

                <textarea
                  rows={3}
                  placeholder="Answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full border rounded-xl p-3"
                />

                <button
                  onClick={handleAddCard}
                  className="bg-[#8b4513] text-white px-6 py-3 rounded-xl"
                >
                  {editingCardId ? "Update Card" : "Add Card"}
                </button>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-[#3b130d]">
                    Current Cards
                  </h3>

                  {selectedDeck.cards.length === 0 ? (
                    <p className="text-gray-500">
                      No cards added yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedDeck.cards.map((card) => (
                        <div
                          key={card.id}
                          className="border rounded-xl p-4"
                        >
                          <p>
                            <strong>Q:</strong> {card.question}
                          </p>

                          <p className="mt-2">
                            <strong>A:</strong> {card.answer}
                          </p>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => {
                                setQuestion(card.question);
                                setAnswer(card.answer);
                                setEditingCardId(card.id);
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteCard(card.id)
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

    </div>
  );
}