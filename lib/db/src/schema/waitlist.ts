import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const waitlistTable = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  instagram: text("instagram"),
  youtube: text("youtube"),
  x: text("x"),
  tiktok: text("tiktok"),
  additionalNote: text("additional_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WaitlistEntry = typeof waitlistTable.$inferSelect;
