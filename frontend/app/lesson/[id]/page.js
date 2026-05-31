"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Video, FileText, ArrowLeft, BookOpen, ExternalLink, HelpCircle, CheckCircle2, Volume2 } from "lucide-react";

export default function LessonPage() {
  const params = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    loadLesson();
  }, []);

  const loadLesson = async () => {
    try {
      const response = await fetch("http://localhost:3000/lessons");
      const data = await response.json();

      const foundLesson = data.find((l) => l.id === Number(params.id));
      setLesson(foundLesson);
    } catch (error) {
      console.error("Error loading lesson material:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      alert("🎉 Milestone Unlocked! You earned +50 XP!");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-gray-400 font-medium text-sm animate-pulse font-sans">
        Syncing lecture terminal parameters...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-[#eaded4] max-w-md mx-auto mt-12 font-sans">
        <HelpCircle className="mx-auto text-[#6f311c] mb-4 opacity-40" size={44} />
        <h3 className="text-lg font-bold text-[#3b130d]">Lecture node missing</h3>
        <p className="text-gray-500 text-sm mt-1">This specific material chunk could not be fetched.</p>
        <Link href="/courses" className="mt-6 inline-block text-xs font-bold text-[#8b4513] uppercase tracking-wider underline">
          Return to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-gray-800">
      
      {/* TOP NAVIGATION ROUTER LINE */}
      <div className="flex items-center justify-between pb-4 border-b border-[#eaded4]">
        <Link 
          href={`/courses/${lesson.courseId || ""}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8b4513] hover:text-[#6b1f0f] transition-colors group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to Syllabus</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <BookOpen size={12} /> Active Lecture Terminal
        </span>
      </div>

      {/* LESSON HERO TITLING HEADER */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#eaded4] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#6b1f0f]" />
        <div className="pl-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8b4513]">
              Syllabus Content Module
            </span>
            <h1 className="text-3xl font-black text-[#3b130d] tracking-tight mt-0.5">
              {lesson.title}
            </h1>
          </div>
          {isCompleted && (
            <span className="self-start sm:self-auto bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-bounce">
              <CheckCircle2 size={14} className="fill-emerald-100" /> Completed (+50 XP)
            </span>
          )}
        </div>
      </div>

      {/* MAIN TWO-COLUMN STUDY DOCK GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: LECTURE TEXT & PROGRESS CONSOLE */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* LECTURE TERMINAL NOTE BLOCK */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pl-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#6f311c]">
                Lecture Notes
              </h3>
              <button className="text-xs font-semibold text-[#8b4513] hover:text-[#6b1f0f] flex items-center gap-1 transition-colors">
                <Volume2 size={14} /> Listen to Audio
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#eaded4] min-h-[220px] relative flex flex-col justify-between">
              <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line font-medium">
                {lesson.content || "No textual definitions compiled for this dynamic curriculum node track."}
              </p>
              
              <div className="border-t border-dashed border-gray-100 pt-4 mt-6 flex justify-between items-center text-xs text-gray-400 font-medium">
                <span>Estimated reading duration: ~1 min</span>
                <span>ID: #{lesson.id}</span>
              </div>
            </div>
          </div>

          {/* GAMEPLAY COMPLETION SUB-BANNER */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaded4] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-bold text-[#3b130d]">Finished reading the lecture notes?</h4>
              <p className="text-gray-500 text-xs font-medium">Mark this terminal node verified to process rewards instantly.</p>
            </div>
            <button
              onClick={handleCompleteLesson}
              disabled={isCompleted}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow flex items-center justify-center gap-2
                ${isCompleted 
                  ? "bg-emerald-600 text-white cursor-not-allowed opacity-90 shadow-none" 
                  : "bg-[#431b11] hover:bg-[#35140d] text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                }`}
            >
              <CheckCircle2 size={16} />
              {isCompleted ? "Module Completed" : "Mark as Completed (+50 XP)"}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE MEDIA LINKS TERMINAL */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#6f311c] pl-1">
            Attached Materials
          </h3>

          <div className="space-y-4">
            {/* VIDEO MATERIAL CONTAINER BUTTON */}
            {lesson.videoUrl ? (
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="group block bg-white border border-[#eaded4] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#8b4513]/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0 group-hover:bg-[#8b4513] group-hover:text-white group-hover:border-[#8b4513] transition-colors duration-200">
                      <Video size={22} className="group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3b130d] tracking-tight">
                        Video Presentation
                      </h4>
                      <p className="text-gray-400 text-xs font-medium mt-0.5">
                        Watch dynamic stream presentation
                      </p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-gray-400 group-hover:text-[#8b4513] transition-colors" />
                </div>
              </a>
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-5 text-center text-xs font-medium text-gray-400">
                No streaming video attached
              </div>
            )}

            {/* PDF MATERIAL CONTAINER BUTTON */}
            {lesson.pdfUrl ? (
              <a
                href={lesson.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="group block bg-white border border-[#eaded4] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#8b4513]/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#8b4513] flex-shrink-0 group-hover:bg-[#6f311c] group-hover:text-white group-hover:border-[#6f311c] transition-colors duration-200">
                      <FileText size={22} className="group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3b130d] tracking-tight">
                        Worksheet PDF Notes
                      </h4>
                      <p className="text-gray-400 text-xs font-medium mt-0.5">
                        Download documentation vault
                      </p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-gray-400 group-hover:text-[#6f311c] transition-colors" />
                </div>
              </a>
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-5 text-center text-xs font-medium text-gray-400">
                No lecture documentation sheets attached
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}