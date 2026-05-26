import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";
import { FaInstagram, FaYoutube, FaXTwitter, FaTiktok } from "react-icons/fa6";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export function WaitlistButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-background shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_32px_rgba(249,115,22,0.7)] transition-shadow"
        style={{ background: "linear-gradient(135deg,#f97316 0%,#f59e0b 100%)" }}
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

interface FormState {
  email: string;
  instagram: string;
  youtube: string;
  x: string;
  tiktok: string;
  additionalNote: string;
}

export function WaitlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormState>({ email: "", instagram: "", youtube: "", x: "", tiktok: "", additionalNote: "" });
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [showOptional, setShowOptional] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const email = form.email.trim();
    if (!email) { setError("Email is required."); return; }
    if (!EMAIL_REGEX.test(email)) { setError("Please enter a valid email address (e.g. you@example.com)."); return; }

    setPhase("loading");
    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          instagram: form.instagram.trim() || undefined,
          youtube: form.youtube.trim() || undefined,
          x: form.x.trim() || undefined,
          tiktok: form.tiktok.trim() || undefined,
          additionalNote: form.additionalNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setPhase("idle");
        return;
      }
      setPhase("done");
    } catch {
      setError("Network error. Please try again.");
      setPhase("idle");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPhase("idle");
      setForm({ email: "", instagram: "", youtube: "", x: "", tiktok: "", additionalNote: "" });
      setError("");
      setShowOptional(false);
    }, 400);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} />
          <motion.div
            className="fixed z-[61] inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:w-[440px] md:-translate-x-1/2 md:-translate-y-1/2"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#f97316,#f59e0b,#f97316)" }} />
              <div className="p-6">
                <button onClick={handleClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <X className="h-4 w-4" />
                </button>

                <AnimatePresence mode="wait">
                  {phase !== "done" ? (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-orange-500/15">
                          <Sparkles className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <h2 className="text-lg font-black leading-tight">Join the Waitlist</h2>
                          <p className="text-xs text-muted-foreground">Early access + exclusive beta features</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-4 text-xs text-muted-foreground">
                        {["1 week of ALL premium features FREE", "1 month of AI avatar credits", "Locked-in early adopter pricing"].map((perk) => (
                          <div key={perk} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            {perk}
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Email — required */}
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                            Email Address <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.email}
                            onChange={set("email")}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-orange-400/50 focus:ring-1 focus:ring-orange-400/20 transition-all"
                          />
                          {error && (
                            <p className="text-xs text-red-400 mt-1.5 flex items-start gap-1">
                              <span className="mt-px">⚠</span>{error}
                            </p>
                          )}
                        </div>

                        {/* Optional social handles */}
                        <button
                          type="button"
                          onClick={() => setShowOptional((v) => !v)}
                          className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors font-semibold"
                        >
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showOptional ? "rotate-180" : ""}`} />
                          {showOptional ? "Hide" : "Add"} social handles (optional)
                        </button>

                        <AnimatePresence>
                          {showOptional && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden space-y-2.5"
                            >
                              {[
                                { key: "instagram" as const, icon: FaInstagram, placeholder: "@yourhandle", label: "Instagram", color: "#E1306C" },
                                { key: "youtube" as const, icon: FaYoutube, placeholder: "@yourchannel", label: "YouTube", color: "#FF0000" },
                                { key: "x" as const, icon: FaXTwitter, placeholder: "@yourhandle", label: "X (Twitter)", color: "#ffffff" },
                                { key: "tiktok" as const, icon: FaTiktok, placeholder: "@yourhandle", label: "TikTok", color: "#69C9D0" },
                              ].map(({ key, icon: Icon, placeholder, label, color }) => (
                                <div key={key} className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 shrink-0">
                                    <Icon className="h-4 w-4" style={{ color }} />
                                  </div>
                                  <input
                                    value={form[key]}
                                    onChange={set(key)}
                                    placeholder={placeholder}
                                    className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-orange-400/40 transition-all"
                                  />
                                </div>
                              ))}
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Anything else you'd like us to know?</label>
                                <textarea
                                  value={form.additionalNote}
                                  onChange={set("additionalNote")}
                                  rows={2}
                                  placeholder="e.g. I run a fitness brand, 50k followers on Instagram..."
                                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-orange-400/40 resize-none transition-all"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <button
                          type="submit"
                          disabled={phase === "loading"}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-background disabled:opacity-70 hover:brightness-110 transition-all active:scale-[0.98]"
                          style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}
                        >
                          {phase === "loading"
                            ? <div className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                            : <><ArrowRight className="h-4 w-4" /> Secure My Free Access</>
                          }
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 mb-4">
                        <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-black mb-1">You're on the list! 🎉</h3>
                      <p className="text-sm text-muted-foreground mb-5">
                        We'll email <span className="text-orange-400 font-medium">{form.email}</span> when your early access is ready.
                      </p>
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
