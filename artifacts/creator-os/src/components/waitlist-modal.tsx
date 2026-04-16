import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export function WaitlistButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Floating pill button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-background shadow-[0_0_24px_rgba(45,212,191,0.5)] hover:shadow-[0_0_36px_rgba(45,212,191,0.7)] transition-shadow"
        style={{ background: "linear-gradient(135deg, #2dd4bf 0%, #a78bfa 100%)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        Join Waitlist
      </motion.button>

      <WaitlistModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function WaitlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setPhase("loading");
    setTimeout(() => setPhase("done"), 1400);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setPhase("idle"); setEmail(""); setError(""); }, 400);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-[61] inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:w-[420px]"
            style={{ ["--tw-translate-x" as string]: "-50%", ["--tw-translate-y" as string]: "-50%" }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, translateX: "0%", translateY: "0%" }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {/* Aurora border glow */}
            <div className="absolute -inset-px rounded-2xl pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.4), rgba(167,139,250,0.4), rgba(34,211,238,0.3))", borderRadius: "1rem", zIndex: -1 }} />

            <div className="relative rounded-2xl bg-[hsl(240,35%,5%)] border border-white/5 overflow-hidden">
              {/* Aurora shimmer top */}
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #2dd4bf, #a78bfa, #22d3ee, #2dd4bf)", backgroundSize: "200% 100%", animation: "aurora-drift-1 4s linear infinite" }} />

              <div className="p-6">
                <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                  <X className="h-4 w-4" />
                </button>

                <AnimatePresence mode="wait">
                  {phase !== "done" ? (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.2), rgba(167,139,250,0.2))" }}>
                          <Sparkles className="h-5 w-5 text-teal-300" />
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-foreground leading-tight">Join the Waitlist</h2>
                          <p className="text-xs text-muted-foreground">Get early access + exclusive beta features</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-5 text-xs text-muted-foreground">
                        {["Priority access to new AI Avatar features", "Exclusive Hinglish slang packs before launch", "First look at brand deal matching engine"].map((perk) => (
                          <div key={perk} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-teal-400 shrink-0" />
                            {perk}
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30 transition-all"
                          />
                          {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
                        </div>
                        <button
                          type="submit"
                          disabled={phase === "loading"}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-background transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
                          style={{ background: "linear-gradient(135deg, #2dd4bf 0%, #a78bfa 100%)" }}
                        >
                          {phase === "loading" ? (
                            <div className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                          ) : (
                            <><ArrowRight className="h-4 w-4" /> Secure My Spot</>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                        style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.2), rgba(167,139,250,0.2))" }}>
                        <CheckCircle2 className="h-7 w-7 text-teal-300" />
                      </div>
                      <h3 className="text-lg font-black mb-1">You're on the list! 🎉</h3>
                      <p className="text-sm text-muted-foreground mb-5">We'll email <span className="text-teal-300 font-medium">{email}</span> when your early access is ready.</p>
                      <button onClick={handleClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Close</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
