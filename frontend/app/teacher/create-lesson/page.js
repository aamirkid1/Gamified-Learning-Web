"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import lessonService from "../../../services/lessonService";

export default function CreateLesson() {
  const [courses, setCourses] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const response = await fetch("http://localhost:3000/courses");
    const data = await response.json();
    setCourses(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await lessonService.createLesson({
      title,
      content,
      videoUrl,
      pdfUrl,
      courseId: Number(courseId),
    });

    alert("Lesson Created Successfully");

    setTitle("");
    setContent("");
    setVideoUrl("");
    setPdfUrl("");
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] font-sans text-gray-800">
      {/* Top Strip */}
      <div className="h-2 bg-[#6b1f0f]"></div>

      {/* Header */}
      <div className="bg-[#8b4513] px-8 py-6 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Add New Lesson
            </h1>
            <p className="text-gray-200 mt-2 text-sm md:text-base">
              Expand your course tracks with rich educational lectures and media assets.
            </p>
          </div>
          <Link href="/teacher">
            <button className="self-start md:self-auto px-4 py-2 bg-[#3b130d] hover:bg-[#35140d] text-white rounded-xl text-sm font-semibold shadow border border-white/10 transition">
              ← Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Main Area */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Left Side Info Panel */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="border-l-4 border-[#8b4513] pl-5">
              <h2 className="text-3xl font-bold text-[#3b130d]">
                Lesson Assembly
              </h2>
              <p className="text-gray-700 mt-3 leading-relaxed">
                Attach clear reading material, streaming links, and structured syllabus references directly to an existing container course track.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e7d8cc]">
              <h3 className="text-xl font-semibold text-[#6f311c] mb-4 flex items-center gap-2">
                ✨ Content Tips
              </h3>
              <ul className="space-y-3 text-gray-700 font-medium text-sm">
                <li className="flex items-center gap-2"><span>📂</span> Select the correct parent course target first.</li>
                <li className="flex items-center gap-2"><span>📖</span> Draft straightforward, concise lecture prose.</li>
                <li className="flex items-center gap-2"><span>🎥</span> Host videos via secure stream URLs.</li>
                <li className="flex items-center gap-2"><span>📄</span> Attach reference PDFs for off-platform reading.</li>
              </ul>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-[#e7d8cc] overflow-hidden flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="bg-[#6f311c] px-8 py-5">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Lesson Information Form
                </h2>
                <p className="text-gray-300 text-xs mt-1">
                  Input metadata fields to deploy updates to the live layout.
                </p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                
                {/* Field 1: Dropdown Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                    Target Course Connection
                  </label>
                  <select
                    required
                    className="w-full bg-[#f5f0eb]/40 border border-[#e7d8cc] rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-[#000000] cursor-pointer"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                  >
                    <option value="" className="text-gray-400">
                      -- Select Parent Course --
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id} className="text-[#000000]">
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field 2: Lesson Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Module 1: Foundational Frameworks"
                    className="w-full bg-[#f5f0eb]/40 border border-[#e7d8cc] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-[#000000]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Field 3: Lesson Content Textarea */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                    Lecture Notes & Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Draft text details, markdown points, or structural definitions..."
                    className="w-full bg-[#f5f0eb]/40 border border-[#e7d8cc] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-[#000000] resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Field 4: Video URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                    Video Lecture URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://streaming-provider.com/lecture-1"
                    className="w-full bg-[#f5f0eb]/40 border border-[#e7d8cc] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-[#000000]"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>

                {/* Field 5: PDF URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                    Reference Worksheet PDF URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/vault/syllabus-doc.pdf"
                    className="w-full bg-[#f5f0eb]/40 border border-[#e7d8cc] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-[#000000]"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                  />
                </div>

                {/* Submit button using dark chocolate button token */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#431b11] hover:bg-[#35140d] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 tracking-wide text-sm"
                  >
                    Publish Lesson Module
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}