"use client";

import {
  Flame,
  Trophy,
  PlayCircle,
  Swords,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import leaderboardService from "@/services/leaderboardService";

export default function Dashboard() {
  const router = useRouter();

  const [stats, setStats] =
    useState({
      xp: 0,
      level: 1,
      rank: "-",
    });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    const result =
      await leaderboardService.getMyRank(
        user.id
      );

    setStats(result);
  };

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-4xl font-bold text-[#6b1f0f]">
          Welcome Back 👋
        </h2>

        <p className="text-gray-600 mt-2 text-lg">
          Continue your learning journey and
          earn more XP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#eaded4]">

          <p className="text-gray-500">
            XP Points
          </p>

          <h3 className="text-4xl font-bold text-[#8b4513] mt-2">
            {stats.xp} XP
          </h3>

          <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
            <div
              className="bg-[#8b4513] h-3 rounded-full"
              style={{
                width: `${Math.min(
                  (stats.xp % 100) || 5,
                  100
                )}%`,
              }}
            />
          </div>

          <p className="mt-3 text-gray-500">
            Level {stats.level}
          </p>

        </div>

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
              #{stats.rank}
            </h3>

          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <button className="bg-[#8b4513] text-white p-7 rounded-2xl shadow-lg hover:bg-[#6b1f0f] transition flex items-center justify-center gap-3 text-xl font-semibold">

          <PlayCircle size={28} />

          Start Quiz

        </button>

        <button
          onClick={() =>
            router.push("/duel")
          }
          className="bg-[#6f311c] text-white p-7 rounded-2xl shadow-lg hover:bg-[#431b11] transition flex items-center justify-center gap-3 text-xl font-semibold"
        >
          <Swords size={28} />
          Duel Mode
        </button>

        <Link href="/leaderboard">

          <button className="w-full bg-yellow-500 text-white p-7 rounded-2xl shadow-lg hover:bg-yellow-600 transition flex items-center justify-center gap-3 text-xl font-semibold">

            <Trophy size={28} />

            Leaderboard

          </button>

        </Link>

      </div>

    </div>
  );
}