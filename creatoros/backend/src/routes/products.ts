import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsResponse,
  CreateProductBody,
  UpdateProductParams,
  UpdateProductBody,
  UpdateProductResponse,
  DeleteProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapProduct(p: typeof productsTable.$inferSelect) {
  return {
    ...p,
    price: parseFloat(p.price as unknown as string),
  };
}

router.get("/products", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable).orderBy(productsTable.createdAt);
  res.json(ListProductsResponse.parse(products.map(mapProduct)));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [product] = await db
    .insert(productsTable)
    .values({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      price: String(parsed.data.price),
      category: parsed.data.category,
      imageUrl: parsed.data.imageUrl ?? null,
      inStock: parsed.data.inStock ?? true,
    })
    .returning();
  res.status(201).json(mapProduct(product));
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [product] = await db
    .update(productsTable)
    .set({
      ...(parsed.data.name != null ? { name: parsed.data.name } : {}),
      ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
      ...(parsed.data.price != null ? { price: String(parsed.data.price) } : {}),
      ...(parsed.data.category != null ? { category: parsed.data.category } : {}),
      ...(parsed.data.inStock != null ? { inStock: parsed.data.inStock } : {}),
      ...(parsed.data.imageUrl !== undefined ? { imageUrl: parsed.data.imageUrl } : {}),
    })
    .where(eq(productsTable.id, params.data.id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(UpdateProductResponse.parse(mapProduct(product)));
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [product] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
