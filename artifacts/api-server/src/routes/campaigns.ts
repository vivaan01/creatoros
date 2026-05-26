import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, campaignsTable } from "@workspace/db";
import {
  ListCampaignsResponse,
  CreateCampaignBody,
  GetCampaignParams,
  GetCampaignResponse,
  UpdateCampaignParams,
  UpdateCampaignBody,
  UpdateCampaignResponse,
  DeleteCampaignParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapCampaign(c: typeof campaignsTable.$inferSelect) {
  return {
    ...c,
    dealValue: parseFloat(c.dealValue as unknown as string),
    totalRevenue: parseFloat(c.totalRevenue as unknown as string),
    conversionRate: parseFloat(c.conversionRate as unknown as string),
  };
}

router.get("/campaigns", async (_req, res): Promise<void> => {
  const campaigns = await db.select().from(campaignsTable).orderBy(campaignsTable.createdAt);
  res.json(ListCampaignsResponse.parse(campaigns.map(mapCampaign)));
});

router.post("/campaigns", async (req, res): Promise<void> => {
  const parsed = CreateCampaignBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [campaign] = await db
    .insert(campaignsTable)
    .values({
      brandName: parsed.data.brandName,
      productName: parsed.data.productName,
      platform: parsed.data.platform ?? "instagram",
      dealValue: String(parsed.data.dealValue ?? 0),
      startDate: parsed.data.startDate instanceof Date ? parsed.data.startDate.toISOString().split('T')[0] : parsed.data.startDate,
      endDate: parsed.data.endDate ? (parsed.data.endDate instanceof Date ? parsed.data.endDate.toISOString().split('T')[0] : parsed.data.endDate) : null,
      status: "draft",
    })
    .returning();
  res.status(201).json(GetCampaignResponse.parse(mapCampaign(campaign)));
});

router.get("/campaigns/:id", async (req, res): Promise<void> => {
  const params = GetCampaignParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [campaign] = await db
    .select()
    .from(campaignsTable)
    .where(eq(campaignsTable.id, params.data.id));
  if (!campaign) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  res.json(GetCampaignResponse.parse(mapCampaign(campaign)));
});

router.patch("/campaigns/:id", async (req, res): Promise<void> => {
  const params = UpdateCampaignParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateCampaignBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [campaign] = await db
    .update(campaignsTable)
    .set({
      ...(parsed.data.brandName != null ? { brandName: parsed.data.brandName } : {}),
      ...(parsed.data.productName != null ? { productName: parsed.data.productName } : {}),
      ...(parsed.data.status != null ? { status: parsed.data.status } : {}),
      ...(parsed.data.dealValue != null ? { dealValue: String(parsed.data.dealValue) } : {}),
      ...(parsed.data.endDate !== undefined && parsed.data.endDate !== null ? { endDate: parsed.data.endDate instanceof Date ? parsed.data.endDate.toISOString().split('T')[0] : parsed.data.endDate } : {}),
    })
    .where(eq(campaignsTable.id, params.data.id))
    .returning();
  if (!campaign) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  res.json(UpdateCampaignResponse.parse(mapCampaign(campaign)));
});

router.delete("/campaigns/:id", async (req, res): Promise<void> => {
  const params = DeleteCampaignParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [campaign] = await db
    .delete(campaignsTable)
    .where(eq(campaignsTable.id, params.data.id))
    .returning();
  if (!campaign) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
