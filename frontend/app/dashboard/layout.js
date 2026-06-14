"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";


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
  Layers,
} from "lucide-react";

// export default function DashboardLayout({ children }) {
//   const pathname = usePathname();
export default function DashboardLayout({
  children,
}) {
  const pathname = usePathname();
  const router = useRouter();

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

  const handleLogout = () => {
    localStorage.clear();

    router.replace("/login");
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Courses",
      path: "/courses",
      icon: BookOpen,
    },

    {
      name: "Quiz",
      path: "/quiz",
      icon: Brain,
    },

    {
      name: "Flashcards",
      path: "/dashboard/flashcards",
      icon: Layers,
    },

    {
      name: "Leaderboard",
      path: "/dashboard/leaderboard",
      icon: Trophy,
    },

    {
      name: "Duel",
      path: "/duel",
      icon: Sword,
    },
  ];


  return (
    <div className="flex min-h-screen bg-[#f5f1ed] text-[#000000] font-sans antialiased">

      {/* SIDEBAR */}
      <aside className="
hidden
lg:flex
w-72
bg-[#3b130d]
text-white
flex-col
shadow-2xl
relative
z-20
border-r
border-[#6b1f0f]/30
">

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
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-red-950/20 transition-all duration-150 group"
          >
            <LogOut size={18} className="text-gray-400 group-hover:text-white transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT FRAME */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR BANNER */}
        <header className="
relative
sticky
top-0
z-50
backdrop-blur-xl
bg-white/70
border-b
border-white/30
shadow-lg
px-4
sm:px-6
lg:px-8
py-4
flex
justify-between
items-center
">

          {/* HEADER GLOW */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute right-20 top-0 w-48 h-48 bg-[#8b4513]/20 blur-[120px] rounded-full" />
          </div>
          <div>
            <span className="
text-xs
font-bold
text-[#8b4513]
bg-white/60
backdrop-blur-md
px-4
py-2
rounded-full
border
border-white/40
shadow-sm
tracking-wide
uppercase
">
              Academic Hub
            </span>
          </div>

          {/* USER INTERFACE PROFILE BLOCKS */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="
font-bold
text-base
text-[#3b130d]
tracking-tight
">
                {user?.name || "Student"}
              </p>
              <p className="
text-xs
font-semibold
text-gray-400
uppercase
tracking-widest
">
                Tier Rank #{rank}
              </p>
            </div>

            {/* Custom Monogram Badge */}
            <div className="
w-12
h-12
rounded-2xl
bg-gradient-to-br
from-[#8b4513]
to-[#a0522d]
text-white
flex
items-center
justify-center
font-black
text-lg
shadow-lg
border
border-white/20
ring-4
ring-white/40
">
              {
                user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"
              }
            </div>
          </div>
        </header>

        {/* MAIN DYNAMIC CONTENT CONTAINER */}
        <main className="
p-4
sm:p-6
md:p-8
lg:p-10
flex-1
overflow-y-auto
max-w-7xl
w-full
mx-auto
">
          {children}
        </main>

      </div>
    </div>
  );
}