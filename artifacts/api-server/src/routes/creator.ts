import { Router, type IRouter } from "express";
import { db, creatorProfileTable } from "@workspace/db";
import {
  GetCreatorProfileResponse,
  UpdateCreatorProfileBody,
  UpdateCreatorProfileResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/creator/profile", async (_req, res): Promise<void> => {
  const profiles = await db.select().from(creatorProfileTable).limit(1);
  if (profiles.length === 0) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  const profile = profiles[0];
  res.json(
    GetCreatorProfileResponse.parse({
      ...profile,
      followerCount: profile.followerCount,
      dealValue: undefined,
    })
  );
});

router.put("/creator/profile", async (req, res): Promise<void> => {
  const parsed = UpdateCreatorProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const profiles = await db.select().from(creatorProfileTable).limit(1);

  if (profiles.length === 0) {
    const [created] = await db
      .insert(creatorProfileTable)
      .values({
        name: parsed.data.name ?? "Creator",
        handle: parsed.data.handle ?? "@creator",
        platform: parsed.data.platform ?? "instagram",
        followerCount: 0,
        avatarEnabled: parsed.data.avatarEnabled ?? true,
        coreVibeConversational: parsed.data.coreVibeConversational ?? "",
        coreVibeOperational: parsed.data.coreVibeOperational ?? "",
        coreVibeRelational: parsed.data.coreVibeRelational ?? "",
        coreVibeEthos: parsed.data.coreVibeEthos ?? "",
        signatureSlang: parsed.data.signatureSlang ?? "",
        profileImage: parsed.data.profileImage ?? null,
      })
      .returning();
    res.json(UpdateCreatorProfileResponse.parse(created));
    return;
  }

  const [updated] = await db
    .update(creatorProfileTable)
    .set({
      ...(parsed.data.name != null ? { name: parsed.data.name } : {}),
      ...(parsed.data.handle != null ? { handle: parsed.data.handle } : {}),
      ...(parsed.data.platform != null ? { platform: parsed.data.platform } : {}),
      ...(parsed.data.avatarEnabled != null ? { avatarEnabled: parsed.data.avatarEnabled } : {}),
      ...(parsed.data.coreVibeConversational != null ? { coreVibeConversational: parsed.data.coreVibeConversational } : {}),
      ...(parsed.data.coreVibeOperational != null ? { coreVibeOperational: parsed.data.coreVibeOperational } : {}),
      ...(parsed.data.coreVibeRelational != null ? { coreVibeRelational: parsed.data.coreVibeRelational } : {}),
      ...(parsed.data.coreVibeEthos != null ? { coreVibeEthos: parsed.data.coreVibeEthos } : {}),
      ...(parsed.data.signatureSlang != null ? { signatureSlang: parsed.data.signatureSlang } : {}),
      ...(parsed.data.profileImage !== undefined ? { profileImage: parsed.data.profileImage } : {}),
    })
    .returning();

  res.json(UpdateCreatorProfileResponse.parse(updated));
});

export default router;
