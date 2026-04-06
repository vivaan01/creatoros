import { pgTable, text, serial, timestamp, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const conversationsTable = pgTable("conversations", {
  id: serial("id").primaryKey(),
  followerHandle: text("follower_handle").notNull(),
  platform: text("platform").notNull().default("instagram"),
  status: text("status").notNull().default("active"),
  triggerComment: text("trigger_comment").notNull(),
  messageCount: integer("message_count").notNull().default(0),
  linkSent: boolean("link_sent").notNull().default(false),
  converted: boolean("converted").notNull().default(false),
  revenueGenerated: numeric("revenue_generated", { precision: 12, scale: 2 }).notNull().default("0"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversationsTable).omit({ id: true, startedAt: true, lastMessageAt: true, messageCount: true, linkSent: true, converted: true, revenueGenerated: true });
export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, sentAt: true });
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversationsTable.$inferSelect;
export type Message = typeof messagesTable.$inferSelect;
