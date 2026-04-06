import { useState, useRef, useEffect } from "react";
import { useGetCreatorProfile, useUpdateCreatorProfile, getGetCreatorProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Send, Sparkles, MessageSquareQuote, Mic, MicOff, Zap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 3D Animated Avatar Component
function Avatar3D({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      {/* Glow rings */}
      {active && (
        <>
          <motion.div
            className="absolute rounded-full border border-orange-400/20"
            style={{ width: 160, height: 160 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full border border-orange-400/10"
            style={{ width: 140, height: 140 }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </>
      )}

      {/* Main avatar orb */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: 120,
          height: 120,
          background: active
            ? "radial-gradient(ellipse at 35% 30%, #fb923c 0%, #ea580c 50%, #9a3412 100%)"
            : "radial-gradient(ellipse at 35% 30%, #525252 0%, #262626 60%, #171717 100%)",
          boxShadow: active
            ? "0 0 40px rgba(249,115,22,0.5), inset 0 2px 8px rgba(255,255,255,0.2), inset -4px -4px 12px rgba(0,0,0,0.4)"
            : "0 0 15px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,255,255,0.05), inset -4px -4px 12px rgba(0,0,0,0.5)",
        }}
        animate={active ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Face highlight — simulates 3D sphere */}
        <div
          className="absolute rounded-full"
          style={{
            width: 50,
            height: 40,
            top: 14,
            left: 18,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Eyes */}
        <div className="absolute flex gap-3" style={{ top: 38, left: 30 }}>
          <motion.div
            className="rounded-full"
            style={{ width: 10, height: 10, background: active ? "#fff" : "#737373" }}
            animate={active ? { scaleY: [1, 0.1, 1] } : {}}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
          />
          <motion.div
            className="rounded-full"
            style={{ width: 10, height: 10, background: active ? "#fff" : "#737373" }}
            animate={active ? { scaleY: [1, 0.1, 1] } : {}}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
          />
        </div>

        {/* Mouth */}
        <motion.div
          className="absolute rounded-full overflow-hidden"
          style={{ width: 26, height: 12, bottom: 28, left: 47, background: "rgba(0,0,0,0.6)", borderRadius: "0 0 13px 13px" }}
          animate={active ? { scaleX: [1, 1.2, 1], scaleY: [1, 0.8, 1] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Sound wave lines when active */}
        {active && (
          <div className="absolute flex items-center gap-0.5" style={{ bottom: -16, left: "50%", transform: "translateX(-50%)" }}>
            {[4, 8, 6, 10, 7, 5, 9].map((h, i) => (
              <motion.div
                key={i}
                className="rounded-full bg-orange-400"
                style={{ width: 2, height: h }}
                animate={{ scaleY: [1, 2, 0.5, 1.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Status dot */}
      <div
        className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-background ${active ? "bg-emerald-400" : "bg-zinc-600"}`}
        style={{ boxShadow: active ? "0 0 8px rgba(52,211,153,0.8)" : "none" }}
      />
    </div>
  );
}

// Auto Vibe Sync Panel
function AutoVibeSyncPanel({ onExtracted }: {
  onExtracted: (data: { conversational: string; operational: string; relational: string; ethos: string; slang: string }) => void
}) {
  const [phase, setPhase] = useState<"idle" | "recording" | "processing" | "done">("idle");
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  const startRecording = () => {
    setPhase("recording");
    setSeconds(0);
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s >= 59) {
          stopRecording();
          return 60;
        }
        return s + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("processing");
    // Simulate Sarvam AI transcription + extraction delay
    setTimeout(() => {
      setPhase("done");
      onExtracted({
        conversational: "Ekdum natural baat karta hoon, jaise dost hoon tere. 'Bhai kya chal raha hai?' se start karta hoon, pehle vibe check hoti hai phir baat.",
        operational: "Product ke features seedha bolunga — price, size, delivery sab clear. Koi extra drama nahi, facts mein baat karta hoon.",
        relational: "Pehle sunuunga, phir suggest karunga. Agar koi doubt hai toh handle karunga honestly. Trust pehle, sale baad mein.",
        ethos: "Sirf wahi recommend karta hoon jo maine khud use kiya ho. Audience ko kabhi cheat nahi karunga. Brand deal hote hain but honesty kabhie compromise nahi.",
        slang: "bhai, scene set hai, mast lag raha hai, ekdum sahi, yaar sun, kya baat hai, chill maar",
      });
      toast({ title: "Auto-Vibe Sync Complete", description: "Your C.O.R.E. profile has been extracted from your voice." });
    }, 3500);
  };

  const reset = () => {
    setPhase("idle");
    setSeconds(0);
  };

  return (
    <Card className="bg-gradient-to-br from-orange-950/40 to-card border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.08)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-300">
          <Zap className="h-4 w-4" />
          Auto-Vibe Sync
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Talk naturally for 60 seconds. The AI extracts your slang, tone & ethos — no typing needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-xs text-muted-foreground mb-4">
                Prompt: <span className="italic text-foreground/70">"Tell me what you sell, how you treat your fans, and what your brand stands for. Speak naturally in Hinglish."</span>
              </p>
              <Button
                onClick={startRecording}
                className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Mic className="h-4 w-4" /> Start Recording (60s)
              </Button>
            </motion.div>
          )}

          {phase === "recording" && (
            <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Recording...</span>
                <span className="text-sm font-mono font-bold text-orange-400">{60 - seconds}s left</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <motion.div
                  className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                  style={{ width: `${(seconds / 60) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-center gap-1 py-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-orange-400"
                    animate={{ height: [4, Math.random() * 20 + 6, 4] }}
                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.04 }}
                  />
                ))}
              </div>
              <Button variant="outline" onClick={stopRecording} className="w-full gap-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                <MicOff className="h-4 w-4" /> Stop & Analyse
              </Button>
            </motion.div>
          )}

          {phase === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4 space-y-3">
              {["Transcribing with Sarvam AI...", "Detecting Hinglish slang...", "Extracting personality vectors...", "Populating C.O.R.E. framework..."].map((step, i) => (
                <motion.div
                  key={step}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.7 }}
                >
                  <motion.div
                    className="w-3 h-3 rounded-full border-2 border-orange-400 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  {step}
                </motion.div>
              ))}
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                C.O.R.E. profile extracted
              </div>
              <p className="text-xs text-muted-foreground">Your personality, slang, and ethos have been auto-filled from your voice recording.</p>
              <Button variant="outline" onClick={reset} className="w-full text-xs border-border/50">
                Record Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default function AvatarPage() {
  const { data: profile, isLoading } = useGetCreatorProfile();
  const updateProfile = useUpdateCreatorProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [localProfile, setLocalProfile] = useState<any>(null);

  if (profile && !localProfile) {
    setLocalProfile(profile);
  }

  const handleSave = () => {
    if (!localProfile) return;
    updateProfile.mutate(
      {
        data: {
          avatarEnabled: localProfile.avatarEnabled,
          coreVibeConversational: localProfile.coreVibeConversational,
          coreVibeOperational: localProfile.coreVibeOperational,
          coreVibeRelational: localProfile.coreVibeRelational,
          coreVibeEthos: localProfile.coreVibeEthos,
          signatureSlang: localProfile.signatureSlang,
        },
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(getGetCreatorProfileQueryKey(), data);
          toast({ title: "Avatar Updated", description: "Your AI clone's brain has been synced." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to update avatar settings.", variant: "destructive" });
        },
      }
    );
  };

  const handleAutoExtracted = (data: { conversational: string; operational: string; relational: string; ethos: string; slang: string }) => {
    setLocalProfile((p: any) => ({
      ...p,
      coreVibeConversational: data.conversational,
      coreVibeOperational: data.operational,
      coreVibeRelational: data.relational,
      coreVibeEthos: data.ethos,
      signatureSlang: data.slang,
    }));
  };

  if (isLoading) return <div className="animate-pulse p-8 text-muted-foreground">Loading avatar...</div>;
  if (!localProfile) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avatar</h1>
          <p className="text-muted-foreground mt-1 text-sm">Configure your AI digital clone's personality, slang, and sales approach.</p>
        </div>
        <div className="flex items-center gap-4 bg-card/50 p-3 rounded-lg border border-border">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Avatar Status</span>
            <span className="text-xs text-muted-foreground">{localProfile.avatarEnabled ? "Active & Engaging" : "Offline"}</span>
          </div>
          <Switch checked={localProfile.avatarEnabled} onCheckedChange={(checked) => setLocalProfile({ ...localProfile, avatarEnabled: checked })} />
          <Button onClick={handleSave} disabled={updateProfile.isPending} className="ml-2">
            {updateProfile.isPending ? "Syncing..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: forms */}
        <div className="lg:col-span-2 space-y-5">
          {/* Slang */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Signature Slang
              </CardTitle>
              <CardDescription className="text-xs">Comma-separated Hinglish words your avatar uses naturally.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={localProfile.signatureSlang || ""}
                onChange={(e) => setLocalProfile({ ...localProfile, signatureSlang: e.target.value })}
                placeholder="e.g. bhai, scene set hai, chill maar, kya bolti public"
                className="bg-background/50"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(
              [
                { key: "coreVibeConversational", label: "Conversational", desc: "How the avatar greets and opens." },
                { key: "coreVibeOperational", label: "Operational", desc: "Sales approach and product knowledge." },
                { key: "coreVibeRelational", label: "Relational", desc: "How it builds trust and handles objections." },
                { key: "coreVibeEthos", label: "Ethos", desc: "Boundaries and values upheld." },
              ] as const
            ).map((field) => (
              <Card key={field.key} className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">{field.label}</CardTitle>
                  <CardDescription className="text-xs">{field.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={localProfile[field.key] || ""}
                    onChange={(e) => setLocalProfile({ ...localProfile, [field.key]: e.target.value })}
                    className="min-h-[100px] bg-background/50 text-sm"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: 3D avatar + sync + preview */}
        <div className="space-y-5">
          {/* 3D Avatar display */}
          <Card className="bg-card/60 border-border/40 text-center">
            <CardContent className="pt-6 pb-5 flex flex-col items-center gap-3">
              <Avatar3D active={localProfile.avatarEnabled} />
              <div>
                <p className="font-semibold text-sm">{localProfile.name}</p>
                <p className="text-xs text-muted-foreground">{localProfile.handle} · {localProfile.platform}</p>
                <span
                  className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                    localProfile.avatarEnabled
                      ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                      : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                  }`}
                >
                  {localProfile.avatarEnabled ? "Live" : "Offline"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Vibe Sync */}
          <AutoVibeSyncPanel onExtracted={handleAutoExtracted} />

          {/* Chat preview */}
          <Card className="bg-card border-primary/20 shadow-[0_0_15px_rgba(249,115,22,0.08)]">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
              <CardTitle className="text-xs font-medium flex items-center justify-between">
                <span className="flex items-center gap-2"><MessageSquareQuote className="h-3.5 w-3.5" /> Live Preview</span>
                <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">Simulation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col h-[280px]">
                <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-black/40">
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%] text-xs">
                      Bhai ye hoodie ka link share kar!
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%] text-xs">
                      Bhai check DM kar! Scene set hai ekdum — saari details wahan bhej di.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%] text-xs">
                      Price thoda zyada nahi hai kya yaar?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%] text-xs">
                      Dekh bhai, quality mein compromise nahi hai. Mast cheez hai aur tere liye special 10% off ka link bhej raha hoon — sirf aaj ke liye.
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-border/50 bg-muted/10 flex items-center gap-2">
                  <Input placeholder="Test avatar..." className="h-7 bg-background/50 border-border/50 text-xs" disabled />
                  <Button size="icon" className="h-7 w-7 shrink-0" disabled><Send className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
