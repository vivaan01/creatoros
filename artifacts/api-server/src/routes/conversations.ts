import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, conversationsTable, messagesTable } from "@workspace/db";
import {
  ListConversationsResponse,
  GetConversationParams,
  GetConversationResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapConversation(c: typeof conversationsTable.$inferSelect) {
  return {
    ...c,
    revenueGenerated: parseFloat(c.revenueGenerated as unknown as string),
  };
}

router.get("/conversations", async (_req, res): Promise<void> => {
  const conversations = await db
    .select()
    .from(conversationsTable)
    .orderBy(conversationsTable.lastMessageAt);
  res.json(ListConversationsResponse.parse(conversations.map(mapConversation)));
});

router.get("/conversations/:id", async (req, res): Promise<void> => {
  const params = GetConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, params.data.id));
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, params.data.id))
    .orderBy(messagesTable.sentAt);
  res.json(
    GetConversationResponse.parse({
      conversation: mapConversation(conversation),
      messages,
    })
  );
});

export default router;
