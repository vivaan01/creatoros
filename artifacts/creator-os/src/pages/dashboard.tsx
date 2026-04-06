import {
  useGetDashboardSummary,
  useGetRevenueTrend,
  useGetFunnelStats,
  useGetTopProducts,
  useGetCreatorProfile,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { IndianRupee, TrendingUp, MessageSquare, ShoppingCart, Percent, Star, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const formatINRCompact = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
  return `₹${value}`;
};

const StatCard = ({
  title, value, sub, icon: Icon, highlight, delay,
}: {
  title: string; value: string; sub: string; icon: React.ElementType; highlight?: boolean; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay ?? 0, duration: 0.4 }}
  >
    <Card
      className={`relative overflow-hidden border ${
        highlight ? "border-primary/30 bg-gradient-to-br from-orange-950/60 to-card shadow-[0_0_20px_rgba(249,115,22,0.12)]" : "bg-card/50 border-border/50"
      }`}
    >
      {highlight && (
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        <div className={`p-1.5 rounded-md ${highlight ? "bg-primary/15" : "bg-muted/60"}`}>
          <Icon className={`h-3.5 w-3.5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-black tracking-tight ${highlight ? "text-primary" : "text-foreground"}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  </motion.div>
);

// Funnel step component
const FunnelStep = ({ label, count, pct, color, delay }: { label: string; count: number; pct: number; color: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0.6 }}
    animate={{ opacity: 1, scaleX: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-3"
  >
    <div className="w-20 text-right text-xs text-muted-foreground shrink-0">{label}</div>
    <div className="flex-1 h-6 bg-muted/30 rounded overflow-hidden relative">
      <motion.div
        className="h-full rounded flex items-center px-2"
        style={{ background: color, width: `${pct}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ delay: delay + 0.1, duration: 0.7, ease: "easeOut" }}
      />
    </div>
    <div className="w-14 text-xs font-semibold text-right text-foreground shrink-0">{count.toLocaleString()}</div>
  </motion.div>
);

export default function Dashboard() {
  const { data: summary, isLoading: sl } = useGetDashboardSummary();
  const { data: trend, isLoading: tl } = useGetRevenueTrend();
  const { data: funnel, isLoading: fl } = useGetFunnelStats();
  const { data: topProducts, isLoading: pl } = useGetTopProducts();
  const { data: profile, isLoading: pfl } = useGetCreatorProfile();

  if (sl || tl || fl || pl || pfl) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-xl" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-72 bg-muted rounded-xl" />
          <div className="h-72 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  // Build aggregate funnel across all campaigns
  const aggFunnel = funnel && funnel.length > 0
    ? funnel.reduce((acc, c) => ({
        comments: acc.comments + c.comments,
        dms: acc.dms + c.dmsInitiated,
        clicks: acc.clicks + c.linksClicked,
        purchases: acc.purchases + c.purchases,
      }), { comments: 0, dms: 0, clicks: 0, purchases: 0 })
    : null;

  // Format trend data dates to short form
  const trendFormatted = (trend ?? []).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <motion.h1
            className="text-3xl font-black tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            The Face Value
          </motion.h1>
          <p className="text-muted-foreground mt-1 text-sm">Your avatar's real-time performance — numbers brands actually care about.</p>
        </div>
        {profile && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold">{profile.name}</p>
              <p className="text-xs text-muted-foreground">@{profile.handle} · {profile.platform}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center font-black text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]">
              {profile.name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      {/* Stat cards */}
      {summary && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatINRCompact(summary.totalRevenue)}
            sub={`${summary.revenueGrowthPct >= 0 ? "+" : ""}${summary.revenueGrowthPct.toFixed(1)}% from last month`}
            icon={IndianRupee}
            highlight
            delay={0}
          />
          <StatCard title="DMs Handled" value={summary.totalDmsHandled.toLocaleString()} sub="By AI Avatar" icon={MessageSquare} delay={0.08} />
          <StatCard title="Total Conversions" value={summary.totalConversions.toLocaleString()} sub="Purchases via links" icon={ShoppingCart} delay={0.16} />
          <StatCard title="Avg Conv. Rate" value={`${summary.avgConversionRate.toFixed(1)}%`} sub="Across active campaigns" icon={Percent} delay={0.24} />
        </div>
      )}

      {/* Second row stat cards */}
      {summary && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard title="This Month Revenue" value={formatINRCompact(summary.revenueThisMonth)} sub="Current period" icon={TrendingUp} delay={0.1} />
          <StatCard title="This Month Sales" value={summary.conversionsThisMonth.toLocaleString()} sub="Purchases confirmed" icon={Star} delay={0.14} />
          <StatCard title="Active Campaigns" value={String(summary.activeCampaigns)} sub="Running right now" icon={Megaphone} delay={0.18} />
          <StatCard title="Brands Worked With" value={String(summary.totalBrands)} sub="Verified partnerships" icon={Star} delay={0.22} />
        </div>
      )}

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Revenue chart — wider */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/50 border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Revenue Trend — Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-[260px] w-full">
                {trendFormatted.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendFormatted} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="label" stroke="#666" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                      <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatINRCompact} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#333", color: "#fff", fontSize: 12 }}
                        formatter={(v: number) => [formatINR(v), "Revenue"]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top products */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          <Card className="bg-card/50 border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top Converting Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(topProducts ?? []).map((product, i) => {
                  const maxRevenue = Math.max(...(topProducts ?? []).map((p) => p.totalRevenue));
                  const pct = maxRevenue > 0 ? (product.totalRevenue / maxRevenue) * 100 : 0;
                  return (
                    <motion.div
                      key={product.productId}
                      className="space-y-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.38 + i * 0.07 }}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium truncate max-w-[140px]">{product.name}</span>
                        <span className="text-primary font-semibold ml-2">{formatINRCompact(product.totalRevenue)}</span>
                      </div>
                      <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5 + i * 0.07, duration: 0.6 }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">{product.category} · {product.totalSales} sales</p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sales Funnel visualization */}
      {aggFunnel && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Sales Funnel — All Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-w-lg">
                <FunnelStep label="Comments" count={aggFunnel.comments} pct={100} color="rgba(249,115,22,0.6)" delay={0.46} />
                <FunnelStep label="DMs Sent" count={aggFunnel.dms} pct={Math.round((aggFunnel.dms / aggFunnel.comments) * 100)} color="rgba(249,115,22,0.7)" delay={0.52} />
                <FunnelStep label="Link Clicks" count={aggFunnel.clicks} pct={Math.round((aggFunnel.clicks / aggFunnel.comments) * 100)} color="rgba(249,115,22,0.85)" delay={0.58} />
                <FunnelStep label="Purchases" count={aggFunnel.purchases} pct={Math.round((aggFunnel.purchases / aggFunnel.comments) * 100)} color="rgba(249,115,22,1)" delay={0.64} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* AI-Powered Insights */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <Card className="bg-gradient-to-br from-zinc-950/80 via-card to-orange-950/20 border border-orange-500/15 shadow-[0_0_30px_rgba(249,115,22,0.07)]">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <span className="text-base">🧠</span>
                AI-POWERED INSIGHTS
              </CardTitle>
              <span className="text-[10px] uppercase tracking-widest text-orange-400/70 font-semibold bg-orange-400/8 border border-orange-400/15 px-2 py-0.5 rounded-full">Live Analysis</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Insight 1 */}
            <motion.div
              className="flex gap-3 p-3.5 rounded-xl bg-amber-400/5 border border-amber-400/15 hover:border-amber-400/30 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.62 }}
            >
              <span className="text-xl mt-0.5">💡</span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  "Price-related" comments convert at <span className="text-amber-400 font-black">35%</span> when AI uses the 'Discount' Tool.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When your avatar detects keywords like "kitna hai", "price bata", or "costly hai", triggering an exclusive discount nudge increases purchase rate from 18% → 35%. Recommend activating the Discount Tool for all active campaigns.
                </p>
              </div>
            </motion.div>

            {/* Insight 2 */}
            <motion.div
              className="flex gap-3 p-3.5 rounded-xl bg-orange-400/5 border border-orange-400/15 hover:border-orange-400/30 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.70 }}
            >
              <span className="text-xl mt-0.5">💡</span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  Your Hinglish slang setting is outperforming pure English replies by <span className="text-orange-400 font-black">2.5x</span> in DMs.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  DMs with "bhai", "scene set hai", and "ekdum sahi" in responses show a 2.5× higher reply rate and 1.8× faster conversion compared to formal English templates. Your avatar's Hinglish mode is your biggest moat — keep it tuned.
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
