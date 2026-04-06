import { Router, type IRouter } from "express";
import { db, trackingLinksTable } from "@workspace/db";
import {
  ListLinksResponse,
  CreateLinkBody,
} from "@workspace/api-zod";
import { randomBytes } from "crypto";

const router: IRouter = Router();

function mapLink(l: typeof trackingLinksTable.$inferSelect) {
  return {
    ...l,
    revenue: parseFloat(l.revenue as unknown as string),
  };
}

router.get("/links", async (_req, res): Promise<void> => {
  const links = await db.select().from(trackingLinksTable).orderBy(trackingLinksTable.createdAt);
  res.json(ListLinksResponse.parse(links.map(mapLink)));
});

router.post("/links", async (req, res): Promise<void> => {
  const parsed = CreateLinkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const shortCode = randomBytes(4).toString("hex");
  const [link] = await db
    .insert(trackingLinksTable)
    .values({
      shortCode,
      destinationUrl: parsed.data.destinationUrl,
      campaignId: parsed.data.campaignId ?? null,
      productId: parsed.data.productId ?? null,
      label: parsed.data.label ?? null,
    })
    .returning();
  res.status(201).json(mapLink(link));
});

export default router;
