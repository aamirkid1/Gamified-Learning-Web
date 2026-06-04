"use client";

import { useEffect, useState } from "react";
import leaderboardService from "@/services/leaderboardService";

export default function LeaderboardPage() {
  const [leaders, setLeaders] =
    useState([]);

  const [myRank, setMyRank] =
    useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard =
    async () => {
      try {
        const data =
          await leaderboardService.getLeaderboard();

        setLeaders(data);

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        if (user) {
          const rankData =
            await leaderboardService.getMyRank(
              user.id
            );

          setMyRank(rankData);
        }
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">

      <div className="max-w-5xl mx-auto">

        <div className="bg-[#6b1f0f] text-white p-6 rounded-2xl shadow-lg mb-8">

          <h1 className="text-4xl font-bold">
            🏆 Global Leaderboard
          </h1>

          <p className="text-gray-200 mt-2">
            Top Students Ranked By XP
          </p>

        </div>

        {myRank && (
          <div className="bg-[#8b4513] text-white rounded-2xl p-6 shadow-lg mb-8">

            <h2 className="text-2xl font-bold mb-4">
              Your Ranking
            </h2>

            <div className="grid md:grid-cols-3 gap-4">

              <div className="bg-[#6f311c] p-4 rounded-xl">
                <p className="text-gray-300">
                  Rank
                </p>

                <h3 className="text-3xl font-bold">
                  #{myRank.rank}
                </h3>
              </div>

              <div className="bg-[#6f311c] p-4 rounded-xl">
                <p className="text-gray-300">
                  XP
                </p>

                <h3 className="text-3xl font-bold">
                  {myRank.xp}
                </h3>
              </div>

              <div className="bg-[#6f311c] p-4 rounded-xl">
                <p className="text-gray-300">
                  Level
                </p>

                <h3 className="text-3xl font-bold">
                  {myRank.level}
                </h3>
              </div>

            </div>

          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="bg-[#431b11] text-white p-4 grid grid-cols-4 font-bold">

            <div>
              Rank
            </div>

            <div>
              Student
            </div>

            <div>
              XP
            </div>

            <div>
              Level
            </div>

          </div>

          {leaders.map(
            (student, index) => (
              <div
                key={student.id}
                className="grid grid-cols-4 p-4 border-b hover:bg-gray-50 transition"
              >

                <div className="font-bold">

                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`}

                </div>

                <div>
                  {student.name}
                </div>

                <div>
                  {student.xp}
                </div>

                <div>
                  Level {student.level}
                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}