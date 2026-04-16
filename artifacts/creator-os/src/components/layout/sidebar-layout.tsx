import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Bot, Megaphone, ShoppingBag, TrendingUp,
  MessageSquare, FileText, LogOut, Sprout, Menu, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_COLORS: Record<string, { text: string; glow: string; bg: string; border: string }> = {
  "/":              { text: "text-orange-400",  glow: "shadow-[0_0_12px_rgba(251,146,60,0.55)]",  bg: "bg-orange-400/12",  border: "border-orange-400/30" },
  "/avatar":        { text: "text-orange-400",  glow: "shadow-[0_0_12px_rgba(251,146,60,0.55)]",  bg: "bg-orange-400/12",  border: "border-orange-400/30" },
  "/campaigns":     { text: "text-emerald-400", glow: "shadow-[0_0_12px_rgba(52,211,153,0.5)]",   bg: "bg-emerald-400/10", border: "border-emerald-400/25" },
  "/products":      { text: "text-emerald-400", glow: "shadow-[0_0_12px_rgba(52,211,153,0.5)]",   bg: "bg-emerald-400/10", border: "border-emerald-400/25" },
  "/links":         { text: "text-emerald-400", glow: "shadow-[0_0_12px_rgba(52,211,153,0.5)]",   bg: "bg-emerald-400/10", border: "border-emerald-400/25" },
  "/conversations": { text: "text-white",       glow: "shadow-[0_0_12px_rgba(255,255,255,0.35)]", bg: "bg-white/8",        border: "border-white/20" },
  "/aura-farming":  { text: "text-amber-300",   glow: "shadow-[0_0_12px_rgba(252,211,77,0.45)]",  bg: "bg-amber-300/10",   border: "border-amber-300/25" },
  "/report":        { text: "text-white",       glow: "shadow-[0_0_12px_rgba(255,255,255,0.35)]", bg: "bg-white/8",        border: "border-white/20" },
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
          : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <item.icon className={`h-4 w-4 shrink-0 ${isActive ? colors.text : ""}`} />
      <span className="truncate">{item.name}</span>
    </Link>
  );
}

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

      {/* ── DESKTOP SIDEBAR ── */}
      <div className="hidden md:flex w-64 border-r border-border bg-card/80 backdrop-blur flex-col shrink-0 fixed top-0 left-0 h-screen z-30">
        <div className="p-4 mb-4">
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
            CreatorOS
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Bharat Edition</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1 px-4 overflow-y-auto">
          {navigation.map((item) => <NavLink key={item.href} item={item} />)}
        </nav>
        <div className="p-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full border border-transparent"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur-md border-b border-border/60">
        <div>
          <h1 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300 leading-none">
            CreatorOS
          </h1>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Bharat Edition</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ── SLIDE-OUT DRAWER ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-card border-r border-border flex flex-col"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-border/50">
                <div>
                  <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">CreatorOS</h1>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Bharat Edition</p>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 flex-1 p-3 overflow-y-auto">
                {navigation.map((item) => <NavLink key={item.href} item={item} onClick={() => setDrawerOpen(false)} />)}
              </nav>
              <div className="p-4 border-t border-border/50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-h-0 md:ml-64">
        <div className="h-14 md:hidden shrink-0" />
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          {children}
        </div>
        <div className="h-16 md:hidden shrink-0" />
      </main>

      {/* ── MOBILE BOTTOM TABS ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/60">
        <div className="flex items-stretch">
          {BOTTOM_TABS.map((tab) => {
            const isActive = location === tab.href;
            const colors = NAV_COLORS[tab.href] ?? { text: "text-muted-foreground", glow: "" };
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all duration-200 ${isActive ? colors.text : "text-muted-foreground"}`}
              >
                <tab.icon className={`h-5 w-5 ${isActive ? `drop-shadow-[0_0_6px_currentColor]` : ""}`} />
                <span className="text-[10px] font-medium tracking-tight">{tab.name}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-muted-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
