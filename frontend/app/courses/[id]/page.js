"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, FileText, Play, ArrowLeft, HelpCircle } from "lucide-react";

export default function CourseDetails() {
  const params = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const response = await fetch("http://localhost:3000/lessons");
      const data = await response.json();

      const filteredLessons = data.filter(
        (lesson) => lesson.courseId === Number(params.id)
      );

      setLessons(filteredLessons);
    } catch (error) {
      console.error("Error loading lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* TOP NAVIGATION BACK LINK */}
      <div className="flex items-center justify-between pb-4 border-b border-[#eaded4]">
        <Link 
          href="/courses" 
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8b4513] hover:text-[#6b1f0f] transition-colors group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to Courses</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Syllabus Track
        </span>
      </div>

      {/* HEADER HERO AREA */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#eaded4] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#8b4513]" />
        <div className="pl-3 space-y-1">
          <h1 className="text-3xl font-black text-[#3b130d] tracking-tight">
            Course Syllabus
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Complete sequential modules to earn experience milestones and prepare for arena duels.
          </p>
        </div>
      </div>

      {/* SYLLABUS LESSONS TREE */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 font-medium text-sm animate-pulse">
          Loading timeline modules...
        </div>
      ) : lessons.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#eaded4] max-w-md mx-auto">
          <HelpCircle className="mx-auto text-[#6f311c] mb-4 opacity-40" size={44} />
          <h3 className="text-lg font-bold text-[#3b130d]">No modules released yet</h3>
          <p className="text-gray-500 text-sm mt-1">
            The instructor hasn't uploaded specific materials to this track timeline.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-[27px] before:w-0.5 before:bg-[#eaded4]/60">
          {lessons.map((lesson, index) => (
            <Link 
              key={lesson.id} 
              href={`/lesson/${lesson.id}`}
              className="block group"
            >
              <div className="bg-white rounded-2xl border border-[#eaded4] shadow-sm p-5 flex items-center gap-5 transition-all duration-300 hover:shadow-md hover:border-[#8b4513]/40 hover:translate-x-1 relative z-10">
                
                {/* SEQUENTIAL LEVEL INDICATOR NODE */}
                <div className="w-14 h-14 rounded-xl bg-[#f5f1ed] border border-[#eaded4] flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-[#8b4513] group-hover:border-[#8b4513] transition-colors duration-300">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-amber-200/80 leading-none">
                    Mod
                  </span>
                  <span className="text-xl font-black text-[#3b130d] group-hover:text-white transition-colors leading-tight">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* TEXT CONTENT META PANEL */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="text-lg font-bold text-[#3b130d] tracking-tight group-hover:text-[#6b1f0f] transition-colors line-clamp-1">
                      {lesson.title}
                    </h2>
                    {/* Media tags matching available assets dynamically */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8b4513] bg-[#f5f1ed] px-2 py-0.5 rounded-md border border-[#eaded4]">
                      <FileText size={10} /> Lecture
                    </span>
                  </div>
                  
                  <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-1">
                    {lesson.content ? lesson.content.replace(/[^\w\s]/gi, '').substring(0, 110) : "No lecture content description summarized."}...
                  </p>
                </div>

                {/* ACTION LAUNCH TRIGGER BUTTON */}
                <div className="w-10 h-10 rounded-full bg-[#f5f1ed] text-[#8b4513] flex items-center justify-center flex-shrink-0 border border-[#eaded4] group-hover:bg-[#431b11] group-hover:text-white group-hover:border-[#431b11] transition-all duration-300 shadow-sm">
                  <Play size={14} className="fill-current ml-0.5" />
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}