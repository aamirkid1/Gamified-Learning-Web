"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    studentId: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleSignup = async () => {
    const res = await authService.register(form);

    if (res.id) {
      alert("Registration successful");
      router.push("/login");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3b130d]">

      <div className="bg-[#6f311c] w-[420px] p-8">

        <h2 className="text-center text-white text-4xl font-bold mb-8">
          Sign up
        </h2>

        <select
          className="w-full p-3 mb-4 bg-[#6f311c] border border-black rounded-md text-white"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value,
            })
          }
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <input
          placeholder="name"
          className="w-full p-3 mb-4 bg-[#6f311c] border border-black rounded-md text-white placeholder-gray-300"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {form.role === "student" && (
          <>
            <input
              placeholder="roll number"
              className="w-full p-3 mb-4 bg-[#6f311c] border border-black rounded-md text-white placeholder-gray-300"
              onChange={(e) =>
                setForm({ ...form, rollNo: e.target.value })
              }
            />

            <input
              placeholder="student id"
              className="w-full p-3 mb-4 bg-[#6f311c] border border-black rounded-md text-white placeholder-gray-300"
              onChange={(e) =>
                setForm({ ...form, studentId: e.target.value })
              }
            />
          </>
        )}

        <input
          placeholder="email"
          className="w-full p-3 mb-4 bg-[#6f311c] border border-black rounded-md text-white placeholder-gray-300"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="password"
          className="w-full p-3 mb-8 bg-[#6f311c] border border-black rounded-md text-white placeholder-gray-300"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleSignup}
          className="w-full bg-[#431b11] text-white py-3 rounded-md text-xl font-semibold hover:opacity-90"
        >
          Register
        </button>

      </div>

    </div>
  );
}