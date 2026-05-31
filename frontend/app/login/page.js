"use client";

import authService from "@/services/authService";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await authService.login(email, password, role);

      if (res.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(res.user));

        if (res.user.role === "teacher") {
          router.push("/teacher");
        } else {
          router.push("/dashboard");
        }
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3b130d]">

      <div className="bg-[#6f311c] w-[420px] p-8">

        <h2 className="text-center text-white text-4xl font-bold mb-8">
          Sign in
        </h2>

        {/* ROLE */}
        <select
          className="w-full p-3 mb-4 bg-[#6f311c] border border-black rounded-md text-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="email"
          className="w-full p-3 mb-4 bg-[#6f311c] border border-black rounded-md text-white placeholder-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="password"
          className="w-full p-3 mb-8 bg-[#6f311c] border border-black rounded-md text-white placeholder-gray-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#431b11] text-white py-3 rounded-md text-xl font-semibold hover:opacity-90"
        >
          Login
        </button>

        {/* FOOTER */}
        <div className="text-center mt-6">

          <p className="text-gray-300 text-sm mb-3">
            Forgot password? Contact your department
          </p>

          <p className="text-white">
            New here?{" "}
            <Link
              href="/signup"
              className="font-semibold underline hover:text-gray-300"
            >
              Create Account
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}