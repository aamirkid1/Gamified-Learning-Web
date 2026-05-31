"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (thumbnail) {
      const formData = new FormData();

      formData.append(
        "file",
        thumbnail
      );

      const uploadRes = await fetch(
        "http://localhost:3000/upload/course-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData =
        await uploadRes.json();

      imageUrl =
        uploadData.imageUrl;
    }

    await fetch("http://localhost:3000/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        thumbnail: imageUrl,
      }),
    });

    alert("Course Created Successfully");

    setTitle("");
    setDescription("");
    setThumbnail(null);
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
              Create New Course
            </h1>
            <p className="text-gray-200 mt-2 text-sm md:text-base">
              Build a new learning experience for students.
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

          {/* Left Side */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="border-l-4 border-[#8b4513] pl-5">
              <h2 className="text-3xl font-bold text-[#3b130d]">
                Course Details
              </h2>
              <p className="text-gray-700 mt-3 leading-relaxed">
                Create engaging courses that contain lessons, PDFs,
                videos, quizzes, achievements and XP rewards.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e7d8cc]">
              <h3 className="text-xl font-semibold text-[#6f311c] mb-4 flex items-center gap-2">
                ✨ Quick Guide
              </h3>

              <ul className="space-y-3 text-gray-700 font-medium text-sm">
                <li className="flex items-center gap-2">
                  <span>📚</span>
                  Use a clear and descriptive title.
                </li>

                <li className="flex items-center gap-2">
                  <span>📝</span>
                  Write a detailed course description.
                </li>

                <li className="flex items-center gap-2">
                  <span>🖼️</span>
                  Upload an attractive thumbnail image.
                </li>

                <li className="flex items-center gap-2">
                  <span>🎓</span>
                  Add lessons after creating the course.
                </li>
              </ul>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-[#e7d8cc] overflow-hidden flex flex-col justify-between">

            <div>
              {/* Card Header */}
              <div className="bg-[#6f311c] px-8 py-5">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Course Information Form
                </h2>

                <p className="text-gray-300 text-xs mt-1">
                  Fill in details to instantly instantiate your content track.
                </p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">

                {/* Course Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                    Course Title
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Enter course heading..."
                    className="w-full bg-[#f5f0eb]/40 border border-[#e7d8cc] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-[#000000]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                    Syllabus Description
                  </label>

                  <textarea
                    rows={4}
                    required
                    placeholder="Outline learning milestones, core skills acquired, and structure..."
                    className="w-full bg-[#f5f0eb]/40 border border-[#e7d8cc] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-[#000000] resize-none"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                  />
                </div>

                {/* Thumbnail Upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                    Course Thumbnail
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="w-full bg-[#f5f0eb]/40 border border-[#e7d8cc] rounded-xl p-3.5 text-sm text-[#000000]"
                    onChange={(e) =>
                      setThumbnail(e.target.files[0])
                    }
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#431b11] hover:bg-[#35140d] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 tracking-wide text-sm"
                  >
                    Publish Course Track
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