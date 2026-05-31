"use client";

import {
  Flame,
  Trophy,
  PlayCircle,
  Swords,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h2 className="text-4xl font-bold text-[#6b1f0f]">
          Welcome Back 👋
        </h2>

        <p className="text-gray-600 mt-2 text-lg">
          Continue your learning journey and
          earn more XP.
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* XP */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#eaded4]">

          <p className="text-gray-500">
            XP Points
          </p>

          <h3 className="text-4xl font-bold text-[#8b4513] mt-2">
            1200 XP
          </h3>

          <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
            <div className="bg-[#8b4513] h-3 rounded-full w-[60%]"></div>
          </div>

          <p className="mt-3 text-gray-500">
            Level 6
          </p>

        </div>

        {/* STREAK */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#eaded4] flex items-center gap-5">

          <Flame
            size={40}
            className="text-orange-500"
          />

          <div>

            <p className="text-gray-500">
              Streak
            </p>

            <h3 className="text-4xl font-bold text-[#8b4513]">
              5 Days
            </h3>

          </div>

        </div>

        {/* RANK */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#eaded4] flex items-center gap-5">

          <Trophy
            size={40}
            className="text-yellow-500"
          />

          <div>

            <p className="text-gray-500">
              Rank
            </p>

            <h3 className="text-4xl font-bold text-[#8b4513]">
              #12
            </h3>

          </div>

        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* QUIZ */}
        <button className="bg-[#8b4513] text-white p-7 rounded-2xl shadow-lg hover:bg-[#6b1f0f] transition flex items-center justify-center gap-3 text-xl font-semibold">

          <PlayCircle size={28} />

          Start Quiz

        </button>

        {/* DUEL */}
        <button
          onClick={() =>
            router.push("/duel")
          }
          className="bg-[#6f311c] text-white p-7 rounded-2xl shadow-lg hover:bg-[#431b11] transition flex items-center justify-center gap-3 text-xl font-semibold"
        >

          <Swords size={28} />

          Duel Mode

        </button>

        {/* LEADERBOARD */}
        <button className="bg-yellow-500 text-white p-7 rounded-2xl shadow-lg hover:bg-yellow-600 transition flex items-center justify-center gap-3 text-xl font-semibold">

          <Trophy size={28} />

          Leaderboard

        </button>

      </div>

    </div>
  );
}