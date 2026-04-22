"use client";

import { Flame, Trophy, PlayCircle, Swords } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-green-700">
          Welcome Back 👋
        </h2>
        <p className="text-gray-600">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* XP CARD */}
        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          <h3 className="text-gray-500">XP Points</h3>
          <p className="text-2xl font-bold text-green-700">1200 XP</p>

          {/* PROGRESS BAR */}
          <div className="w-full bg-gray-200 h-3 rounded-full">
            <div className="bg-green-600 h-3 rounded-full w-[60%]"></div>
          </div>

          <p className="text-sm text-gray-500">Level 6</p>
        </div>

        {/* STREAK */}
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <Flame className="text-orange-500" size={30} />
          <div>
            <p className="text-gray-500">Streak</p>
            <p className="text-2xl font-bold text-green-700">5 Days</p>
          </div>
        </div>

        {/* RANK */}
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <Trophy className="text-yellow-500" size={30} />
          <div>
            <p className="text-gray-500">Rank</p>
            <p className="text-2xl font-bold text-green-700">#12</p>
          </div>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* START QUIZ */}
        <button className="bg-green-600 text-white p-6 rounded-xl shadow hover:bg-green-700 transition flex items-center justify-center gap-3 text-lg font-semibold">
          <PlayCircle />
          Start Quiz
        </button>

        {/* DUEL MODE */}
        <button className="bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700 transition flex items-center justify-center gap-3 text-lg font-semibold">
          <Swords />
          Duel Mode
        </button>

        {/* LEADERBOARD */}
        <button className="bg-yellow-500 text-white p-6 rounded-xl shadow hover:bg-yellow-600 transition flex items-center justify-center gap-3 text-lg font-semibold">
          <Trophy />
          Leaderboard
        </button>

      </div>

    </div>
  );
}