// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();

//   useEffect(() => {
//     router.push("/login");
//   }, [router]);

//   return <div>Loading...</div>;
// }

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Top Strip */}
      <div className="h-10 bg-[#6b1f0f]"></div>

      {/* Navbar */}
      <nav className="h-20 bg-[#8b4513] flex items-center px-24">

        <div className="ml-auto flex gap-24 text-black font-semibold text-xl">

          <Link href="#">About us</Link>

          <Link href="/login">Sign in</Link>

          <Link href="/signup">Sign up</Link>

          <Link href="#">Contact us</Link>

          <Link href="#">Learn more</Link>

        </div>

      </nav>
      {/* Main Section */}
      <div className="grid grid-cols-2">

        {/* Left Side */}
        <div className="bg-[#efefef] flex flex-col justify-center pl-24">

          <h1 className="text-6xl italic leading-tight mb-10">
            Gamified Learning Platform
          </h1>

          <p className="text-2xl italic max-w-lg">
            A gamified learning platform designed for students of the Department of Education. Learn through courses, quizzes, achievements, XP points and leaderboards.
          </p>

        </div>

        {/* Right Side */}
        <div>

          <img
            src="/landing-image.png"
            alt="education"
            className="w-full h-[85vh] object-cover"
          />

        </div>

      </div>

    </div>
  );
}