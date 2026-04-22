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
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-10 rounded-xl shadow w-[420px]">

        <h2 className="text-2xl font-bold mb-6 text-green-700">
          Student Signup
        </h2>

        {["name", "rollNo", "studentId", "email", "password"].map((field) => (
          <input
            key={field}
            placeholder={field}
            type={field === "password" ? "password" : "text"}
            className="w-full p-3 mb-3 border rounded"
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white p-3 rounded"
        >
          Register
        </button>

      </div>
    </div>
  );
}