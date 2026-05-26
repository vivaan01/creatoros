import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, campaignsTable, conversationsTable, productsTable } from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetFunnelStatsResponse,
  GetRevenueTrendResponse,
  GetTopProductsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [campaignStats] = await db
    .select({
      totalRevenue: sql<string>`COALESCE(SUM(total_revenue), 0)`,
      totalConversions: sql<number>`COALESCE(SUM(total_conversions), 0)`,
      activeCampaigns: sql<number>`COUNT(*) FILTER (WHERE status = 'active')`,
      totalBrands: sql<number>`COUNT(DISTINCT brand_name)`,
      revenueThisMonth: sql<string>`COALESCE(SUM(total_revenue) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())), 0)`,
      conversionsThisMonth: sql<number>`COALESCE(SUM(total_conversions) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())), 0)`,
      revenueLastMonth: sql<string>`COALESCE(SUM(total_revenue) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW() - INTERVAL '1 month')), 0)`,
    })
    .from(campaignsTable);

  const [convStats] = await db
    .select({
      totalDmsHandled: sql<number>`COUNT(*)`,
      avgConversionRate: sql<string>`COALESCE(AVG(CASE WHEN converted THEN 1.0 ELSE 0.0 END) * 100, 0)`,
    })
    .from(conversationsTable);

  const totalRevenue = parseFloat(campaignStats.totalRevenue);
  const revenueThisMonth = parseFloat(campaignStats.revenueThisMonth);
  const revenueLastMonth = parseFloat(campaignStats.revenueLastMonth);
  const revenueGrowthPct =
    revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : 0;

  res.json(
    GetDashboardSummaryResponse.parse({
      totalRevenue,
      totalConversions: Number(campaignStats.totalConversions),
      totalDmsHandled: Number(convStats.totalDmsHandled),
      avgConversionRate: parseFloat(convStats.avgConversionRate),
      activeCampaigns: Number(campaignStats.activeCampaigns),
      totalBrands: Number(campaignStats.totalBrands),
      revenueThisMonth,
      conversionsThisMonth: Number(campaignStats.conversionsThisMonth),
      revenueGrowthPct,
    })
  );
});

router.get("/dashboard/funnel", async (_req, res): Promise<void> => {
  const campaigns = await db.select().from(campaignsTable).orderBy(campaignsTable.createdAt);

  const funnelStats = campaigns.map((c) => ({
    campaignId: c.id,
    brandName: c.brandName,
    comments: Math.round(c.totalClicks * 3.2),
    dmsInitiated: Math.round(c.totalClicks * 1.8),
    linksClicked: c.totalClicks,
    purchases: c.totalConversions,
    conversionRate: parseFloat(c.conversionRate as unknown as string),
  }));

  res.json(GetFunnelStatsResponse.parse(funnelStats));
});

router.get("/dashboard/revenue-trend", async (_req, res): Promise<void> => {
  const rows = await db.execute(sql`
    SELECT
      gs.day::date AS date,
      COALESCE(SUM(c.total_revenue), 0) AS revenue,
      COALESCE(SUM(c.total_conversions), 0) AS conversions
    FROM generate_series(
      NOW() - INTERVAL '29 days',
      NOW(),
      INTERVAL '1 day'
    ) AS gs(day)
    LEFT JOIN campaigns c ON DATE_TRUNC('day', c.created_at) = gs.day::date
    GROUP BY gs.day
    ORDER BY gs.day ASC
  `);

  const trend = (rows.rows as Array<{ date: Date | string; revenue: string; conversions: string }>).map((r) => ({
    date: typeof r.date === "string" ? r.date.slice(0, 10) : new Date(r.date).toISOString().slice(0, 10),
    revenue: parseFloat(r.revenue),
    conversions: parseInt(String(r.conversions), 10),
  }));

  res.json(GetRevenueTrendResponse.parse(trend));
});

router.get("/dashboard/top-products", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .orderBy(sql`total_sales DESC`)
    .limit(5);

  const topProducts = products.map((p) => ({
    productId: p.id,
    name: p.name,
    category: p.category,
    totalSales: p.totalSales,
    totalRevenue: parseFloat(p.price as unknown as string) * p.totalSales,
    imageUrl: p.imageUrl ?? null,
  }));

  res.json(GetTopProductsResponse.parse(topProducts));
});

export default router;
