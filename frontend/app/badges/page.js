"use client";

import {
  useEffect,
  useState,
} from "react";

import badgeService from "@/services/badgeService";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export default function BadgesPage() {
  const [badges, setBadges] =
    useState([]);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges =
    async () => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user) return;

        const allBadges =
          await badgeService.getAllBadges();

        const earned =
          await badgeService.getMyBadges(
            user.id
          );

        const earnedIds =
          earned.map(
            (item) => item.badgeId
          );

        const result =
          allBadges.map(
            (badge) => ({
              ...badge,
              earned:
                earnedIds.includes(
                  badge.id
                ),
            })
          );

        setBadges(result);
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">

      <div className="max-w-5xl mx-auto">

        <div className="bg-[#6b1f0f] text-white p-6 rounded-2xl mb-8">

          <h1 className="text-4xl font-bold">
            🏅 Achievements
          </h1>

          <p className="mt-2">
            Unlock badges by learning,
            completing quizzes and
            leveling up.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {badges.map(
            (badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl p-6 shadow-lg border
                ${
                  badge.earned
                    ? "bg-white"
                    : "bg-gray-100 opacity-60"
                }`}
              >

                <img
                  src={`${API_URL}/uploads/badges/${badge.image}`}
                  alt={badge.name}
                  className="w-24 h-24 object-contain mx-auto mb-4"
                />

                <h2 className="text-xl font-bold text-center">
                  {badge.name}
                </h2>

                <p className="text-gray-600 mt-2 text-center">
                  {badge.description}
                </p>

                <div className="mt-4 text-center">

                  {badge.earned ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Unlocked
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                      Locked
                    </span>
                  )}

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}