import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lightbulb, Tag, Flame } from "lucide-react";

const TOP_CONTENT_TOPICS = [
  { rank: 1, topic: "Budget outfit hauls under ₹1000", asks: 847, trend: "+34%", emoji: "👗" },
  { rank: 2, topic: "Honest skincare routine (before/after)", asks: 712, trend: "+28%", emoji: "✨" },
  { rank: 3, topic: "Day in the life of a creator", asks: 654, trend: "+19%", emoji: "🎬" },
  { rank: 4, topic: "Top 5 streetwear brands in India", asks: 521, trend: "+22%", emoji: "🧥" },
  { rank: 5, topic: "How I monetize my Instagram reels", asks: 488, trend: "+41%", emoji: "💸" },
];

const TOP_BRAND_CATEGORIES = [
  { rank: 1, category: "Fashion & Streetwear", brands: ["Bewakoof", "The Souled Store", "Snitch"], fit: 96, color: "from-orange-500 to-amber-400", emoji: "👕" },
  { rank: 2, category: "Skincare & Wellness", brands: ["Mamaearth", "MCaffeine", "Plum"], fit: 88, color: "from-pink-500 to-rose-400", emoji: "🌿" },
  { rank: 3, category: "Tech & Wearables", brands: ["Noise", "boAt", "Fire-Boltt"], fit: 79, color: "from-blue-500 to-cyan-400", emoji: "⌚" },
];

const OUT_OF_THE_BOX_TOPICS = [
  {
    topic: "Teach your audience how to negotiate salary in Hinglish",
    insight: "Finance content in casual Hinglish is a gap no creator your size is filling — massive SEO and share potential.",
    emoji: "🤝",
    label: "Untapped",
    color: "border-purple-500/30 bg-purple-500/5",
    labelColor: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  },
  {
    topic: "Behind-the-scenes: How brand deals actually work in India",
    insight: "Creators who demystify the industry become authorities. Your audience asks about it — no one's answered it well yet.",
    emoji: "🎭",
    label: "Viral Potential",
    color: "border-amber-500/30 bg-amber-500/5",
    labelColor: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  },
  {
    topic: "AI tools that help small creators compete with big studios",
    insight: "AI + creator angle is hyper-relevant now. Pair it with Hinglish explainer format and you own a niche no competitor is in.",
    emoji: "🤖",
    label: "Future-Forward",
    color: "border-cyan-500/30 bg-cyan-500/5",
    labelColor: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  },
];

function BarRow({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  return (
    <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ delay, duration: 0.7, ease: "easeOut" }}
      />
    </div>
  );
}

export default function AuraFarming() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <motion.h1
          className="text-3xl font-black tracking-tight flex items-center gap-2.5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Aura Farming 🌾
        </motion.h1>
        <p className="text-muted-foreground mt-1.5 text-sm max-w-2xl">
          AI-powered content intelligence — built for your next growth phase. Analyse what your audience craves, which brands to pitch, and what topics will make you stand out.
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1">
          <Sparkles className="h-3 w-3" />
          Future content suggestions engine — learning from your comment patterns
        </div>
      </div>

      {/* Top 5 Content Topics */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          <h2 className="text-base font-bold">Top 5 Topics Your Audience Wants Content On</h2>
          <div className="flex-1 h-px bg-border/40" />
        </div>
        <p className="text-xs text-muted-foreground -mt-2">Extracted from 14,200+ comments across your last 60 days of posts.</p>
        <div className="space-y-3">
          {TOP_CONTENT_TOPICS.map((item, i) => (
            <motion.div
              key={item.rank}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-border/80 transition-colors"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="text-2xl w-8 text-center">{item.emoji}</div>
              <div className="w-6 text-lg font-black text-muted-foreground/40">#{item.rank}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{item.topic}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <BarRow pct={(item.asks / 847) * 100} color="from-orange-500 to-amber-400" delay={0.1 + i * 0.07} />
                  <span className="text-xs text-muted-foreground shrink-0">{item.asks.toLocaleString()} asks</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 shrink-0">{item.trend}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top 3 Brand Categories */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Tag className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold">Top 3 Brand Categories You Should Pitch</h2>
          <div className="flex-1 h-px bg-border/40" />
        </div>
        <p className="text-xs text-muted-foreground -mt-2">Based on your audience demographics, engagement type, and past collab performance.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TOP_BRAND_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.rank}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-xs font-black text-muted-foreground/40">#{cat.rank}</span>
                  </div>
                  <CardTitle className="text-sm font-bold leading-tight mt-1">{cat.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Audience Fit</span>
                      <span className="font-bold text-foreground">{cat.fit}%</span>
                    </div>
                    <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.fit}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.brands.map((b) => (
                      <Badge key={b} variant="outline" className="text-[10px] border-border/60 text-muted-foreground">{b}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Out-of-the-Box Topics */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Flame className="h-5 w-5 text-orange-400" />
          <h2 className="text-base font-bold">Top 3 Out-of-the-Box Content Angles</h2>
          <div className="flex-1 h-px bg-border/40" />
        </div>
        <p className="text-xs text-muted-foreground -mt-2">Unexpected topics your audience has asked about that no creator in your space is covering yet.</p>
        <div className="space-y-4">
          {OUT_OF_THE_BOX_TOPICS.map((item, i) => (
            <motion.div
              key={item.topic}
              className={`p-5 rounded-xl border ${item.color}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl mt-0.5">{item.emoji}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold leading-snug">{item.topic}</p>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${item.labelColor}`}>{item.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.insight}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
