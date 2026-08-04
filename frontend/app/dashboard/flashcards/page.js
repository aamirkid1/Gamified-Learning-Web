"use client";

import { useState } from "react";
import { useEffect } from "react";

import {
  BookOpen,
  Book,
  Notebook,
  Play,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Trash2,
  Layers,
} from "lucide-react";

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


  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );
    //console.log(user);
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

  const studyProgress =
    studyCards.length > 0
      ? ((currentCardIndex + 1) / studyCards.length) * 100
      : 0;

  return (
    <div className="space-y-10 pb-10">

      {/* PAGE HEADER */}
      <div className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight text-[#3b130d]">
          Flashcards
        </h1>
        <p className="text-neutral-500 text-base sm:text-lg">
          Master your concepts using spaced repetition.
        </p>
        <p className="text-neutral-500 text-base sm:text-lg">
          Review your decks and track your progress.
        </p>
      </div>

      {/* Course Decks */}

      <div className="bg-white rounded-3xl px-6 py-8 sm:px-8 sm:py-8 shadow-md shadow-black/5 border border-black/5">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#8b4513]/10 flex items-center justify-center">
            <BookOpen size={20} className="text-[#8b4513]" />
          </div>
          <h2 className="text-2xl font-bold text-[#3b130d]">
            Course Decks
          </h2>
        </div>

        {courseDecks.length === 0 ? (

          <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed border-[#8b4513]/25 bg-[#f5f1ed]/50">
            <div className="w-16 h-16 rounded-2xl bg-[#8b4513]/10 flex items-center justify-center mb-4">
              <Book size={28} className="text-[#8b4513]" />
            </div>
            <h3 className="text-xl font-bold text-[#3b130d]">
              No Course Flashcards Yet
            </h3>
            <p className="text-neutral-500 mt-2 max-w-sm">
              Enroll in a course to unlock flashcards.
            </p>
            <a
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#8b4513] to-[#a0522d] text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-black/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out"
            >
              Browse Courses
            </a>
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {courseDecks.map((deck) => (
              <div
                key={deck.id}
                className="group border border-black/5 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out bg-white flex flex-col"
              >
                <div className="w-11 h-11 rounded-xl bg-[#8b4513]/10 flex items-center justify-center mb-4 group-hover:bg-[#8b4513]/15 transition-colors duration-300">
                  <BookOpen size={22} className="text-[#8b4513]" />
                </div>

                <h3 className="font-bold text-xl text-[#3b130d]">
                  {deck.title}
                </h3>

                <p className="text-gray-500 mt-1 text-sm">
                  {deck.course?.title}
                </p>

                <p className="mt-3 text-sm font-medium text-neutral-600">
                  {deck.cards} Cards
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                    <span>Progress</span>
                    <span>{deck.progress ?? 0}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f5f1ed] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8b4513] to-[#a0522d] transition-all duration-500 ease-in-out"
                      style={{ width: `${deck.progress ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-4 text-xs text-neutral-400">
                  <Clock size={13} />
                  <span>
                    Last studied: {deck.lastStudied || "Not studied yet"}
                  </span>
                </div>

                <button
                  onClick={() => startStudy(deck, false)}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b4513] to-[#a0522d] text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-black/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out"
                >
                  <Play size={16} className="fill-white" />
                  Study
                </button>
              </div>
            ))}

          </div>

        )}
      </div>

      {/* Personal Decks */}

      <div className="bg-white rounded-3xl px-6 py-8 sm:px-8 sm:py-8 shadow-md shadow-black/5 border border-black/5">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#8b4513]/10 flex items-center justify-center">
            <Notebook size={20} className="text-[#8b4513]" />
          </div>
          <h2 className="text-2xl font-bold text-[#3b130d]">
            My Personal Decks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {personalDecks.map((deck) => (
            <div
              key={deck.id}
              className="group border border-black/5 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out bg-white flex flex-col"
            >
              <div className="w-11 h-11 rounded-xl bg-[#8b4513]/10 flex items-center justify-center mb-4 group-hover:bg-[#8b4513]/15 transition-colors duration-300">
                <Notebook size={22} className="text-[#8b4513]" />
              </div>

              <h3 className="font-bold text-xl text-[#3b130d]">
                {deck.title}
              </h3>

              <p className="mt-3 text-sm font-medium text-neutral-600">
                {deck.cards?.length ?? 0} Cards
              </p>

              <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-400">
                <Clock size={13} />
                <span>
                  Last updated:{" "}
                  {deck.updatedAt
                    ? new Date(deck.updatedAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => startStudy(deck, true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b4513] to-[#a0522d] text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-black/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out"
                >
                  <Play size={16} className="fill-white" />
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
                  className="flex-1 flex items-center justify-center gap-2 bg-transparent border-2 border-blue-600 text-blue-600 font-semibold px-5 py-3 rounded-xl hover:bg-blue-50 hover:scale-[1.02] transition-all duration-300 ease-in-out"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Create Personal Deck */}

      <div className="bg-gradient-to-br from-white to-[#f5f1ed] rounded-3xl px-6 py-8 sm:px-10 sm:py-10 shadow-lg shadow-black/5 border border-[#8b4513]/10 relative overflow-hidden">

        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#8b4513]/10 blur-3xl rounded-full pointer-events-none" />

        <h2 className="text-2xl font-bold mb-1.5 text-[#3b130d] relative">
          ✨ Create Personal Deck
        </h2>
        <p className="text-neutral-500 mb-6 relative">
          Organize your own study material.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 relative">

          <input
            type="text"
            placeholder="Deck Name"
            value={deckName}
            onChange={(e) =>
              setDeckName(e.target.value)
            }
            className="w-full border border-black/10 rounded-2xl p-4 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8b4513]/40 transition-all duration-200"
          />

          <button
            onClick={createPersonalDeck}
            className="shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b4513] to-[#a0522d] text-white font-semibold px-8 py-4 rounded-2xl shadow-md shadow-black/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out"
          >
            <Sparkles size={18} />
            Create Deck
          </button>

        </div>

      </div>

        {selectedDeck && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-[700px] max-h-[85vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#8b4513]/10 flex items-center justify-center shrink-0">
                    <Notebook size={20} className="text-[#8b4513]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#3b130d] truncate">
                    Editing: {selectedDeck.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedDeck(null)}
                  aria-label="Close"
                  className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:scale-105 transition-all duration-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border border-black/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/40 transition-all duration-200"
                />

                <textarea
                  rows={3}
                  placeholder="Answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full border border-black/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/40 transition-all duration-200"
                />

                <button
                  onClick={handleAddCard}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b4513] to-[#a0522d] text-white font-semibold px-6 py-3 rounded-2xl shadow-md shadow-black/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out"
                >
                  <Pencil size={16} />
                  {editingCardId ? "Update Card" : "Add Card"}
                </button>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-[#3b130d]">
                    Current Cards
                  </h3>

                  {selectedDeck.cards.length === 0 ? (
                    <p className="text-neutral-500">
                      No cards added yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedDeck.cards.map((card) => (
                        <div
                          key={card.id}
                          className="border border-black/5 rounded-2xl p-5 bg-[#f5f1ed]/40 hover:shadow-md transition-all duration-300 ease-in-out"
                        >
                          <p>
                            <strong className="text-[#3b130d]">Q:</strong> {card.question}
                          </p>

                          <p className="mt-2">
                            <strong className="text-[#3b130d]">A:</strong> {card.answer}
                          </p>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => {
                                setQuestion(card.question);
                                setAnswer(card.answer);
                                setEditingCardId(card.id);
                              }}
                              className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700 hover:scale-[1.02] transition-all duration-200"
                            >
                              <Pencil size={13} />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteCard(card.id)
                              }
                              className="flex items-center gap-1.5 bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-700 hover:scale-[1.02] transition-all duration-200"
                            >
                              <Trash2 size={13} />
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-[700px] border border-white/40">

            <div className="flex justify-between items-center mb-6 gap-4">

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#8b4513]/10 flex items-center justify-center shrink-0">
                  <Layers size={20} className="text-[#8b4513]" />
                </div>
                <h2 className="text-2xl font-bold text-[#3b130d] truncate">
                  Studying: {studyDeck.title}
                </h2>
              </div>

              <button
                onClick={() => setStudyDeck(null)}
                aria-label="Close"
                className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:scale-105 transition-all duration-200"
              >
                <X size={18} />
              </button>

            </div>

            {studyCards.length === 0 ? (

              <p className="text-neutral-500">
                This deck has no cards.
              </p>

            ) : (

              <>

                {/* Progress indicator */}
                <div className="mb-2">
                  <div className="w-full h-2 rounded-full bg-[#f5f1ed] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8b4513] to-[#a0522d] transition-all duration-500 ease-in-out"
                      style={{ width: `${studyProgress}%` }}
                    />
                  </div>
                </div>

                <p className="text-neutral-500 mb-4 text-sm font-medium">
                  Card {currentCardIndex + 1} of {studyCards.length}
                </p>

                {/* Flip card */}
                <div className="[perspective:1200px] w-full h-64 sm:h-72">
                  <div
                    className={`relative w-full h-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] ${
                      showAnswer ? "[transform:rotateY(180deg)]" : ""
                    }`}
                  >
                    {/* Front: Question */}
                    <div className="absolute inset-0 [backface-visibility:hidden] border border-black/5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-[#f5f1ed] shadow-md flex items-center justify-center text-center">
                      <h3 className="font-bold text-xl sm:text-2xl text-[#3b130d]">
                        {studyCards[currentCardIndex].question}
                      </h3>
                    </div>

                    {/* Back: Answer */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border border-black/5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#8b4513] to-[#a0522d] shadow-md flex items-center justify-center text-center">
                      <p className="text-white text-lg sm:text-xl font-medium">
                        {studyCards[currentCardIndex].answer}
                      </p>
                    </div>
                  </div>
                </div>

                {!showAnswer ? (

                  <button
                    onClick={() => setShowAnswer(true)}
                    className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b4513] to-[#a0522d] text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-black/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out"
                  >
                    Show Answer
                  </button>

                ) : (

                  <button
                    onClick={() => setShowAnswer(false)}
                    className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-black/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out"
                  >
                    Hide Answer
                  </button>

                )}

                <div className="flex justify-between gap-3 mt-8">

                  <button
                    onClick={previousCard}
                    disabled={currentCardIndex === 0}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-gray-500 text-white font-semibold px-5 py-3 rounded-xl disabled:opacity-40 hover:enabled:scale-[1.02] transition-all duration-300 ease-in-out"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    onClick={nextCard}
                    disabled={currentCardIndex === studyCards.length - 1}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#8b4513] to-[#a0522d] text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-black/10 disabled:opacity-40 hover:enabled:shadow-lg hover:enabled:scale-[1.02] transition-all duration-300 ease-in-out"
                  >
                    Next
                    <ChevronRight size={16} />
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