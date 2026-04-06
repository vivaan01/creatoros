import { 
  useGetDashboardSummary, 
  useGetRevenueTrend, 
  useGetFunnelStats, 
  useGetTopProducts,
  useGetCreatorProfile
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: trend, isLoading: isTrendLoading } = useGetRevenueTrend();
  const { data: funnel, isLoading: isFunnelLoading } = useGetFunnelStats();
  const { data: topProducts, isLoading: isProductsLoading } = useGetTopProducts();
  const { data: profile, isLoading: isProfileLoading } = useGetCreatorProfile();

  if (isSummaryLoading || isTrendLoading || isFunnelLoading || isProductsLoading || isProfileLoading) {
    return <div className="animate-pulse flex space-x-4">Loading dashboard data...</div>;
  }

  const formatINR = (value: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">The Face Value</h1>
          <p className="text-muted-foreground mt-1">Real-time performance metrics for your avatar.</p>
        </div>
        {profile && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">{profile.name}</p>
              <p className="text-xs text-muted-foreground">@{profile.handle} • {profile.platform}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center font-bold text-primary">
              {profile.name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatINR(summary.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-400 font-medium">+{summary.revenueGrowthPct}%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">DMs Handled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalDmsHandled.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">By AI Avatar</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalConversions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Purchases via links</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Conv. Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.avgConversionRate.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Across active campaigns</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            {trend && trend.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#121212', borderColor: '#333', color: '#fff' }}
                      formatter={(value: number) => [formatINR(value), 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Top Converting Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts && topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.productId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category} • {product.totalSales} sales</p>
                    </div>
                    <div className="font-medium text-primary">
                      {formatINR(product.totalRevenue)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">No products available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
