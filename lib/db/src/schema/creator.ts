import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const creatorProfileTable = pgTable("creator_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  handle: text("handle").notNull(),
  platform: text("platform").notNull().default("instagram"),
  followerCount: integer("follower_count").notNull().default(0),
  avatarEnabled: boolean("avatar_enabled").notNull().default(true),
  coreVibeConversational: text("core_vibe_conversational").notNull().default(""),
  coreVibeOperational: text("core_vibe_operational").notNull().default(""),
  coreVibeRelational: text("core_vibe_relational").notNull().default(""),
  coreVibeEthos: text("core_vibe_ethos").notNull().default(""),
  signatureSlang: text("signature_slang").notNull().default(""),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCreatorProfileSchema = createInsertSchema(creatorProfileTable).omit({ id: true, createdAt: true });
export type InsertCreatorProfile = z.infer<typeof insertCreatorProfileSchema>;
export type CreatorProfile = typeof creatorProfileTable.$inferSelect;
