import { Router, type IRouter } from "express";
import { db, waitlistTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

router.post("/waitlist/join", async (req, res): Promise<void> => {
  const { email, instagram, youtube, x, tiktok, additionalNote } = req.body ?? {};

  if (!email || typeof email !== "string" || !email.trim()) {
    res.status(400).json({ error: "Email is required." });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(cleanEmail)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  const existing = await db
    .select({ id: waitlistTable.id })
    .from(waitlistTable)
    .where(eq(waitlistTable.email, cleanEmail))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "This email is already on the waitlist!" });
    return;
  }

  const [entry] = await db
    .insert(waitlistTable)
    .values({
      email: cleanEmail,
      instagram: instagram?.trim() || null,
      youtube: youtube?.trim() || null,
      x: x?.trim() || null,
      tiktok: tiktok?.trim() || null,
      additionalNote: additionalNote?.trim() || null,
    })
    .returning();

  res.status(201).json({ success: true, id: entry.id });
});

export default router;
