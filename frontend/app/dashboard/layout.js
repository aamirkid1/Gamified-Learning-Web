
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
  Menu,
  X,
  Bell,
  Zap,
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
 
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);
 
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
 
  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
 
  // Prevent body scrolling while the mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
 
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);
 
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
 
  // Shared sidebar content, rendered both in the fixed desktop rail
  // and the mobile slide-in drawer so they never fall out of sync.
  const SidebarContent = ({ onNavigate }) => (
    <>
      {/* Absolute Top Accent Ribbon */}
      <div className="h-2 bg-[#6b1f0f] w-full" />
 
      {/* LOGO SECTION */}
      <div className="p-6 border-b border-[#6f311c]/40 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8b4513] flex items-center justify-center font-black text-base shadow-md border border-white/10">
              G
            </div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Gamified Learning
            </h1>
          </div>
 
          {/* Close button, mobile drawer only */}
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="lg:hidden text-gray-300 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2 pl-0.5">
          Student Portal
        </p>
      </div>
 
      {/* NAVIGATION SYSTEM */}
      <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
        {menu.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
 
          return (
            <Link
              key={index}
              href={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ease-in-out group relative
              ${isActive
                  ? "bg-[#8b4513] text-white shadow-lg shadow-black/20 font-bold border-l-4 border-white translate-x-0"
                  : "text-gray-300 hover:text-white hover:bg-[#6f311c]/40 hover:translate-x-1 hover:shadow-md hover:shadow-black/10 font-medium"
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
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-red-950/20 hover:shadow-md hover:shadow-black/10 transition-all duration-300 ease-in-out group"
        >
          <LogOut size={18} className="text-gray-400 group-hover:text-white transition-colors duration-200" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
 
  return (
    <div className="flex min-h-screen bg-[#f5f1ed] text-[#000000] font-sans antialiased">
 
      {/* DESKTOP SIDEBAR (static rail, unchanged behavior) */}
      <aside className="
hidden
lg:flex
w-72
bg-[#3b130d]
text-white
flex-col
shadow-2xl
shadow-black/40
relative
z-20
border-r
border-[#6b1f0f]/30
">
        <SidebarContent onNavigate={undefined} />
      </aside>
 
      {/* MOBILE BACKDROP */}
      <div
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
        className={`
lg:hidden
fixed
inset-0
z-40
bg-black/60
backdrop-blur-sm
transition-opacity
duration-300
ease-in-out
${isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }
`}
      />
 
      {/* MOBILE SLIDE-IN DRAWER */}
      <aside
        className={`
lg:hidden
fixed
inset-y-0
left-0
z-50
w-72
max-w-[85%]
bg-[#3b130d]
text-white
flex
flex-col
shadow-2xl
shadow-black/50
transform
transition-transform
duration-300
ease-in-out
${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
`}
      >
        <SidebarContent onNavigate={() => setIsMenuOpen(false)} />
      </aside>
 
      {/* MAIN VIEWPORT FRAME */}
      <div className="flex-1 flex flex-col min-w-0">
 
        {/* TOPBAR BANNER */}
        <header className="
relative
sticky
top-0
z-30
backdrop-blur-xl
bg-white/70
border-b
border-white/30
shadow-lg
shadow-black/5
px-4
sm:px-6
lg:px-8
py-4
flex
justify-between
items-center
gap-4
transition-shadow
duration-300
">
 
          {/* HEADER GLOW */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute right-20 top-0 w-48 h-48 bg-[#8b4513]/20 blur-[120px] rounded-full" />
          </div>
 
          {/* LEFT SIDE: hamburger (mobile) + hub label */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="
lg:hidden
flex
items-center
justify-center
w-10
h-10
rounded-xl
bg-white/60
backdrop-blur-md
border
border-white/40
shadow-sm
text-[#3b130d]
hover:bg-white/80
hover:shadow-md
active:scale-95
transition-all
duration-200
shrink-0
"
            >
              <Menu size={20} />
            </button>
 
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
truncate
">
              Academic Hub
            </span>
          </div>
 
          {/* USER INTERFACE PROFILE BLOCKS */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
 
            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className="
relative
hidden
sm:flex
items-center
justify-center
w-10
h-10
rounded-xl
bg-white/60
backdrop-blur-md
border
border-white/40
shadow-sm
text-[#3b130d]
hover:bg-white/80
hover:shadow-md
active:scale-95
transition-all
duration-200
"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#8b4513] ring-2 ring-white/80" />
            </button>
 
            {/* XP Badge */}
            <div className="
hidden
sm:flex
items-center
gap-1.5
bg-gradient-to-r
from-[#8b4513]/10
to-[#a0522d]/10
px-3.5
py-2
rounded-full
border
border-[#8b4513]/20
shadow-sm
">
              <Zap size={14} className="text-[#8b4513] fill-[#8b4513]" />
              <span className="text-xs font-bold text-[#8b4513] tracking-wide">
                {user?.xp ?? 0} XP
              </span>
            </div>
 
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
shadow-black/10
border
border-white/20
ring-4
ring-white/40
hover:ring-white/60
hover:shadow-xl
transition-all
duration-300
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
 