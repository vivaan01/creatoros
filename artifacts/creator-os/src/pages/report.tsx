import { useGetDashboardSummary, useGetCreatorProfile, useGetTopProducts } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trophy, Target, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Report() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: profile, isLoading: isProfileLoading } = useGetCreatorProfile();
  const { data: topProducts } = useGetTopProducts();

  const formatINR = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  if (isSummaryLoading || isProfileLoading) return <div className="animate-pulse">Loading report...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Brand ROI Report
          </h1>
          <p className="text-muted-foreground mt-1">Exportable one-pager for brand negotiations.</p>
        </div>
        <Button variant="outline" className="hidden sm:flex" onClick={() => window.print()}>
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-8 print:p-0 print:border-none shadow-sm">
        {/* Report Header */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-2xl border border-primary/50">
              {profile?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <p className="text-muted-foreground">@{profile?.handle} • {profile?.platform}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-1">CreatorOS Verified</p>
            <p className="text-2xl font-bold">{profile?.followerCount?.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Audience</p>
          </div>
        </div>

        {/* Hero Metric */}
        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-8 mb-8 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Total Value Driven For Brands</p>
          <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mb-4">
            {formatINR(summary?.totalRevenue || 0)}
          </h3>
          <div className="flex justify-center gap-8 text-sm">
            <div><span className="font-bold">{summary?.totalConversions?.toLocaleString() ?? 0}</span> Sales Generated</div>
            <div><span className="font-bold">{summary?.totalBrands ?? 0}</span> Brand Partners</div>
          </div>
        </div>

        {/* Deep Stats */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="border border-border/50 rounded-lg p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Target className="h-5 w-5" />
              <h4 className="font-medium text-sm uppercase tracking-wider">Conversion Engine</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-sm">Avg. Conversion Rate</span>
                <span className="font-bold text-lg">{summary?.avgConversionRate?.toFixed(1) ?? '0.0'}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-2">
                <span className="text-sm">DMs Handled via AI</span>
                <span className="font-bold text-lg">{summary?.totalDmsHandled?.toLocaleString() ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Campaigns</span>
                <span className="font-bold text-lg">{summary?.activeCampaigns ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="border border-border/50 rounded-lg p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Trophy className="h-5 w-5" />
              <h4 className="font-medium text-sm uppercase tracking-wider">Top Performing Products</h4>
            </div>
            <div className="space-y-4">
              {(Array.isArray(topProducts) ? topProducts : []).slice(0,3).map((p, i) => (
                <div key={p.productId} className="flex justify-between items-center border-b border-border/30 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs font-mono">{i+1}</span>
                    <span className="text-sm font-medium line-clamp-1">{p.name}</span>
                  </div>
                  <span className="font-bold text-sm">{formatINR(p.totalRevenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-border/50 text-xs text-muted-foreground">
          Report generated securely via CreatorOS Attribution Engine
        </div>
      </div>
    </div>
  );
}
