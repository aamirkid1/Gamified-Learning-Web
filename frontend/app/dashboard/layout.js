"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import leaderboardService from "@/services/leaderboardService";

import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Trophy,
  LogOut,
  Sword,
} from "lucide-react";

// export default function DashboardLayout({ children }) {
//   const pathname = usePathname();
export default function DashboardLayout({
  children,
}) {
  const pathname = usePathname();

  const [user, setUser] =
    useState(null);

  const [rank, setRank] =
    useState("-");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser =
    async () => {
      const currentUser =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      if (!currentUser) return;

      setUser(currentUser);

      const result =
        await leaderboardService.getMyRank(
          currentUser.id
        );

      setRank(result.rank);
    };

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Courses", path: "/courses", icon: BookOpen },
    { name: "Quiz", path: "/quiz", icon: Brain },
    { name: "Leaderboard", path: "/dashboard/leaderboard", icon: Trophy },
    { name: "Duel", path: "/duel", icon: Sword },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f1ed] text-[#000000] font-sans antialiased">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#3b130d] text-white flex flex-col shadow-2xl relative z-20 border-r border-[#6b1f0f]/30">

        {/* Absolute Top Accent Ribbon */}
        <div className="h-2 bg-[#6b1f0f] w-full" />

        {/* LOGO SECTION */}
        <div className="p-6 border-b border-[#6f311c]/40 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8b4513] flex items-center justify-center font-black text-base shadow-md border border-white/10">
              G
            </div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Gamified Learning
            </h1>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2 pl-0.5">
            Student Portal
          </p>
        </div>

        {/* NAVIGATION SYSTEM */}
        <nav className="flex-1 p-5 space-y-2">
          {menu.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group relative
                ${isActive
                    ? "bg-[#8b4513] text-white shadow-lg font-bold border-l-4 border-white"
                    : "text-gray-300 hover:text-white hover:bg-[#6f311c]/40 font-medium"
                  }`}
              >
                <Icon
                  size={20}
                  className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                    }`}
                />
                <span className="tracking-wide text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* SECURE SESSION LOGOUT */}
        <div className="p-5 border-t border-[#6f311c]/40 bg-[#35140d]/30">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-red-950/20 transition-all duration-150 group">
            <LogOut size={18} className="text-gray-400 group-hover:text-white transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT FRAME */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR BANNER */}
        <header className="bg-white shadow-sm border-b border-[#eaded4] px-8 py-5 flex justify-between items-center z-10">
          <div>
            <span className="text-xs font-bold text-[#8b4513] bg-[#f5f1ed] px-3 py-1 rounded-full border border-[#eaded4] tracking-wide uppercase">
              Academic Hub
            </span>
          </div>

          {/* USER INTERFACE PROFILE BLOCKS */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-extrabold text-sm text-[#3b130d] tracking-tight leading-none mb-1">
                {user?.name || "Student"}
              </p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Tier Rank #{rank}
              </p>
            </div>

            {/* Custom Monogram Badge */}
            <div className="w-10 h-10 rounded-xl bg-[#8b4513] text-white flex items-center justify-center font-black shadow-inner border border-white/10 ring-4 ring-[#f5f1ed]">
              {
                user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"
              }
            </div>
          </div>
        </header>

        {/* MAIN DYNAMIC CONTENT CONTAINER */}
        <main className="p-8 md:p-10 flex-1 overflow-y-auto max-w-6xl w-full mx-auto">
          {children}
        </main>

      </div>
    </div>
  );
}