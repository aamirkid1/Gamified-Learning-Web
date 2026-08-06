"use client";

import { useState, useEffect } from "react";

export default function TeacherFlashcardsPage() {
  const [deckName, setDeckName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");

  const [courses, setCourses] = useState([]);
  
  const [selectedDeck, setSelectedDeck] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [editingCardId, setEditingCardId] = useState(null);

  const [decks, setDecks] = useState([]);

  useEffect(() => {
    fetchDecks();
    fetchCourses();
  }, []);

  const fetchDecks = async () => {
    try {
      const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const response = await fetch(
  `http://localhost:3000/flashcards/decks/teacher/${user.id}`
);

      const data = await response.json();

      const formattedDecks = data.map((deck) => ({
        ...deck,
        cards: [],
      }));

      setDecks(formattedDecks);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchCourses = async () => {
    try {
      const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const response = await fetch(
  `http://localhost:3000/courses/teacher/${user.id}`
);

      const data = await response.json();

      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCards = async (deckId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/flashcards/decks/${deckId}/cards`
      );

      const cards = await response.json();

      const updatedDecks = decks.map((deck) =>
        deck.id === deckId
          ? { ...deck, cards }
          : deck
      );

      setDecks(updatedDecks);

      const updatedDeck = updatedDecks.find(
        (deck) => deck.id === deckId
      );

      setSelectedDeck(updatedDeck);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateDeck = async () => {
    if (!deckName.trim()) {
      alert("Please enter a deck name");
      return;
    }

    try {
      const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const response = await fetch(
  "http://localhost:3000/flashcards/decks",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: deckName,
      description,
      courseId: Number(course),
      teacherId: user.id,
    }),
  }
);

      const newDeck = await response.json();

      setDecks([...decks, { ...newDeck, cards: [] }]);

      setDeckName("");
      setDescription("");
      setCourse("");

    } catch (error) {
      console.error(error);
      alert("Failed to create deck");
    }
  };

  const handleDeleteDeck = async (deckId) => {
    try {
      await fetch(
        `http://localhost:3000/flashcards/decks/${deckId}`,
        {
          method: "DELETE",
        }
      );

      setDecks(
        decks.filter(
          (deck) => deck.id !== deckId
        )
      );

    } catch (error) {
      console.error(error);
      alert("Failed to delete deck");
    }
  };

  const handleAddCard = async () => {
    if (!question.trim() || !answer.trim()) {
      alert("Please enter both question and answer");
      return;
    }

    try {
      await fetch(
        "http://localhost:3000/flashcards/cards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            answer,
            deckId: selectedDeck.id,
          }),
        }
      );

      await fetchCards(selectedDeck.id);

      setQuestion("");
      setAnswer("");

    } catch (error) {
      console.error(error);
      alert("Failed to create card");
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await fetch(
        `http://localhost:3000/flashcards/cards/${cardId}`,
        {
          method: "DELETE",
        }
      );

      await fetchCards(selectedDeck.id);

    } catch (error) {
      console.error(error);
      alert("Failed to delete card");
    }
  };

    const handleEditCard = (card) => {
      setQuestion(card.question);
      setAnswer(card.answer);
      setEditingCardId(card.id);
    };

  const handleUpdateCard = async () => {
    try {
      await fetch(
        `http://localhost:3000/flashcards/cards/${editingCardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            answer,
          }),
        }
      );

      await fetchCards(selectedDeck.id);

      setQuestion("");
      setAnswer("");
      setEditingCardId(null);

    } catch (error) {
      console.error(error);
      alert("Failed to update card");
    }
  };

  return (
    <div className="min-h-screen bg-[#3b130d] text-white">
      {/* Top Strip */}
      <div className="h-2 bg-[#6b1f0f] w-full"></div>

      {/* Header */}
      <header className="bg-[#8b4513] px-6 md:px-12 py-6 shadow-md border-b border-[#6b1f0f]/40">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold">
            Flashcard Decks
          </h1>

          <p className="text-gray-300 mt-2">
            Create and manage study decks for students.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">

        {/* Create Deck Form */}
        <div className="bg-[#6f311c] rounded-2xl p-8 shadow-xl border border-[#8b4513]/60 mb-10">
          <h2 className="text-2xl font-bold mb-6">
            Create New Deck
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Deck Name"
              value={deckName}
              onChange={(e) =>
                setDeckName(e.target.value)
              }
              className="w-full bg-[#431b11] border border-[#8b4513] rounded-xl p-3 text-white placeholder-gray-400"
            />

            <select
              value={course}
              onChange={(e) =>
                setCourse(e.target.value)
              }
              className="w-full bg-[#431b11] border border-[#8b4513] rounded-xl p-3 text-white"
            >
              <option value="">
                Select Course
              </option>

              {courses.map((courseItem) => (
                <option
                  key={courseItem.id}
                  value={courseItem.id}
                >
                  {courseItem.title}
                </option>
              ))}
            </select>

            <textarea
              rows={4}
              placeholder="Deck Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full bg-[#431b11] border border-[#8b4513] rounded-xl p-3 text-white placeholder-gray-400"
            />

            <button
              onClick={handleCreateDeck}
              className="bg-[#8b4513] px-6 py-3 rounded-xl font-semibold hover:bg-[#a0522d] transition"
            >
              Create Deck
            </button>
          </div>
        </div>

        {/* Existing Decks */}
        <h2 className="text-2xl font-bold mb-6">
          Existing Decks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {decks.map((deck) => (
            <div
              key={deck.id}
              className="bg-[#6f311c] rounded-2xl p-8 shadow-xl border border-[#8b4513]/60 hover:border-white/20 hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-4">
                🃏
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {deck.title}
              </h2>

              <p className="text-gray-300 text-sm mb-2">
                Course: {
                  courses.find(
                    (courseItem) =>
                      courseItem.id === deck.courseId
                  )?.title || "Unknown Course"
                }
              </p>

              <p className="text-gray-300 mb-6">
                {deck.cards.length} Cards
              </p>

              <button
                onClick={() => {
                  setQuestion("");
                  setAnswer("");
                  setEditingCardId(null);

                  fetchCards(deck.id);
                }}
                className="w-full bg-[#431b11] py-3 rounded-xl font-semibold hover:bg-[#35140d] transition"
              >
                Edit Deck
              </button>

              <button
                onClick={() =>
                  handleDeleteDeck(deck.id)
                }
                className="w-full mt-3 bg-red-600 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Delete Deck
              </button>
            </div>
          ))}

        </div>
        {selectedDeck && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#6f311c] rounded-2xl p-8 shadow-xl border border-[#8b4513]/60 w-[800px] max-h-[85vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Editing: {selectedDeck.title}
                </h2>

                <button
                  onClick={() => {
                    setSelectedDeck(null);
                    setQuestion("");
                    setAnswer("");
                    setEditingCardId(null);
                  }}
                  className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Question"
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  className="w-full bg-[#431b11] border border-[#8b4513] rounded-xl p-3 text-white"
                />

                <textarea
                  rows={3}
                  placeholder="Answer"
                  value={answer}
                  onChange={(e) =>
                    setAnswer(e.target.value)
                  }
                  className="w-full bg-[#431b11] border border-[#8b4513] rounded-xl p-3 text-white"
                />

                <button
                  onClick={
                    editingCardId
                      ? handleUpdateCard
                      : handleAddCard
                  }
                  className="bg-[#8b4513] px-6 py-3 rounded-xl font-semibold"
                >
                  {editingCardId
                    ? "Update Card"
                    : "Add Card"}
                </button>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">
                    Current Cards
                  </h3>

                  {selectedDeck.cards.length === 0 ? (
                    <p className="text-gray-300">
                      No cards added yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedDeck.cards.map((card) => (
                        <div
                          key={card.id}
                          className="bg-[#431b11] p-4 rounded-xl border border-[#8b4513]"
                        >
                          <p>
                            <strong>Q:</strong> {card.question}
                          </p>

                          <p className="mt-2">
                            <strong>A:</strong> {card.answer}
                          </p>

                          <div className="mt-4 flex gap-3">

                            <button
                              onClick={() =>
                                handleEditCard(card)
                              }
                              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteCard(card.id)
                              }
                              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
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
      </main>
    </div>
  );
}




