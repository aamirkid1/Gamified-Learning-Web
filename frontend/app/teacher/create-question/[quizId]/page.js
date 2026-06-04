"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import questionService from "@/services/questionService";
import { 
  FileQuestion, 
  HelpCircle, 
  PlusCircle, 
  CheckCircle2, 
  ListPlus, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function CreateQuestion() {
  const params = useParams();
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [type, setType] = useState("mcq");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  const resetFormState = () => {
    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswers("");
    setShowSuccessCard(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submitting questions or empty string gaps containing only spaces
    if (!question.trim()) {
      alert("Please enter a valid question.");
      return;
    }

    if (type === "mcq" && (!optionA.trim() || !optionB.trim() || !correctAnswers.trim())) {
      alert("Please provide at least Option A, Option B, and the Correct Answer criteria.");
      return;
    }

    setLoading(true);

    try {
      await questionService.createQuestion({
        quizId: Number(params.quizId),
        question: question.trim(),
        type,
        optionA: type === "mcq" ? optionA.trim() : "",
        optionB: type === "mcq" ? optionB.trim() : "",
        optionC: type === "mcq" ? optionC.trim() : "",
        optionD: type === "mcq" ? optionD.trim() : "",
        correctAnswers: correctAnswers.trim(),
      });

      // Show the post-save interactive options flow card
      setShowSuccessCard(true);
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save the question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f1] to-[#efe5dc] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#eadfd7] overflow-hidden transition-all duration-300 hover:-translate-y-1">
        
        {/* Premium Header Layout */}
        <div className="bg-gradient-to-r from-[#6b1f0f] to-[#8a3b20] px-8 py-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24 text-white" />
          </div>
          <div className="flex items-center gap-3">
            <HelpCircle className="w-9 h-9 text-white" />
            <h1 className="text-4xl font-bold text-white">
              Add Question
            </h1>
          </div>
          <p className="text-white/80 mt-2 ml-12">
            Build your challenge engine by creating step-by-step questions
          </p>
        </div>

        {/* Content Wrapper */}
        <div className="p-8">
          {!showSuccessCard ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Question Textarea */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileQuestion className="w-4 h-4 text-[#6b1f0f]" />
                  Question Formulation
                </label>
                <textarea
                  placeholder="Enter the question text here..."
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-gray-50/50 focus:bg-white resize-none"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Question Type Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <ListPlus className="w-4 h-4 text-[#6b1f0f]" />
                  Question Architecture
                </label>
                <select
                  className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-gray-50/50 focus:bg-white cursor-pointer"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={loading}
                >
                  <option value="mcq">Multiple Choice Question (MCQ)</option>
                  <option value="short">Short Answer Form</option>
                </select>
              </div>

              {/* MCQ Options Conditional Branch block */}
              {type === "mcq" && (
                <div className="space-y-4 bg-[#fcfaf8] p-5 rounded-2xl border border-[#eadfd7]/60">
                  <h3 className="text-sm font-bold text-[#6b1f0f] uppercase tracking-wider mb-2">
                    Options Definition
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Option A"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-white focus:bg-white"
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      required={type === "mcq"}
                      disabled={loading}
                    />

                    <input
                      type="text"
                      placeholder="Option B"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-white focus:bg-white"
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      required={type === "mcq"}
                      disabled={loading}
                    />

                    <input
                      type="text"
                      placeholder="Option C (Optional)"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-white focus:bg-white"
                      value={optionC}
                      onChange={(e) => setOptionC(e.target.value)}
                      disabled={loading}
                    />

                    <input
                      type="text"
                      placeholder="Option D (Optional)"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-white focus:bg-white"
                      value={optionD}
                      onChange={(e) => setOptionD(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="mt-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                      Correct Key
                    </label>
                    <input
                      type="text"
                      placeholder="Example: A or A,C"
                      className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-white focus:bg-white font-mono uppercase"
                      value={correctAnswers}
                      onChange={(e) => setCorrectAnswers(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Submit / Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#6b1f0f] to-[#8a3b20] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.99] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving to Quiz...</span>
                  </div>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Save Question</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            
            /* LMS Success Workflow Destination Box */
            <div className="bg-emerald-50/60 border-2 border-emerald-100 rounded-3xl p-8 text-center animate-fadeIn">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-800">
                Question Saved Successfully!
              </h3>
              <p className="text-emerald-700/80 mt-1 max-w-md mx-auto">
                The database has updated. What structural milestone would you like to target next?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
                <button
                  onClick={resetFormState}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-[#eadfd7] hover:border-[#6b1f0f] text-gray-700 font-semibold px-6 py-4 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <PlusCircle className="w-5 h-5 text-[#6b1f0f]" />
                  Add Another
                </button>
                
                <button
                  onClick={() => router.push("/teacher")}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6b1f0f] to-[#8a3b20] text-white font-semibold px-6 py-4 rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Finish Quiz</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}