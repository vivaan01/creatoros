import { useState } from "react";
import { useListLinks, useCreateLink, useListCampaigns, useListProducts, getListLinksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Link2, Plus, Copy, TrendingUp, Shield, Fingerprint,
  Cpu, Globe, Code2, QrCode, ArrowRight, Smartphone,
  BarChart3, Zap, Target,
} from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: Link2,
    title: "Deep Linking by Default",
    desc: "Every link supports deep linking including deferred deep linking — user lands in the exact in-app screen, even after a fresh install.",
    badge: "Core",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: TrendingUp,
    title: "Full Funnel Attribution",
    desc: "Track click → install → signup → purchase → retention in a single unified view. No gaps, no guesswork.",
    badge: "Attribution",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Target,
    title: "Ad Platform Postbacks",
    desc: "Send event data back to Meta, Google, TikTok, Apple Search Ads, and Snapchat for campaign optimisation.",
    badge: "Integrations",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Smartphone,
    title: "SKAN 4.0 Decoding",
    desc: "iOS privacy-safe measurement with full SKAdNetwork 4.0 decoding — get campaign signals without sacrificing user privacy.",
    badge: "iOS",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Shield,
    title: "Fraud Detection & Blocking",
    desc: "Real-time protection against click spam, bot traffic, fake installs, and device farm fraud before it pollutes your data.",
    badge: "Security",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    icon: BarChart3,
    title: "ROAS & LTV Tracking",
    desc: "Measure Return on Ad Spend and Lifetime Value broken down by campaign, channel, and creative — exactly what brands need.",
    badge: "Analytics",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Fingerprint,
    title: "User-Level Identification",
    desc: "30+ unique user attributes per session — device, geography, referral source, install time, and custom properties.",
    badge: "Identity",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Cpu,
    title: "Built-in Link Debugger",
    desc: "Live debugger for testing and fixing deep link routing — see exactly where a user goes and why, in real time.",
    badge: "DevTools",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: Globe,
    title: "Universal Link System",
    desc: "Universal Links, App Links, URI schemes, and web fallbacks unified into one link — works across every OS and context.",
    badge: "Cross-Platform",
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
  },
  {
    icon: Code2,
    title: "API-First & Webhooks",
    desc: "Bulk link generation via API and live attribution webhooks — plug Data Foot Print into any workflow or data warehouse.",
    badge: "Developer",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: QrCode,
    title: "Custom Domains, QR & Previews",
    desc: "Custom domains, shortlinks, QR codes, branded CTAs, and rich link previews — all controlled from one place.",
    badge: "Branding",
    color: "text-orange-300",
    bg: "bg-orange-400/10 border-orange-400/20",
  },
];

const HOW_IT_WORKS = [
  { icon: Link2,        step: "01", title: "Link Created",      desc: "Generate a Data Foot Print shortlink for your campaign, product, or collab." },
  { icon: Smartphone,   step: "02", title: "User Clicks",       desc: "Device, OS, and routing context are detected in milliseconds." },
  { icon: Globe,        step: "03", title: "Smart Route",       desc: "App installed? Open the exact in-app screen. Not installed? Go to the store." },
  { icon: Cpu,          step: "04", title: "Intent Preserved",  desc: "After install, deferred deep linking restores the original destination." },
  { icon: Fingerprint,  step: "05", title: "Event Attributed",  desc: "Install, open, and every subsequent action tied back to the source click." },
  { icon: Target,       step: "06", title: "Postback Fired",    desc: "Purchase and event data sent to your ad platform for bidding optimization." },
  { icon: BarChart3,    step: "07", title: "Analytics Shown",   desc: "Clicks, installs, ROAS, LTV — by channel, campaign, and creative." },
];

function FeatureCard({ feature, delay }: { feature: typeof FEATURES[0]; delay: number }) {
  const Icon = feature.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.35 }}>
      <Card className={`h-full border ${feature.bg} bg-card/40 hover:bg-card/70 transition-colors duration-200 group`}>
        <CardContent className="p-4 flex flex-col gap-2 h-full">
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-lg ${feature.bg}`}>
              <Icon className={`h-4 w-4 ${feature.color}`} />
            </div>
            <Badge variant="outline" className={`text-[9px] px-1.5 py-0 border ${feature.bg} ${feature.color} font-medium uppercase tracking-wider`}>
              {feature.badge}
            </Badge>
          </div>
          <p className="text-sm font-semibold leading-snug">{feature.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed flex-1">{feature.desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Links() {
  const { data: links, isLoading } = useListLinks();
  const { data: campaigns } = useListCampaigns();
  const { data: products } = useListProducts();
  const createLink = useCreateLink();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    destinationUrl: "",
    label: "",
    campaignId: "" as string | number,
    productId: "" as string | number,
  });

  const handleCreate = () => {
    createLink.mutate(
      {
        data: {
          destinationUrl: newLink.destinationUrl,
          label: newLink.label || null,
          campaignId: newLink.campaignId ? Number(newLink.campaignId) : null,
          productId: newLink.productId ? Number(newLink.productId) : null,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListLinksQueryKey() });
          setIsCreateOpen(false);
          toast({ title: "Link Created", description: "Your tracking link is ready." });
          setNewLink({ destinationUrl: "", label: "", campaignId: "", productId: "" });
        },
      }
    );
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`https://go.crtr.os/${code}`);
    toast({ title: "Copied to clipboard" });
  };

  const formatINR = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  if (isLoading) return <div className="animate-pulse text-muted-foreground p-8">Loading...</div>;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2.5">
            💰 Revenue per Click 🪙
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Powered by <span className="text-primary font-semibold">Data Foot Print</span> — you can see your sales funnel.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2">
              <Plus className="h-4 w-4" /> Generate Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Tracking Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Destination URL</Label>
                <Input value={newLink.destinationUrl} onChange={(e) => setNewLink({ ...newLink, destinationUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Label (Optional)</Label>
                <Input value={newLink.label} onChange={(e) => setNewLink({ ...newLink, label: e.target.value })} placeholder="e.g. IG Bio Link" />
              </div>
              <div className="space-y-2">
                <Label>Attach to Campaign (Optional)</Label>
                <Select value={String(newLink.campaignId)} onValueChange={(v) => setNewLink({ ...newLink, campaignId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select campaign" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {campaigns?.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.brandName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Attach to Product (Optional)</Label>
                <Select value={String(newLink.productId)} onValueChange={(v) => setNewLink({ ...newLink, productId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {products?.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} disabled={createLink.isPending} className="w-full">Create Shortlink</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── What Makes Data Foot Print Different ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">What Makes Data Foot Print Different</h2>
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-xs text-muted-foreground">11 differentiators</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} delay={i * 0.04} />
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Cpu className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">How It Works</h2>
          <div className="flex-1 h-px bg-border/40" />
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute top-[38px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent pointer-events-none" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  className="relative flex flex-col items-center gap-2 text-center"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <div className="relative z-10 w-[52px] h-[52px] rounded-full bg-card border border-orange-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.12)] hover:border-orange-400/60 hover:shadow-[0_0_18px_rgba(249,115,22,0.25)] transition-all">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-[16px] -right-2 h-4 w-4 text-orange-500/40 z-20" />
                  )}
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-primary/70 tracking-widest">{step.step}</p>
                    <p className="text-xs font-semibold leading-tight">{step.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground">Postbacks to:</span>
          {["Meta", "Google", "TikTok", "Apple Search Ads", "Snapchat"].map((p) => (
            <span key={p} className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 border border-border/50 text-muted-foreground font-medium">{p}</span>
          ))}
        </div>
      </section>

      {/* ── Tracking Links Table ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Link2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Your Tracking Links</h2>
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-xs text-muted-foreground">{links?.length ?? 0} links</span>
        </div>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Short Code</TableHead>
                  <TableHead>Label / Target</TableHead>
                  <TableHead className="text-right">Total Clicks</TableHead>
                  <TableHead className="text-right">Unique</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {links?.map((link) => (
                  <TableRow key={link.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-mono text-sm font-medium text-primary">/{link.shortCode}</TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{link.label || "Unnamed Link"}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[220px]" title={link.destinationUrl}>
                        {link.destinationUrl}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{link.totalClicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{link.uniqueClicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">{link.conversions.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium text-primary">{formatINR(link.revenue)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(link.shortCode)} className="h-8 w-8">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {links?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No tracking links created yet. Generate your first one above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
