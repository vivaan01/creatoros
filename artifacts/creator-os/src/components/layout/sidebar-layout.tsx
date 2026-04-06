import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Bot,
  Megaphone,
  ShoppingBag,
  Link2,
  MessageSquare,
  FileText,
} from "lucide-react";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Avatar Engine", href: "/avatar", icon: Bot },
    { name: "Campaigns", href: "/campaigns", icon: Megaphone },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "Linkrunner", href: "/links", icon: Link2 },
    { name: "Conversations", href: "/conversations", icon: MessageSquare },
    { name: "Report", href: "/report", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-b md:border-r border-border bg-card p-4 flex flex-col shrink-0">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
            CreatorOS
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Bharat Edition</p>
        </div>
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
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
