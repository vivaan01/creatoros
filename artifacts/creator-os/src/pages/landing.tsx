import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  FaInstagram, FaYoutube, FaXTwitter, FaTiktok, FaFacebook,
} from "react-icons/fa6";
import {
  Bot, Shield, Zap, TrendingUp, MessageSquare, Megaphone,
  ShoppingBag, Sprout, Star, ArrowRight, Play, CheckCircle2,
  Globe, Award, Lock, Users,
} from "lucide-react";
import { WaitlistModal } from "@/components/waitlist-modal";

/* ── Animated creator counter ── */
function useCounter(start: number) {
  const [count, setCount] = useState(start);
  useEffect(() => {
    const iv = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 3 + 1)), 1800);
    return () => clearInterval(iv);
  }, []);
  return count;
}

/* ── Fade-in on scroll ── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const PLATFORMS = [
  { icon: FaInstagram, name: "Instagram", color: "#E1306C" },
  { icon: FaYoutube,   name: "YouTube",   color: "#FF0000" },
  { icon: FaXTwitter,  name: "X",         color: "#ffffff" },
  { icon: FaTiktok,    name: "TikTok",    color: "#69C9D0" },
  { icon: FaFacebook,  name: "Facebook",  color: "#1877F2" },
];

const FEATURES = [
  { icon: Bot,          title: "AI Avatar Engine",     desc: "Your Hinglish AI clone replies to every comment, converts followers into buyers 24/7 — even while you sleep.",           color: "text-orange-400", glow: "rgba(249,115,22,0.2)" },
  { icon: Megaphone,    title: "Brand Collabs",        desc: "AI-matched brand deals sent straight to your inbox. No cold emails, no middlemen — just direct campaign money.",           color: "text-emerald-400", glow: "rgba(52,211,153,0.2)" },
  { icon: TrendingUp,   title: "Revenue per Click",    desc: "Know exactly which post, DM, or campaign made you money. Real-time ROI tracking per social network.",                    color: "text-blue-400",    glow: "rgba(96,165,250,0.2)" },
  { icon: MessageSquare,title: "DM Conversations",     desc: "Your avatar handles thousands of DMs simultaneously — qualifying leads, answering questions, closing sales.",             color: "text-purple-400",  glow: "rgba(192,132,252,0.2)" },
  { icon: Sprout,       title: "Aura Farming",         desc: "Content intelligence that scans viral trends daily and tells you exactly what to post for maximum reach.",                color: "text-amber-400",   glow: "rgba(251,191,36,0.2)" },
  { icon: ShoppingBag,  title: "My Products",          desc: "Turn your knowledge into a product store. Your AI Avatar promotes and sells your digital products on autopilot.",         color: "text-pink-400",    glow: "rgba(244,114,182,0.2)" },
];

const TRUST_BADGES = [
  { icon: Shield, label: "Meta Trustified & Verified", sub: "Official platform partner" },
  { icon: Lock,   label: "World-Class Data Security",  sub: "End-to-end encryption"      },
  { icon: Globe,  label: "Available Worldwide",        sub: "50+ countries supported"     },
  { icon: Award,  label: "Built in India 🇮🇳",         sub: "For the world"               },
];

const DEMO_STEPS = [
  { step: "01", title: "Connect Your Accounts",     desc: "Link Instagram, YouTube, TikTok, X, or Facebook in seconds." },
  { step: "02", title: "Your Avatar Goes Live",     desc: "AI reads your past content, learns your tone, and starts responding in minutes." },
  { step: "03", title: "Watch the Revenue Roll In", desc: "Track every sale, DM conversion, and brand deal from your unified dashboard." },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [demoPhase, setDemoPhase] = useState<"idle" | "name" | "welcome">("idle");
  const [demoName, setDemoName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const count = useCounter(12_847);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setDemoName(nameInput.trim());
    setDemoPhase("welcome");
    setTimeout(() => {
      localStorage.setItem("cos_authed", "1");
      localStorage.setItem("cos_user_name", nameInput.trim());
      localStorage.setItem("cos_welcomed", "1");
      setLocation("/");
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Background Orbs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-orange-500/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[45%] right-[5%] w-[400px] h-[400px] rounded-full bg-orange-600/4 blur-[100px] animate-pulse delay-500" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(249,115,22,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.4) 1px,transparent 1px)", backgroundSize: "70px 70px" }} />
      </div>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}>
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">CreatorOS</span>
              <span className="ml-2 text-[9px] text-muted-foreground uppercase tracking-widest hidden sm:inline">Bharat Edition</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLocation("/login")}
              className="hidden sm:inline-flex px-4 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:bg-muted/50 transition-all">
              Sign In
            </button>
            <button onClick={() => setWaitlistOpen(true)}
              className="px-4 py-1.5 rounded-lg text-sm font-bold text-background transition-all hover:brightness-110 shadow-[0_0_16px_rgba(249,115,22,0.35)]"
              style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}>
              Join Waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-16 pb-20 px-4 text-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-xs text-orange-400 font-semibold mb-6">
            <Star className="h-3 w-3 fill-orange-400" />
            World's First Agentic AI Platform for Creators
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
            Your AI Clone.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              Your Revenue.
            </span>
            <br />Your Legacy. Proven.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            CreatorOS gives every creator, brand, and social media business a tireless AI avatar that converts
            comments into DMs, DMs into sales, and content into a full-time income — all on autopilot.
          </p>
          <p className="text-sm text-muted-foreground/70 mb-8">
            All-in-one for Instagram · YouTube · X · TikTok · Facebook
          </p>

          {/* Platform icons */}
          <div className="flex items-center justify-center gap-5 mb-10">
            {PLATFORMS.map(({ icon: Icon, name, color }) => (
              <div key={name} title={name}>
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color }} />
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button onClick={() => setWaitlistOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-background shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_44px_rgba(249,115,22,0.6)] hover:brightness-110 transition-all"
              style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}>
              Join Waitlist — It's Free <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => setDemoPhase("name")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all">
              <Play className="h-4 w-4" /> Try Free Demo
            </button>
          </div>

          {/* Animated creator count */}
          <div className="inline-flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <motion.span
                key={count}
                className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300"
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {count.toLocaleString("en-IN")}
              </motion.span>
              <span className="text-xl font-black text-muted-foreground">+</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              creators already joined the waitlist
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="relative z-10 py-10 px-4 border-y border-white/5 bg-card/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
            <FadeIn key={label} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20">
                <Icon className="h-5 w-5 text-orange-400" />
              </div>
              <p className="text-xs font-bold text-foreground leading-tight">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl font-black">One Dashboard. Infinite Power.</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
              Stop juggling 10 tools. CreatorOS is the only platform built from the ground up for how Indian creators actually work.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color, glow }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="h-full p-5 rounded-2xl border border-white/5 bg-card/60 backdrop-blur hover:border-white/10 transition-all group"
                  style={{ boxShadow: `0 0 0 0 ${glow}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 30px ${glow}`)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-white/5 ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">Hassle-Free Adoption</p>
            <h2 className="text-3xl sm:text-4xl font-black">Up & Running in Minutes.</h2>
            <p className="text-muted-foreground mt-3 text-sm">No technical skills needed. No long onboarding. Just connect and go.</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_STEPS.map(({ step, title, desc }, i) => (
              <FadeIn key={step} delay={i * 0.1} className="relative">
                <div className="p-6 rounded-2xl bg-card/50 border border-white/5 text-center">
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400/50 to-orange-400/10 mb-3">{step}</div>
                  <h3 className="font-bold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                {i < 2 && <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-orange-500/40 to-transparent" />}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAITLIST OFFER ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="rounded-3xl p-8 sm:p-12 text-center border border-orange-500/20 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(245,158,11,0.08))" }}>
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: "radial-gradient(circle at center, #f97316 0%, transparent 70%)" }} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold mb-5">
                  Limited Time Offer
                </div>
                <h2 className="text-3xl sm:text-4xl font-black mb-4">Join Now. Earn Free Access.</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Waitlist members unlock <span className="text-orange-400 font-bold">1 full week of ALL premium features</span> + <span className="text-amber-400 font-bold">1 month of AI avatar credits</span> — absolutely free. First come, first served.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                  {["1 Week ALL Features Free", "1 Month AI Credits", "Locked-in Beta Pricing"].map((perk) => (
                    <div key={perk} className="flex items-center gap-1.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      {perk}
                    </div>
                  ))}
                </div>
                <button onClick={() => setWaitlistOpen(true)}
                  className="px-8 py-3.5 rounded-xl font-bold text-background shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:brightness-110 transition-all inline-flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}>
                  Secure My Free Access <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-xs text-muted-foreground/60 mt-4">
                  No credit card required. Cancel anytime. Spots filling fast.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── INDIA FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-4 text-center">
        <FadeIn>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">🇮🇳</span>
            <div>
              <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Built in India, for the World
              </p>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">Jai Hind 🙏</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
            CreatorOS is proudly crafted in Bharat by a team that deeply understands the Indian creator economy — and is on a mission to put Indian creators on the global map.
          </p>
          <div className="mt-8 pt-6 border-t border-white/5 text-xs text-muted-foreground/50">
            © 2025 CreatorOS. All rights reserved. · Privacy Policy · Terms of Service
          </div>
        </FadeIn>
      </footer>

      {/* ── DEMO NAME MODAL ── */}
      <AnimatePresence>
        {(demoPhase === "name" || demoPhase === "welcome") && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              className="fixed inset-x-4 top-1/2 z-[61] -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-96"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <div className="rounded-2xl bg-card border border-white/8 overflow-hidden">
                <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#f97316,#f59e0b,#f97316)", backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />
                <div className="p-7 text-center">
                  <AnimatePresence mode="wait">
                    {demoPhase === "name" ? (
                      <motion.div key="name" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                          style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}>
                          <Bot className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-xl font-black mb-1">Before we begin…</h3>
                        <p className="text-sm text-muted-foreground mb-5">What should your AI Avatar call you?</p>
                        <form onSubmit={handleDemoSubmit} className="space-y-3">
                          <input
                            autoFocus
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Enter your first name"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-orange-400/50 transition-all text-center font-semibold"
                          />
                          <button type="submit" disabled={!nameInput.trim()}
                            className="w-full py-3 rounded-xl font-bold text-sm text-background disabled:opacity-50 transition-all hover:brightness-110"
                            style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}>
                            Enter Dashboard →
                          </button>
                        </form>
                        <button onClick={() => setDemoPhase("idle")} className="text-xs text-muted-foreground mt-3 hover:text-foreground transition-colors">
                          Cancel
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="welcome" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="text-5xl mb-4">🙏</div>
                        <h3 className="text-2xl font-black mb-2">
                          Welcome &amp; Namaste,<br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                            {demoName}!
                          </span>
                        </h3>
                        <p className="text-sm text-muted-foreground">Entering CreatorOS…</p>
                        <div className="mt-4 flex justify-center gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div key={i} className="w-2 h-2 rounded-full bg-orange-400"
                              animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.2 }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
