import { useState } from "react";
import { useLocation } from "wouter";
import { FaInstagram, FaYoutube, FaXTwitter, FaGoogle } from "react-icons/fa6";
import { motion } from "framer-motion";
import { WaitlistModal } from "@/components/waitlist-modal";
import { Sparkles } from "lucide-react";

const platforms = [
  { name: "Continue with Instagram", icon: FaInstagram, color: "from-purple-600 via-pink-500 to-orange-400" },
  { name: "Continue with YouTube",   icon: FaYoutube,   color: "from-red-600 to-red-500" },
  { name: "Continue with X",         icon: FaXTwitter,  color: "from-zinc-800 to-zinc-700" },
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

      {/* ── Aurora background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-orb-1 absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(45,212,191,0.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="aurora-orb-2 absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(167,139,250,0.16) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="aurora-orb-3 absolute top-[30%] right-[5%] w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="aurora-orb-4 absolute bottom-[10%] left-[15%] w-[250px] h-[250px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(74,222,128,0.10) 0%, transparent 70%)", filter: "blur(50px)" }} />
        {/* Grid */}
        <div className="aurora-grid absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(45,212,191,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto px-6 py-8">

        {/* Logo */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(45,212,191,0.3), rgba(167,139,250,0.3))",
              border: "1px solid rgba(45,212,191,0.3)",
              boxShadow: "0 0 40px rgba(45,212,191,0.25), 0 0 80px rgba(167,139,250,0.15)",
            }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="url(#auroraStroke)" strokeWidth={2}>
              <defs>
                <linearGradient id="auroraStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round"/>
              <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tight"
            style={{ background: "linear-gradient(135deg, #2dd4bf, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CreatorOS
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.22em] mt-1.5">Bharat Edition</p>
        </motion.div>

        {/* Tagline */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <h2 className="text-xl font-bold leading-snug">
            Your AI Clone.<br />
            <span style={{ background: "linear-gradient(135deg, #2dd4bf, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Your Revenue. Proven.
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Connect your social account to activate your Hinglish Avatar and start converting comments into sales.
          </p>
        </motion.div>

        {/* Social buttons */}
        <motion.div className="space-y-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
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
        </motion.div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Demo */}
        <motion.button
          onClick={() => handleLogin("demo")}
          disabled={!!loading}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60"
          style={{
            border: "1px solid rgba(45,212,191,0.3)",
            color: "#2dd4bf",
            background: "rgba(45,212,191,0.05)",
          }}
          whileHover={{ background: "rgba(45,212,191,0.12)" }}
        >
          {loading === "demo" ? "Entering..." : "Enter Demo Mode"}
        </motion.button>

        {/* Waitlist CTA */}
        <motion.div
          className="mt-5 p-4 rounded-xl text-center"
          style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.08), rgba(167,139,250,0.08))", border: "1px solid rgba(45,212,191,0.15)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground mb-2">Want early access to exclusive beta features?</p>
          <button
            onClick={() => setWaitlistOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #2dd4bf, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            Join the Waitlist
          </button>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground/50 mt-5">
          By continuing you agree to CreatorOS Terms of Service and Privacy Policy.
        </p>
      </div>

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
