import { useState } from "react";
import { useLocation } from "wouter";
import { FaInstagram, FaYoutube, FaXTwitter, FaGoogle } from "react-icons/fa6";
import { WaitlistModal } from "@/components/waitlist-modal";
import { Sparkles } from "lucide-react";

const platforms = [
  { name: "Continue with Instagram", icon: FaInstagram, color: "from-purple-600 via-pink-500 to-orange-400" },
  { name: "Continue with YouTube",   icon: FaYoutube,   color: "from-red-600 to-red-500" },
  { name: "Continue with X",         icon: FaXTwitter,  color: "from-zinc-900 to-zinc-800" },
  { name: "Continue with Google",    icon: FaGoogle,    color: "from-slate-700 to-slate-600" },
];

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState<string | null>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const handleLogin = (name: string) => {
    setLoading(name);
    setTimeout(() => { localStorage.setItem("cos_authed", "1"); setLocation("/"); }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-orange-600/8 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full bg-amber-400/6 blur-[80px] animate-pulse delay-500" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-[0_0_40px_rgba(249,115,22,0.4)] mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round"/>
              <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
            CreatorOS
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1">Bharat Edition</p>
        </div>

        {/* Tagline */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-foreground leading-snug">
            Your AI Clone.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Your Revenue. Proven.
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Connect your social account to activate your Hinglish Avatar and start converting comments into sales.
          </p>
        </div>

        {/* Social login buttons */}
        <div className="space-y-3">
          {platforms.map((p) => {
            const Icon = p.icon;
            const isLoading = loading === p.name;
            return (
              <button
                key={p.name}
                onClick={() => handleLogin(p.name)}
                disabled={!!loading}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${p.color} transition-all duration-200 shadow-lg hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <Icon className="w-5 h-5" />
                }
                <span className="flex-1 text-left">{isLoading ? "Connecting..." : p.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Demo access */}
        <button
          onClick={() => handleLogin("demo")}
          disabled={!!loading}
          className="w-full py-3 rounded-xl border border-orange-500/30 text-orange-400 font-semibold text-sm hover:bg-orange-500/10 transition-all duration-200 disabled:opacity-60"
        >
          {loading === "demo" ? "Entering..." : "Enter Demo Mode"}
        </button>

        {/* Waitlist CTA */}
        <div className="mt-5 p-4 rounded-xl text-center border border-orange-500/15 bg-orange-500/5">
          <p className="text-xs text-muted-foreground mb-2">Want early access to exclusive beta features?</p>
          <button
            onClick={() => setWaitlistOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Join the Waitlist
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          By continuing you agree to CreatorOS Terms of Service and Privacy Policy.
        </p>
      </div>

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
