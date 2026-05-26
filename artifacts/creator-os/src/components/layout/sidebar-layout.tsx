import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Bot, Megaphone, ShoppingBag, TrendingUp,
  MessageSquare, FileText, LogOut, Sprout, Menu, X, ChevronRight, Home, User,
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
  { name: "Dashboard",            href: "/",              icon: LayoutDashboard },
  { name: "Avatar",               href: "/avatar",        icon: Bot             },
  { name: "Brand Collabs",        href: "/campaigns",     icon: Megaphone       },
  { name: "My Products",          href: "/products",      icon: ShoppingBag     },
  { name: "Revenue per Click 💰", href: "/links",         icon: TrendingUp      },
  { name: "Conversations",        href: "/conversations", icon: MessageSquare   },
  { name: "Aura Farming 🌾",      href: "/aura-farming",  icon: Sprout          },
  { name: "Report",               href: "/report",        icon: FileText        },
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
    <Link href={item.href} onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium border ${
        isActive
          ? `${colors.bg} ${colors.text} ${colors.border} ${colors.glow}`
          : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}>
      <item.icon className={`h-4 w-4 shrink-0 ${isActive ? colors.text : ""}`} />
      <span className="truncate">{item.name}</span>
    </Link>
  );
}

/* ── Demo user profile pill ── */
function DemoUserProfile() {
  const name = localStorage.getItem("cos_user_name");
  if (!name) return null;
  return (
    <div className="mx-4 mb-2 mt-1 px-3 py-2 rounded-xl bg-orange-500/8 border border-orange-500/20 flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}>
        <User className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-orange-300 truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground">Demo Mode</p>
      </div>
    </div>
  );
}

/* ── Welcome banner (shown once after demo login) ── */
function WelcomeBanner() {
  const name = localStorage.getItem("cos_user_name");
  const [visible, setVisible] = useState(() => {
    return !!name && !sessionStorage.getItem("cos_banner_dismissed");
  });
  if (!visible || !name) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
        className="mx-4 mt-4 mb-0 px-4 py-3 rounded-xl border border-orange-500/25 bg-orange-500/8 flex items-center justify-between gap-3"
      >
        <p className="text-sm font-semibold">
          🙏 Welcome &amp; Namaste, <span className="text-orange-400">{name}</span>! Let's build your creator empire.
        </p>
        <button onClick={() => { sessionStorage.setItem("cos_banner_dismissed", "1"); setVisible(false); }}
          className="text-muted-foreground hover:text-foreground shrink-0">
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Desktop hover-reveal sidebar state
  const [desktopOpen, setDesktopOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Track mouse X to reveal sidebar when near left edge
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (e.clientX <= 8) {
      clearTimeout(hoverTimeoutRef.current);
      setDesktopOpen(true);
    }
  }, []);

  // Hide sidebar when mouse leaves the sidebar panel
  const handleSidebarLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setDesktopOpen(false), 120);
  }, []);
  const handleSidebarEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => { window.removeEventListener("mousemove", handleMouseMove); clearTimeout(hoverTimeoutRef.current); };
  }, [handleMouseMove]);

  useEffect(() => { setMobileDrawerOpen(false); setDesktopOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileDrawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileDrawerOpen]);

  const handleLogout = () => {
    localStorage.removeItem("cos_authed");
    localStorage.removeItem("cos_user_name");
    localStorage.removeItem("cos_welcomed");
    sessionStorage.removeItem("cos_banner_dismissed");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── DESKTOP HOVER SIDEBAR (overlay, not in flow) ── */}
      <div className="hidden md:block">
        {/* Invisible left-edge trigger strip */}
        <div className="fixed top-0 left-0 h-full w-2 z-30" onMouseEnter={() => { clearTimeout(hoverTimeoutRef.current); setDesktopOpen(true); }} />

        {/* Sidebar panel */}
        <motion.div
          ref={sidebarRef}
          className="fixed top-0 left-0 h-screen w-64 z-40 flex flex-col border-r border-border bg-card/95 backdrop-blur-xl shadow-2xl"
          initial={false}
          animate={{ x: desktopOpen ? 0 : -260 }}
          transition={{ type: "spring", stiffness: 340, damping: 34 }}
          onMouseEnter={handleSidebarEnter}
          onMouseLeave={handleSidebarLeave}
        >
          <div className="p-4 pb-2">
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
              CreatorOS
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Bharat Edition</p>
          </div>

          {/* Demo user profile */}
          <DemoUserProfile />

          <nav className="flex flex-col gap-1 flex-1 px-4 overflow-y-auto pb-2">
            {/* Home page link */}
            <Link href="/landing"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground mb-1">
              <Home className="h-4 w-4 shrink-0" />
              <span>Home Page</span>
            </Link>
            <div className="h-px bg-border/40 mb-1" />
            {navigation.map((item) => <NavLink key={item.href} item={item} />)}
          </nav>
          <div className="p-4 border-t border-border/50">
            <button onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full border border-transparent">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Peek indicator — visible when sidebar is hidden */}
        <AnimatePresence>
          {!desktopOpen && (
            <motion.div
              className="fixed top-1/2 left-0 -translate-y-1/2 z-30 flex items-center justify-center w-5 h-12 rounded-r-lg bg-card/80 border border-l-0 border-border cursor-pointer"
              initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }}
              onClick={() => setDesktopOpen(true)}
            >
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur-md border-b border-border/60">
        <div>
          <h1 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300 leading-none">
            CreatorOS
          </h1>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Bharat Edition</p>
        </div>
        <button onClick={() => setMobileDrawerOpen(true)}
          className="p-2 rounded-lg bg-muted/50 text-muted-foreground" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ── MOBILE SLIDE-OUT DRAWER ── */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)} />
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
                <button onClick={() => setMobileDrawerOpen(false)} className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <DemoUserProfile />
              <nav className="flex flex-col gap-1 flex-1 p-3 overflow-y-auto">
                <Link href="/landing" onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-sm font-medium border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground mb-1">
                  <Home className="h-4 w-4 shrink-0" />
                  <span>Home Page</span>
                </Link>
                <div className="h-px bg-border/40 mb-1" />
                {navigation.map((item) => <NavLink key={item.href} item={item} onClick={() => setMobileDrawerOpen(false)} />)}
              </nav>
              <div className="p-4 border-t border-border/50">
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT (full width — sidebar overlays) ── */}
      <main className="flex-1 flex flex-col min-h-0 w-full">
        <div className="h-14 md:hidden shrink-0" />
        <WelcomeBanner />
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
              <Link key={tab.href} href={tab.href}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all duration-200 ${isActive ? colors.text : "text-muted-foreground"}`}>
                <tab.icon className={`h-5 w-5 ${isActive ? "drop-shadow-[0_0_6px_currentColor]" : ""}`} />
                <span className="text-[10px] font-medium tracking-tight">{tab.name}</span>
              </Link>
            );
          })}
          <button onClick={() => setMobileDrawerOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-muted-foreground">
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
