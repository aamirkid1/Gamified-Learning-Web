"use client";

import { useState } from "react";
import { useEffect } from "react";

export default function StudentFlashcardsPage() {
    const [selectedDeck, setSelectedDeck] =
        useState(null);

    const [question, setQuestion] =
        useState("");

    const [answer, setAnswer] =
        useState("");

    const [editingCardId, setEditingCardId] =
        useState(null);

  const [courseDecks, setCourseDecks] = useState([]);

  const [personalDecks, setPersonalDecks] =
    useState([]);

  const [deckName, setDeckName] =
    useState("");

  const [studyDeck, setStudyDeck] = useState(null);

  const [studyCards, setStudyCards] = useState([]);

  const [currentCardIndex, setCurrentCardIndex] =
    useState(0);

  const [showAnswer, setShowAnswer] =
    useState(false);

  /*useEffect(() => {
    fetch("http://localhost:3000/flashcards/decks")
        .then((res) => res.json())
        .then((data) => setCourseDecks(data))
        .catch(console.error);
  }, []);*/
  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );
    console.log(user);
    if (!user) return;

    fetch(
      `http://localhost:3000/flashcards/student/${user.id}/decks`
    )
      .then((res) => res.json())
      .then((data) => setCourseDecks(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    fetch(
      `http://localhost:3000/flashcards/personal-decks/student/${user.id}`
    )
      .then((res) => res.json())
      .then((data) => setPersonalDecks(data))
      .catch(console.error);
  }, []);

  const createPersonalDeck = async () => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    if (!deckName.trim()) {
      alert("Enter a deck name");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/flashcards/personal-decks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: deckName,
            studentId: user.id,
          }),
        }
      );

      const newDeck = await res.json();

      setPersonalDecks([
        ...personalDecks,
        newDeck,
      ]);

      setDeckName("");
    } catch (err) {
      console.error(err);
    }
  };

  /*const handleAddCard = () => {
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
  };*/
  const handleAddCard = async () => {
    if (!question.trim() || !answer.trim()) {
      alert("Please enter both question and answer");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/flashcards/personal-cards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deckId: selectedDeck.id,
            question,
            answer,
          }),
        }
      );

      console.log("Status:", response.status);
      console.log("Response:", await response.text());

      const res = await fetch(
        `http://localhost:3000/flashcards/personal-decks/${selectedDeck.id}/cards`
      );

      const cards = await res.json();

      setSelectedDeck({
        ...selectedDeck,
        cards,
      });

      setPersonalDecks(
        personalDecks.map((deck) =>
          deck.id === selectedDeck.id
            ? {
                ...deck,
                cards,
              }
            : deck
        )
      );

      setQuestion("");
      setAnswer("");
      setEditingCardId(null);
    } catch (err) {
      console.error(err);
    }
  };

  /*const handleDeleteCard = (cardId) => {
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
  };*/
  const handleDeleteCard = async (cardId) => {
    try {
      await fetch(
        `http://localhost:3000/flashcards/personal-cards/${cardId}`,
        {
          method: "DELETE",
        }
      );

      const res = await fetch(
        `http://localhost:3000/flashcards/personal-decks/${selectedDeck.id}/cards`
      );

      const cards = await res.json();

      setSelectedDeck({
        ...selectedDeck,
        cards,
      });

      setPersonalDecks(
        personalDecks.map((deck) =>
          deck.id === selectedDeck.id
            ? {
                ...deck,
                cards,
              }
            : deck
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const startStudy = async (deck, isPersonal) => {
    try {
      const url = isPersonal
        ? `http://localhost:3000/flashcards/personal-decks/${deck.id}/cards`
        : `http://localhost:3000/flashcards/decks/${deck.id}/cards`;

      const res = await fetch(url);

      const cards = await res.json();

      setStudyDeck(deck);
      setStudyCards(cards);

      setCurrentCardIndex(0);
      setShowAnswer(false);
      console.log(cards);

    } catch (err) {
      console.error(err);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
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
                {deck.course?.title}
              </p>

              <p className="mt-2">
                {deck.cards} Cards
              </p>

              <button
                onClick={() => startStudy(deck, false)}
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
                  onClick={() => startStudy(deck, true)}
                  className="bg-[#8b4513] text-white px-5 py-2 rounded-lg"
                >
                  Study
                </button>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `http://localhost:3000/flashcards/personal-decks/${deck.id}/cards`
                      );

                      const cards = await res.json();
                      
                      setSelectedDeck({
                        ...deck,
                        cards,
                      });

                      setQuestion("");
                      setAnswer("");
                      setEditingCardId(null);
                    } catch (err) {
                      console.error(err);
                    }
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

      {studyDeck && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow w-[700px]">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-[#3b130d]">
                Studying: {studyDeck.title}
              </h2>

              <button
                onClick={() => setStudyDeck(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>

            </div>

            {studyCards.length === 0 ? (

              <p className="text-gray-500">
                This deck has no cards.
              </p>

            ) : (

              <>

                <p className="text-gray-500 mb-4">
                  Card {currentCardIndex + 1} of {studyCards.length}
                </p>

                <div className="border rounded-xl p-6">

                  <h3 className="font-bold text-xl">
                    {studyCards[currentCardIndex].question}
                  </h3>

                  {showAnswer && (

                    <div className="mt-6 border-t pt-4">

                      <p>
                        {studyCards[currentCardIndex].answer}
                      </p>

                    </div>

                  )}

                </div>

                {!showAnswer ? (

                  <button
                    onClick={() => setShowAnswer(true)}
                    className="mt-6 bg-[#8b4513] text-white px-6 py-3 rounded-lg"
                  >
                    Show Answer
                  </button>

                ) : (

                  <button
                    onClick={() => setShowAnswer(false)}
                    className="mt-6 bg-gray-500 text-white px-6 py-3 rounded-lg"
                  >
                    Hide Answer
                  </button>

                )}

                <div className="flex justify-between mt-8">

                  <button
                    onClick={previousCard}
                    disabled={currentCardIndex === 0}
                    className="bg-gray-500 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={nextCard}
                    disabled={currentCardIndex === studyCards.length - 1}
                    className="bg-[#8b4513] text-white px-5 py-2 rounded-lg disabled:opacity-50"
                  >
                    Next →
                  </button>

                </div>

              </>

            )}

          </div>
        </div>
      )}

    </div>
  );
}