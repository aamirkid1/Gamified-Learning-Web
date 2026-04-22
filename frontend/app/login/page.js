"use client";
import authService from "@/services/authService";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = () => {
  //   router.push("/dashboard");
  // };

  const handleLogin = async () => {
    try {
      const res = await authService.login(email, password);

      if (res.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(res.user));
        router.push("/dashboard");
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* HEADER */}
      <div className="bg-green-700 text-white px-6 py-3 flex items-center shadow-md">
        <h1 className="text-lg font-semibold">
          Gamified Learning Platform
        </h1>
      </div>

      {/* BACKGROUND IMAGE SECTION */}
      <div
        className="flex flex-1 items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/jamia.jpg')", // 👈 put image in public folder
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* LOGIN CARD */}
        <div className="relative bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[420px] border-t-4 border-green-600">

          {/* TITLE */}
          <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
            Student Login
          </h2>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-4 mb-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-4 mb-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition font-semibold text-lg"
          >
            Login
          </button>

          {/* FOOTER */}
          <div className="text-center mt-5 space-y-2">

            <p className="text-sm text-gray-600">
              Forgot password? Contact your department
            </p>

            <p className="text-sm text-gray-700">
              New here?{" "}
              <Link
                href="/signup"
                className="text-green-600 font-semibold hover:text-green-800"
              >
                Create Account →
              </Link>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}