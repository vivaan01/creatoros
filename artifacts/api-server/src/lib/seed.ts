import { db, creatorProfileTable, campaignsTable, productsTable, trackingLinksTable, conversationsTable, messagesTable } from "@workspace/db";
import { logger } from "./logger";

export async function seedIfEmpty() {
  try {
    const existing = await db.select().from(creatorProfileTable).limit(1);
    if (existing.length > 0) return;

    logger.info("Seeding database with default data...");

    await db.insert(creatorProfileTable).values({
      name: "Arjun Sharma",
      handle: "@arjunstylez",
      platform: "instagram",
      followerCount: 248000,
      avatarEnabled: true,
      coreVibeConversational: "Ekdum chill aur friendly — jaise dost baat kar raha ho. Har bande ko apna lagta hai mera avatar.",
      coreVibeOperational: "Products ke baare mein sab kuch janta hai. Price, size, discount — sab ready rehta hai. Pushy nahi, helpful hota hai.",
      coreVibeRelational: "Trust build karta hai pehle, phir sell. Kabhi jhooth nahi bolta. Bande ki problem samjhta hai.",
      coreVibeEthos: "Spam nahi karta. Rude log ko politely ignore karta hai. Brand deal ke baare mein transparent rehta hai.",
      signatureSlang: "bhai, scene set hai, mast hai, yaar, ekdum, kya baat hai",
    });

    const campaigns = await db.insert(campaignsTable).values([
      { brandName: "Bewakoof", productName: "Oversized Graphic Hoodies", status: "active", platform: "instagram", dealValue: "45000", startDate: "2026-03-01", endDate: "2026-04-30", totalClicks: 3840, totalConversions: 187, totalRevenue: "298700", conversionRate: "4.87" },
      { brandName: "Mamaearth", productName: "Vitamin C Face Serum", status: "active", platform: "instagram", dealValue: "38000", startDate: "2026-02-15", endDate: "2026-04-15", totalClicks: 2960, totalConversions: 143, totalRevenue: "198400", conversionRate: "4.83" },
      { brandName: "Noise", productName: "ColorFit Pro 6 Watch", status: "completed", platform: "youtube", dealValue: "72000", startDate: "2025-12-01", endDate: "2026-01-31", totalClicks: 5120, totalConversions: 312, totalRevenue: "562500", conversionRate: "6.09" },
      { brandName: "The Souled Store", productName: "Anime Collection Tees", status: "active", platform: "x", dealValue: "28000", startDate: "2026-03-15", totalClicks: 1240, totalConversions: 58, totalRevenue: "72400", conversionRate: "4.68" },
      { brandName: "MCaffeine", productName: "Coffee Body Scrub Kit", status: "paused", platform: "instagram", dealValue: "22000", startDate: "2026-01-10", endDate: "2026-03-10", totalClicks: 890, totalConversions: 34, totalRevenue: "38200", conversionRate: "3.82" },
    ]).returning();

    await db.insert(productsTable).values([
      { name: "Oversized Street Hoodie", description: "Premium cotton oversized hoodie, perfect for that streetwear vibe", price: "1299", category: "Apparel", inStock: true, totalSales: 312 },
      { name: "Vintage Wash Cargo Pants", description: "Y2K-inspired cargo pants with multiple pockets", price: "1799", category: "Apparel", inStock: true, totalSales: 187 },
      { name: "Logo Printed Cap", description: "Signature embroidered cap — limited edition drop", price: "699", category: "Accessories", inStock: true, totalSales: 428 },
      { name: "Matte Finish Sunglasses", description: "UV400 protection with anti-glare matte frames", price: "899", category: "Accessories", inStock: false, totalSales: 94 },
      { name: "Creator Pack Bundle", description: "Hoodie + Cap + Tote — the complete creator starter pack", price: "2499", category: "Bundles", inStock: true, totalSales: 156 },
    ]);

    await db.insert(trackingLinksTable).values([
      { shortCode: "bw2k26", destinationUrl: "https://bewakoof.com/hoodies?ref=arjun", campaignId: campaigns[0].id, label: "Bewakoof Hoodie Drop", totalClicks: 3840, uniqueClicks: 2610, conversions: 187, revenue: "298700" },
      { shortCode: "mm2c26", destinationUrl: "https://mamaearth.in/vitc-serum?ref=arjun", campaignId: campaigns[1].id, label: "Mamaearth Vit C", totalClicks: 2960, uniqueClicks: 2140, conversions: 143, revenue: "198400" },
      { shortCode: "nz_clr6", destinationUrl: "https://gonoise.com/colfit-pro6?ref=arjun", campaignId: campaigns[2].id, label: "Noise Watch Collab", totalClicks: 5120, uniqueClicks: 3890, conversions: 312, revenue: "562500" },
      { shortCode: "tss_anime", destinationUrl: "https://thesouledstore.com/anime?ref=arjun", campaignId: campaigns[3].id, label: "Anime Tees Drop", totalClicks: 1240, uniqueClicks: 940, conversions: 58, revenue: "72400" },
      { shortCode: "mca_scrub", destinationUrl: "https://mcaffeine.com/bodyscrub?ref=arjun", campaignId: campaigns[4].id, label: "MCaffeine Coffee Kit", totalClicks: 890, uniqueClicks: 680, conversions: 34, revenue: "38200" },
    ]);

    const convs = await db.insert(conversationsTable).values([
      { followerHandle: "@rahul_vibes", platform: "instagram", status: "converted", triggerComment: "Bhai ye hoodie mast hai, price kya hai?", messageCount: 6, linkSent: true, converted: true, revenueGenerated: "1299", startedAt: new Date(Date.now() - 2 * 86400000), lastMessageAt: new Date(Date.now() - 2 * 86400000 + 25 * 60000) },
      { followerHandle: "@priya_styles", platform: "instagram", status: "converted", triggerComment: "Yaar iska size chart share kar na pls", messageCount: 4, linkSent: true, converted: true, revenueGenerated: "1299", startedAt: new Date(Date.now() - 86400000), lastMessageAt: new Date(Date.now() - 86400000 + 18 * 60000) },
      { followerHandle: "@tech_kartik", platform: "youtube", status: "active", triggerComment: "Bro this watch kahin sale pe milegi kya?", messageCount: 3, linkSent: true, converted: false, revenueGenerated: "0", startedAt: new Date(Date.now() - 3 * 3600000), lastMessageAt: new Date(Date.now() - 1800000) },
      { followerHandle: "@sneha_fashion", platform: "instagram", status: "dropped", triggerComment: "COD hai kya?", messageCount: 2, linkSent: false, converted: false, revenueGenerated: "0", startedAt: new Date(Date.now() - 4 * 3600000), lastMessageAt: new Date(Date.now() - 4 * 3600000 + 5 * 60000) },
      { followerHandle: "@amit_buyer", platform: "x", status: "converted", triggerComment: "Scene set hai bhai, anime tees ke link do", messageCount: 5, linkSent: true, converted: true, revenueGenerated: "899", startedAt: new Date(Date.now() - 6 * 3600000), lastMessageAt: new Date(Date.now() - 6 * 3600000 + 20 * 60000) },
    ]).returning();

    await db.insert(messagesTable).values([
      { conversationId: convs[0].id, role: "follower", content: "Bhai ye hoodie mast hai, price kya hai?", sentAt: new Date(Date.now() - 2 * 86400000) },
      { conversationId: convs[0].id, role: "avatar", content: "Bhai check DM kar! Scene set kar deta hoon tere liye 🔥", sentAt: new Date(Date.now() - 2 * 86400000 + 30000) },
      { conversationId: convs[0].id, role: "follower", content: "Haan bhai bol", sentAt: new Date(Date.now() - 2 * 86400000 + 120000) },
      { conversationId: convs[0].id, role: "avatar", content: "Yaar ye Oversized Street Hoodie hai — Rs. 1299 mein. Ekdum premium cotton, bahut mast feel hai. Size S se XL tak available hai. Tera size kya hai?", sentAt: new Date(Date.now() - 2 * 86400000 + 180000) },
      { conversationId: convs[0].id, role: "follower", content: "L chahiye, kya color hai?", sentAt: new Date(Date.now() - 2 * 86400000 + 480000) },
      { conversationId: convs[0].id, role: "avatar", content: "L mein black aur charcoal grey dono hai bhai. Yeh le tera custom link — isme 10% off bhi lag raha hai aaj: https://crew.os/bw2k26", sentAt: new Date(Date.now() - 2 * 86400000 + 540000) },
    ]);

    logger.info("Database seeded successfully.");
  } catch (err) {
    logger.error({ err }, "Error seeding database");
  }
}
