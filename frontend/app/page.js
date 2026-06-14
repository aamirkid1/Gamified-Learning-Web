"use client";

import Link from "next/link";
import { useState } from "react";
import HeroAnimation from "@/components/common/HeroAnimation";
import { motion, useMotionValue } from "framer-motion";
import { Menu } from "lucide-react";
import {
  Trophy,
  Flame,
  Swords,
  TrendingUp,
} from "lucide-react";

export default function Home() {

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    mouseX.set(
      e.clientX - rect.left
    );

    mouseY.set(
      e.clientY - rect.top
    );
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Top Strip */}
      <div className="h-4 bg-[#6b1f0f]"></div>

      {/* Navbar */}
      <nav
        className="
    h-20
    flex
    items-center
    justify-between
    px-4
sm:px-6
lg:px-12
xl:px-20
    border-b
    backdrop-blur-md
    bg-white/70
    sticky
    top-0
    z-50
    shadow-sm
  "
      >

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-3xl font-bold text-[#6b1f0f]"
        >
          GLP
        </motion.div>

        <button
          onClick={() =>
            setMobileMenuOpen(
              !mobileMenuOpen
            )
          }
          className="
  lg:hidden
  text-[#6b1f0f]
  p-2
  rounded-lg
  hover:bg-[#f5ede8]
  transition
  "
        >
          <Menu size={28} />
        </button>



        <div className="
hidden
lg:flex
gap-10
xl:gap-14
font-medium
items-center
">

          <motion.div
            whileHover={{
              y: -3,
            }}
          >
            <Link
              href="#"
              className="
      relative
      after:absolute
      after:left-0
      after:-bottom-1
      after:w-0
      after:h-[2px]
      after:bg-[#8b4513]
      after:transition-all
      after:duration-300
      hover:after:w-full
      hover:text-[#8b4513]
    "
            >
              About us
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              y: -3,
            }}
          >
            <Link
              href="/courses"
              className="
      relative
      after:absolute
      after:left-0
      after:-bottom-1
      after:w-0
      after:h-[2px]
      after:bg-[#8b4513]
      after:transition-all
      after:duration-300
      hover:after:w-full
      hover:text-[#8b4513]
    "
            >
              Courses
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              y: -3,
            }}
          >
            <Link
              href="/leaderboard"
              className="
      relative
      after:absolute
      after:left-0
      after:-bottom-1
      after:w-0
      after:h-[2px]
      after:bg-[#8b4513]
      after:transition-all
      after:duration-300
      hover:after:w-full
      hover:text-[#8b4513]
    "
            >
              Leaderboards
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              y: -3,
            }}
          >
            <Link
              href="#"
              className="
      relative
      after:absolute
      after:left-0
      after:-bottom-1
      after:w-0
      after:h-[2px]
      after:bg-[#8b4513]
      after:transition-all
      after:duration-300
      hover:after:w-full
      hover:text-[#8b4513]
    "
            >
              Contact us
            </Link>
          </motion.div>

        </div>

        <div className="
flex
gap-2
sm:gap-4
">

          <motion.div
            whileHover={{
              y: -3,
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <Link
              href="/login"
              className="
        border
        border-gray-300
        px-6
        py-3
        rounded-lg
        hover:border-[#8b4513]
        hover:text-[#8b4513]
        hover:shadow-lg
        transition-all
        duration-300
      "
            >
              Login
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              y: -3,
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <Link
              href="/signup"
              className="
        bg-[#8b4513]
        text-white
        px-6
        py-3
        rounded-lg
        shadow-md
        hover:shadow-xl
        hover:bg-[#6b1f0f]
        transition-all
        duration-300
      "
            >
              Sign up
            </Link>
          </motion.div>

        </div>

      </nav>

      {mobileMenuOpen && (
        <div
          className="
    lg:hidden
    bg-white
    border-b
    border-[#eaded4]
    shadow-md
    px-6
    py-5
    space-y-4
    "
        >

          <Link
            href="#"
            className="block font-medium"
          >
            About Us
          </Link>

          <Link
            href="/courses"
            className="block font-medium"
          >
            Courses
          </Link>

          <Link
            href="/leaderboard"
            className="block font-medium"
          >
            Leaderboards
          </Link>

          <Link
            href="#"
            className="block font-medium"
          >
            Contact Us
          </Link>

        </div>
      )}

      {/* Hero Section */}

      <section
        className="
    grid
    grid-cols-1
lg:grid-cols-2
    min-h-[85vh]
    bg-gradient-to-br
    from-white
    via-[#faf7f5]
    to-[#f5ede8]
    bg-[radial-gradient(circle_at_top_right,#8b451310,transparent_35%)]
  "
      >

        {/* Left Side */}

        <div
          className="
flex
flex-col
justify-center
px-6
sm:px-10
md:px-16
lg:px-24
py-12
"
        >

          <motion.h1
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
text-5xl
sm:text-6xl
lg:text-7xl
font-bold
leading-tight
"
          >

            <span
              className="
    bg-gradient-to-r
    from-[#8b4513]
    via-[#b5651d]
    to-[#6b1f0f]
    bg-clip-text
    text-transparent
  "
            >
              Gamified
            </span>

            <br />

            Learning

            <br />

            Platform

          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.4,
              duration: 0.8,
            }}
            className="
mt-6
text-base
sm:text-lg
lg:text-xl
text-gray-700
max-w-xl
"
          >

            Learn through courses, quizzes,
            achievements, XP points and
            leaderboards.

          </motion.p>

          <div
            className="
flex
flex-col
sm:flex-row
gap-4
mt-8
"
          >

            <motion.div
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              <Link
                href="/signup"
                className="
        bg-[#8b4513]
        text-white
        px-8
        py-4
        rounded-lg
        shadow-lg
        hover:shadow-xl
        transition-all
      "
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              <Link
                href="/courses"
                className="
        border
        px-8
        py-4
        rounded-lg
        hover:border-[#8b4513]
        hover:text-[#8b4513]
        transition-all
      "
              >
                Explore Courses
              </Link>
            </motion.div>

          </div>




        </div>

        {/* Right Side */}

        <div
          className="
hidden
md:flex
items-center
justify-center
"
          onMouseMove={handleMouseMove}
        >

          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >

            {/* Mouse Glow */}

            <motion.div
              className="
      absolute
      w-64
      h-64
      rounded-full
      bg-gradient-to-r
from-[#8b4513]/20
to-[#d4a373]/20
      blur-3xl
      opacity-80
      pointer-events-none
      -translate-x-1/2
      -translate-y-1/2
    "
              style={{
                left: mouseX,
                top: mouseY,
              }}
            />

            <HeroAnimation />

          </motion.div>

        </div>

      </section>

      <div className="-mt-1">

        <svg
          viewBox="0 0 1440 180"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#f9fafb"
            d="
      M0,64
      C240,160
      480,0
      720,64
      C960,128
      1200,32
      1440,96
      L1440,180
      L0,180
      Z
      "
          />
        </svg>

      </div>

      {/* Why Choose Us Section */}

      {/* Why Choose Us Section */}

      <section
        className="
py-16
md:py-24
px-6
sm:px-10
lg:px-20
bg-gradient-to-b
from-gray-50
to-white
"
      >

        <div className="text-center mb-16">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
text-3xl
sm:text-4xl
lg:text-5xl
font-bold
text-[#6b1f0f]
"
          >
            Why Choose Us?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-gray-600 mt-4 text-lg"
          >
            We make learning fun, engaging and rewarding.
          </motion.p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Badge */}

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              transformStyle: "preserve-3d",
            }}
            whileHover={{
              y: -12,
              scale: 1.05,
              rotateX: 6,
              rotateY: 6,
            }}
            className="
        bg-white
        p-8
        rounded-3xl
        shadow-lg
        border
        border-gray-100
        hover:border-[#8b4513]
        hover:shadow-2xl
        transition-all
        duration-500
        cursor-pointer
      "
          >

            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: 10,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
              }}
              className="text-6xl mb-4 text-center"
            >
              <Trophy
                size={60}
                strokeWidth={1.8}
                className="mx-auto text-[#8b4513]"
              />
            </motion.div>

            <h3 className="text-2xl font-semibold text-center mb-3">
              Earn Badges
            </h3>

            <p className="text-gray-600 text-center">
              Complete tasks and unlock achievement badges.
            </p>

          </motion.div>

          {/* Streak */}

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              transformStyle: "preserve-3d",
            }}
            whileHover={{
              y: -12,
              scale: 1.05,
              rotateX: 6,
              rotateY: 6,
            }}
            className="
        bg-white
        p-8
        rounded-3xl
        shadow-lg
        border
        border-gray-100
        hover:border-[#8b4513]
        hover:shadow-2xl
        transition-all
        duration-500
        cursor-pointer
      "
          >

            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: 10,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
              }}
              className="text-6xl mb-4 text-center"
            >
              <Flame
                size={60}
                strokeWidth={1.8}
                className="mx-auto text-orange-500"
              />
            </motion.div>

            <h3 className="text-2xl font-semibold text-center mb-3">
              Build Streaks
            </h3>

            <p className="text-gray-600 text-center">
              Stay consistent and grow your learning streak.
            </p>

          </motion.div>

          {/* Duel */}

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              transformStyle: "preserve-3d",
            }}
            whileHover={{
              y: -12,
              scale: 1.05,
              rotateX: 6,
              rotateY: 6,
            }}
            className="
        bg-white
        p-8
        rounded-3xl
        shadow-lg
        border
        border-gray-100
        hover:border-[#8b4513]
        hover:shadow-2xl
        transition-all
        duration-500
        cursor-pointer
      "
          >

            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: 10,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
              }}
              className="text-6xl mb-4 text-center"
            >
              <Swords
                size={60}
                strokeWidth={1.8}
                className="mx-auto text-gray-700"
              />
            </motion.div>

            <h3 className="text-2xl font-semibold text-center mb-3">
              Quiz Duels
            </h3>

            <p className="text-gray-600 text-center">
              Challenge friends in exciting quiz battles.
            </p>

          </motion.div>

          {/* XP */}

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              transformStyle: "preserve-3d",
            }}
            whileHover={{
              y: -12,
              scale: 1.05,
              rotateX: 6,
              rotateY: 6,
            }}
            className="
        bg-white
        p-8
        rounded-3xl
        shadow-lg
        border
        border-gray-100
        hover:border-[#8b4513]
        hover:shadow-2xl
        transition-all
        duration-500
        cursor-pointer
      "
          >

            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: 10,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
              }}
              className="text-6xl mb-4 text-center"
            >
              <TrendingUp
                size={60}
                strokeWidth={1.8}
                className="mx-auto text-green-600"
              />
            </motion.div>

            <h3 className="text-2xl font-semibold text-center mb-3">
              Gain XP & Levels
            </h3>

            <p className="text-gray-600 text-center">
              Earn XP and level up as you learn.
            </p>

          </motion.div>

        </div>

      </section>

    </div>
  );
}