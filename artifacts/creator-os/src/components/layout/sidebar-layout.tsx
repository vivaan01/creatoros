import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Bot, Megaphone, ShoppingBag, TrendingUp,
  MessageSquare, FileText, LogOut, Sprout, Menu, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Aurora-themed active colours
const NAV_COLORS: Record<string, { text: string; glow: string; bg: string; border: string }> = {
  "/":              { text: "text-teal-300",   glow: "shadow-[0_0_14px_rgba(45,212,191,0.5)]",   bg: "bg-teal-400/10",   border: "border-teal-400/30" },
  "/avatar":        { text: "text-teal-300",   glow: "shadow-[0_0_14px_rgba(45,212,191,0.5)]",   bg: "bg-teal-400/10",   border: "border-teal-400/30" },
  "/campaigns":     { text: "text-violet-300", glow: "shadow-[0_0_14px_rgba(167,139,250,0.5)]",  bg: "bg-violet-400/10", border: "border-violet-400/30" },
  "/products":      { text: "text-violet-300", glow: "shadow-[0_0_14px_rgba(167,139,250,0.5)]",  bg: "bg-violet-400/10", border: "border-violet-400/30" },
  "/links":         { text: "text-violet-300", glow: "shadow-[0_0_14px_rgba(167,139,250,0.5)]",  bg: "bg-violet-400/10", border: "border-violet-400/30" },
  "/conversations": { text: "text-cyan-300",   glow: "shadow-[0_0_14px_rgba(34,211,238,0.45)]",  bg: "bg-cyan-400/10",   border: "border-cyan-400/30" },
  "/aura-farming":  { text: "text-emerald-300",glow: "shadow-[0_0_14px_rgba(52,211,153,0.5)]",   bg: "bg-emerald-400/10",border: "border-emerald-400/30" },
  "/report":        { text: "text-cyan-300",   glow: "shadow-[0_0_14px_rgba(34,211,238,0.45)]",  bg: "bg-cyan-400/10",   border: "border-cyan-400/30" },
};

const navigation = [
  { name: "Dashboard",             href: "/",              icon: LayoutDashboard },
  { name: "Avatar",                href: "/avatar",        icon: Bot             },
  { name: "Brand Collabs",         href: "/campaigns",     icon: Megaphone       },
  { name: "My Products",           href: "/products",      icon: ShoppingBag     },
  { name: "Revenue per Click 💰",  href: "/links",         icon: TrendingUp      },
  { name: "Conversations",         href: "/conversations", icon: MessageSquare   },
  { name: "Aura Farming 🌾",       href: "/aura-farming",  icon: Sprout          },
  { name: "Report",                href: "/report",        icon: FileText        },
];

const BOTTOM_TABS = [
  { name: "Home",    href: "/",              icon: LayoutDashboard },
  { name: "Avatar",  href: "/avatar",        icon: Bot             },
  { name: "DMs",     href: "/conversations", icon: MessageSquare   },
  { name: "Revenue", href: "/links",         icon: TrendingUp      },
];

function NavLink({ item, onClick }: { item: typeof navigation[0]; onClick?: () => void }) {
  const [location] = useLocation();
  const isActive = location === item.href;
  const colors = NAV_COLORS[item.href] ?? { text: "text-foreground", glow: "", bg: "bg-muted", border: "border-border" };
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium border ${
        isActive
          ? `${colors.bg} ${colors.text} ${colors.border} ${colors.glow}`
          : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground"
      }`}
    >
      <item.icon className={`h-4 w-4 shrink-0 ${isActive ? colors.text : ""}`} />
      <span className="truncate">{item.name}</span>
    </Link>
  );
}

const AuroraHeader = () => (
  <div>
    <h1 className="text-xl font-black tracking-tight leading-none"
      style={{ background: "linear-gradient(135deg, #2dd4bf, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      CreatorOS
    </h1>
    <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Bharat Edition</p>
  </div>
);

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setDrawerOpen(false); }, [location]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleLogout = () => {
    localStorage.removeItem("cos_authed");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* Global aurora background orbs (subtle, behind everything) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="aurora-orb-1 absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(45,212,191,0.07) 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="aurora-orb-2 absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(167,139,250,0.07) 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="aurora-orb-3 absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 65%)", filter: "blur(60px)" }} />
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <div className="hidden md:flex w-64 border-r border-white/5 bg-[hsl(240,35%,4%)]/90 backdrop-blur flex-col shrink-0 fixed top-0 left-0 h-screen z-30">
        <div className="p-4 pb-2 pt-5">
          <h1 className="text-2xl font-black tracking-tight leading-none"
            style={{ background: "linear-gradient(135deg, #2dd4bf, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CreatorOS
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Bharat Edition</p>
        </div>
        <nav className="flex flex-col gap-0.5 flex-1 px-3 py-3 overflow-y-auto">
          {navigation.map((item) => <NavLink key={item.href} item={item} />)}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all w-full border border-transparent">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[hsl(240,35%,4%)]/95 backdrop-blur-md border-b border-white/5">
        <AuroraHeader />
        <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-lg bg-white/5 text-muted-foreground" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ── SLIDE-OUT DRAWER ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)} />
            <motion.div
              className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col border-r border-white/5"
              style={{ background: "hsl(240,35%,4%)" }}
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
                <AuroraHeader />
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg bg-white/5 text-muted-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex flex-col gap-0.5 flex-1 p-3 overflow-y-auto">
                {navigation.map((item) => <NavLink key={item.href} item={item} onClick={() => setDrawerOpen(false)} />)}
              </nav>
              <div className="p-3 border-t border-white/5">
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all w-full">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-h-0 md:ml-64 relative z-10">
        <div className="h-14 md:hidden shrink-0" />
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-28 md:pb-8">
          {children}
        </div>
        <div className="h-16 md:hidden shrink-0" />
      </main>

      {/* ── MOBILE BOTTOM TABS ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[hsl(240,35%,4%)]/95 backdrop-blur-md">
        <div className="flex items-stretch">
          {BOTTOM_TABS.map((tab) => {
            const isActive = location === tab.href;
            const colors = NAV_COLORS[tab.href] ?? { text: "text-muted-foreground", glow: "" };
            return (
              <Link key={tab.href} href={tab.href}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all ${isActive ? colors.text : "text-muted-foreground"}`}>
                <tab.icon className={`h-5 w-5 ${isActive ? `drop-shadow-[0_0_6px_currentColor]` : ""}`} />
                <span className="text-[10px] font-medium">{tab.name}</span>
              </Link>
            );
          })}
          <button onClick={() => setDrawerOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-muted-foreground">
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
