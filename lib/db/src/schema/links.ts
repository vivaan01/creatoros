import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trackingLinksTable = pgTable("tracking_links", {
  id: serial("id").primaryKey(),
  shortCode: text("short_code").notNull().unique(),
  destinationUrl: text("destination_url").notNull(),
  campaignId: integer("campaign_id"),
  productId: integer("product_id"),
  label: text("label"),
  totalClicks: integer("total_clicks").notNull().default(0),
  uniqueClicks: integer("unique_clicks").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTrackingLinkSchema = createInsertSchema(trackingLinksTable).omit({ id: true, createdAt: true, shortCode: true, totalClicks: true, uniqueClicks: true, conversions: true, revenue: true });
export type InsertTrackingLink = z.infer<typeof insertTrackingLinkSchema>;
export type TrackingLink = typeof trackingLinksTable.$inferSelect;
