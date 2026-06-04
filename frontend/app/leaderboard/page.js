"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import leaderboardService from "@/services/leaderboardService";

export default function PublicLeaderboardPage() {
  const [leaders, setLeaders] =
    useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard =
    async () => {
      try {
        const data =
          await leaderboardService.getLeaderboard();

        setLeaders(
          data.slice(0, 20)
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div
      className="
        min-h-screen
        p-8
        bg-[#f5f5f5]
        bg-[radial-gradient(circle_at_top_right,#8b451315,transparent_40%)]
      "
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: -50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            relative
            bg-[#6b1f0f]
            text-white
            p-6
            rounded-2xl
            shadow-lg
            mb-8
            overflow-hidden
          "
        >

          <motion.div
            animate={{
              rotate: [0, 10, 0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
            className="
              absolute
              right-10
              top-2
              text-8xl
              opacity-10
            "
          >
            🏆
          </motion.div>

          <h1 className="text-4xl font-bold">
            🏆 Global Leaderboard
          </h1>

          <p className="text-gray-200 mt-2">
            Top 20 Students Ranked By XP
          </p>

        </motion.div>

        {/* Top 3 Students */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {leaders
            .slice(0, 3)
            .map((student, index) => (

              <motion.div
                key={student.id}
                initial={{
                  opacity: 0,
                  y: 80,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.6,
                }}
                whileHover={{
                  y: -12,
                  scale: 1.05,
                }}
                className="
                  bg-white
                  rounded-2xl
                  shadow-lg
                  p-6
                  text-center
                  cursor-pointer
                  border
                  border-transparent
                  hover:border-[#8b4513]
                  hover:shadow-2xl
                  transition-all
                "
              >

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  className="text-5xl mb-3"
                >

                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : "🥉"}

                </motion.div>

                <h2 className="text-3xl font-bold">

                  {student.name}

                </h2>

                <p className="mt-3 text-[#8b4513] text-xl font-semibold">

                  <CountUp
                    end={student.xp}
                    duration={2}
                  /> XP

                </p>

                <p className="text-lg mt-1">

                  Level {student.level}

                </p>

              </motion.div>

            ))}

        </div>

        {/* Leaderboard Table */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            bg-white
            rounded-2xl
            shadow-lg
            overflow-hidden
          "
        >

          <div
            className="
              bg-[#431b11]
              text-white
              p-5
              grid
              grid-cols-4
              font-bold
              text-lg
            "
          >

            <div>Rank</div>

            <div>Student</div>

            <div>XP</div>

            <div>Level</div>

          </div>

          {leaders.map(
            (student, index) => (

              <motion.div
                key={student.id}
                initial={{
                  opacity: 0,
                  x: -30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.03,
                }}
                className={`
                  grid
                  grid-cols-4
                  p-5
                  border-b
                  transition
                  hover:bg-yellow-50
                  ${
                    index === 0
                      ? "bg-yellow-50"
                      : ""
                  }
                `}
              >

                <div className="font-semibold">

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

                  <CountUp
                    end={student.xp}
                    duration={2}
                  />

                </div>

                <div>

                  Level {student.level}

                </div>

              </motion.div>

            )
          )}

        </motion.div>

      </div>
    </div>
  );
}