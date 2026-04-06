import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Bot,
  Megaphone,
  ShoppingBag,
  TrendingUp,
  MessageSquare,
  FileText,
  LogOut,
  Sprout,
} from "lucide-react";

// Per-item active color config: text color class + glow shadow
const NAV_COLORS: Record<string, { text: string; glow: string; bg: string; border: string }> = {
  "/":            { text: "text-orange-400",  glow: "shadow-[0_0_12px_rgba(251,146,60,0.55)]",   bg: "bg-orange-400/12",  border: "border-orange-400/30" },
  "/avatar":      { text: "text-orange-400",  glow: "shadow-[0_0_12px_rgba(251,146,60,0.55)]",   bg: "bg-orange-400/12",  border: "border-orange-400/30" },
  "/campaigns":   { text: "text-emerald-400", glow: "shadow-[0_0_12px_rgba(52,211,153,0.5)]",    bg: "bg-emerald-400/10", border: "border-emerald-400/25" },
  "/products":    { text: "text-emerald-400", glow: "shadow-[0_0_12px_rgba(52,211,153,0.5)]",    bg: "bg-emerald-400/10", border: "border-emerald-400/25" },
  "/links":       { text: "text-emerald-400", glow: "shadow-[0_0_12px_rgba(52,211,153,0.5)]",    bg: "bg-emerald-400/10", border: "border-emerald-400/25" },
  "/conversations": { text: "text-white",     glow: "shadow-[0_0_12px_rgba(255,255,255,0.35)]",  bg: "bg-white/8",        border: "border-white/20" },
  "/aura-farming":  { text: "text-amber-300", glow: "shadow-[0_0_12px_rgba(252,211,77,0.45)]",   bg: "bg-amber-300/10",   border: "border-amber-300/25" },
  "/report":      { text: "text-white",       glow: "shadow-[0_0_12px_rgba(255,255,255,0.35)]",  bg: "bg-white/8",        border: "border-white/20" },
};

const navigation = [
  { name: "Dashboard",      href: "/",              icon: LayoutDashboard },
  { name: "Avatar",         href: "/avatar",        icon: Bot              },
  { name: "Brand Collabs",  href: "/campaigns",     icon: Megaphone        },
  { name: "My Products",    href: "/products",      icon: ShoppingBag      },
  { name: "Revenue per Click 💰", href: "/links",   icon: TrendingUp       },
  { name: "Conversations",  href: "/conversations", icon: MessageSquare    },
  { name: "Aura Farming 🌾", href: "/aura-farming", icon: Sprout           },
  { name: "Report",         href: "/report",        icon: FileText         },
];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("cos_authed");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-b md:border-r border-border bg-card/80 backdrop-blur p-4 flex flex-col shrink-0">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
            CreatorOS
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Bharat Edition</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const colors = NAV_COLORS[item.href] ?? { text: "text-foreground", glow: "", bg: "bg-muted", border: "border-border" };

            return (
              <Link
                key={item.name}
                href={item.href}
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
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all mt-4 border border-transparent"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-auto">
        <div className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
