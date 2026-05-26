import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";

const FAQ = [
  {
    keywords: ["what", "creatoros", "about", "is"],
    answer: "CreatorOS is the world's first agentic AI-driven platform built for creators, brands, and social media businesses. Your AI avatar works 24/7 — converting comments into DMs, closing sales, and growing your brand while you sleep! 🚀",
  },
  {
    keywords: ["avatar", "how", "work", "ai", "digital"],
    answer: "Your Hinglish AI Avatar reads public comments on your posts, replies in your exact tone and style, and converts interested followers into paying customers via DMs — 100% automated. It learns your vibe and keeps improving! 🤖",
  },
  {
    keywords: ["safe", "security", "data", "privacy", "secure", "trust"],
    answer: "CreatorOS is Meta Trustified & Verified with world-class data security. Your data is end-to-end encrypted, never sold to third parties, and always under your full control. We take privacy as seriously as you take your content! 🔒",
  },
  {
    keywords: ["platform", "social", "instagram", "youtube", "tiktok", "facebook", "twitter", "x", "network"],
    answer: "CreatorOS works across ALL major platforms — Instagram, YouTube, X (Twitter), TikTok, and Facebook. One dashboard to rule them all! 📱",
  },
  {
    keywords: ["cost", "price", "free", "paid", "plan", "money", "rupee", "inr"],
    answer: "Join our waitlist to get 1 week of ALL features FREE plus 1 month of credits — worth thousands of rupees! Early adopters also get exclusive pricing that will never be available again. Hit 'Join Waitlist' now! 💰",
  },
  {
    keywords: ["start", "begin", "signup", "register", "join", "how", "get"],
    answer: "Super easy! 1) Click 'Join Waitlist' to lock in your early access 2) Connect your social accounts 3) Your AI Avatar goes live in minutes. No technical skills needed! 🎯",
  },
  {
    keywords: ["aura", "farming", "content", "trend", "viral"],
    answer: "Aura Farming 🌾 is our content intelligence engine — it scans trending topics, viral hooks, and audience sentiment daily and tells you exactly what to post for maximum reach and engagement!",
  },
  {
    keywords: ["brand", "deal", "collab", "sponsor", "partnership"],
    answer: "The Brand Collabs module connects you with verified brands looking for creators like YOU. Our AI matches your audience profile to brand campaigns — no cold emails, no middlemen, just direct deal flow! 🤝",
  },
  {
    keywords: ["revenue", "earn", "income", "sale", "click", "track"],
    answer: "Revenue per Click shows you exactly which posts, DMs, and campaigns are making you money. Track every rupee with our Data Foot Print analytics — know your ROI before your CA does! 📊",
  },
  {
    keywords: ["india", "indian", "bharat", "hinglish", "desi"],
    answer: "CreatorOS is proudly Built in India 🇮🇳 for the World! We deeply understand Indian creators — that's why our AI speaks fluent Hinglish, understands desi humour, and is optimised for Indian social media culture! Jai Hind! 🙏",
  },
  {
    keywords: ["demo", "try", "test", "preview"],
    answer: "Click 'Try Free Demo' on our landing page to see the full CreatorOS dashboard instantly — no signup needed. See your AI Avatar, revenue tracking, brand deals, and more live! ✨",
  },
  {
    keywords: ["beta", "access", "early", "waitlist", "offer"],
    answer: "Waitlist members get: ✅ 1 week of ALL premium features FREE ✅ 1 month of AI credits ✅ Exclusive beta pricing locked in forever. Limited spots — join now before it fills up!",
  },
];

const SUGGESTED = [
  "How does the AI Avatar work?",
  "Which platforms are supported?",
  "Is my data safe?",
  "What's the waitlist offer?",
];

interface Message {
  from: "user" | "bot";
  text: string;
}

function findAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const faq of FAQ) {
    if (faq.keywords.some((k) => lower.includes(k))) return faq.answer;
  }
  return "Great question! CreatorOS is packed with features — from AI Avatars and Brand Collabs to Revenue Tracking and Aura Farming. Hit 'Join Waitlist' to get early access, or try our live demo to see everything in action! 🌟";
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Namaste! 🙏 I'm your CreatorOS AI guide. Ask me anything about how we're going to change your creator life! Or pick a question below 👇" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text: findAnswer(text) }]);
    }, 900);
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-50 flex items-center gap-2 w-13 h-13 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-shadow"
        style={{ background: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)", width: 52, height: 52, justifyContent: "center" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="h-5 w-5 text-white" /></motion.div>
            : <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Bot className="h-5 w-5 text-white" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-20 left-4 md:bottom-24 md:left-6 z-50 w-[calc(100vw-2rem)] md:w-80 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{ maxHeight: 420, background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,14%)" }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5"
              style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(245,158,11,0.1))" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f97316, #f59e0b)" }}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">CreatorOS AI Guide</p>
                <p className="text-xs text-muted-foreground">Always here to help 🙏</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: 240 }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`text-xs rounded-xl px-3 py-2 max-w-[85%] leading-relaxed ${
                      m.from === "user"
                        ? "text-white rounded-br-sm"
                        : "text-foreground rounded-bl-sm bg-white/5 border border-white/8"
                    }`}
                    style={m.from === "user" ? { background: "linear-gradient(135deg, #f97316, #f59e0b)" } : {}}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/8 rounded-xl rounded-bl-sm px-3 py-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400"
                          animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Suggested */}
            {messages.length < 3 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-orange-500/25 text-orange-400 hover:bg-orange-500/10 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 pt-0 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-orange-400/40 transition-all"
              />
              <button type="submit" disabled={!input.trim()}
                className="p-2 rounded-xl text-white disabled:opacity-40 transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #f97316, #f59e0b)" }}>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
