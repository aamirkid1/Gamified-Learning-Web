"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Trophy,
  LogOut,
  Sword,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Courses", path: "/courses", icon: BookOpen },
    { name: "Quiz", path: "/quiz", icon: Brain },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Duel", path: "/duel", icon: Sword },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-green-900 text-white flex flex-col">

        {/* LOGO */}
        <div className="p-5 text-xl font-bold border-b border-green-800">
          Gamified App
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition 
                ${
                  isActive
                    ? "bg-green-700"
                    : "hover:bg-green-800"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-green-800">
          <button className="flex items-center gap-2 text-sm hover:text-gray-300">
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAVBAR */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-green-700">
            Gamified Learning
          </h1>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-full">
              A
            </div>
            <span className="text-sm text-gray-700">Student</span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6">{children}</main>

      </div>
    </div>
  );
}