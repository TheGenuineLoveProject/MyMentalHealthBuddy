import express from "express";
import { randomUUID } from "crypto";
import { db } from "../db/connection.mjs";
import { digitalProducts, productPurchases } from "../../shared/schema.mjs";
import { eq, desc, and, sql } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100) + "-" + Date.now().toString(36);
}

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { type, status, featured } = req.query;
    
    let query = db.select().from(digitalProducts);
    
    const conditions = [];
    if (type) conditions.push(eq(digitalProducts.type, type));
    if (status) conditions.push(eq(digitalProducts.status, status));
    if (featured === "true") conditions.push(eq(digitalProducts.featured, 1));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const products = await query.orderBy(desc(digitalProducts.createdAt)).limit(100);
    
    return success(res, products);
  } catch (error) {
    logger.error("Failed to fetch products:", error);
    return badRequest(res, "Failed to fetch products");
  }
});

router.get("/public", async (req, res) => {
  try {
    const products = await db
      .select()
      .from(digitalProducts)
      .where(eq(digitalProducts.status, "published"))
      .orderBy(desc(digitalProducts.featured), desc(digitalProducts.createdAt));
    
    return success(res, products);
  } catch (error) {
    logger.error("Failed to fetch public products:", error);
    return badRequest(res, "Failed to fetch products");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [product] = await db
      .select({
        id: digitalProducts.id,
        title: digitalProducts.title,
        slug: digitalProducts.slug,
        description: digitalProducts.description,
        longDescription: digitalProducts.longDescription,
        type: digitalProducts.type,
        price: digitalProducts.price,
        coverImage: digitalProducts.coverImage,
        previewUrl: digitalProducts.previewUrl,
        status: digitalProducts.status,
        category: digitalProducts.category,
        tags: digitalProducts.tags,
        createdAt: digitalProducts.createdAt,
      })
      .from(digitalProducts)
      .where(and(eq(digitalProducts.id, id), eq(digitalProducts.status, "published")))
      .limit(1);
    
    if (!product) {
      return badRequest(res, "Product not found", 404);
    }
    
    return success(res, product);
  } catch (error) {
    logger.error("Failed to fetch product:", error);
    return badRequest(res, "Failed to fetch product");
  }
});

router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [product] = await db
      .select({
        id: digitalProducts.id,
        title: digitalProducts.title,
        slug: digitalProducts.slug,
        description: digitalProducts.description,
        longDescription: digitalProducts.longDescription,
        type: digitalProducts.type,
        price: digitalProducts.price,
        coverImage: digitalProducts.coverImage,
        previewUrl: digitalProducts.previewUrl,
        status: digitalProducts.status,
        category: digitalProducts.category,
        tags: digitalProducts.tags,
        createdAt: digitalProducts.createdAt,
      })
      .from(digitalProducts)
      .where(and(eq(digitalProducts.slug, slug), eq(digitalProducts.status, "published")))
      .limit(1);
    
    if (!product) {
      return badRequest(res, "Product not found", 404);
    }
    
    return success(res, product);
  } catch (error) {
    logger.error("Failed to fetch product:", error);
    return badRequest(res, "Failed to fetch product");
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      longDescription,
      type,
      price = 0,
      coverImage,
      downloadUrl,
      previewUrl,
      status = "draft",
      featured = 0,
      category,
      tags,
    } = req.body;
    
    if (!title || !type) {
      return badRequest(res, "Title and type are required");
    }
    
    const productSlug = slug || generateSlug(title);
    
    const [newProduct] = await db
      .insert(digitalProducts)
      .values({
        title,
        slug: productSlug,
        description: description || null,
        longDescription: longDescription || null,
        type,
        price: parseInt(price) || 0,
        coverImage: coverImage || null,
        downloadUrl: downloadUrl || null,
        previewUrl: previewUrl || null,
        status,
        featured: featured ? 1 : 0,
        category: category || null,
        tags: tags || null,
        authorId: req.user?.id || randomUUID(),
      })
      .returning();
    
    return success(res, newProduct, 201);
  } catch (error) {
    logger.error("Failed to create product:", error);
    if (error.code === "23505") {
      return badRequest(res, "A product with this slug already exists");
    }
    return badRequest(res, "Failed to create product");
  }
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      description,
      longDescription,
      type,
      price,
      coverImage,
      downloadUrl,
      previewUrl,
      status,
      featured,
      category,
      tags,
    } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (longDescription !== undefined) updateData.longDescription = longDescription;
    if (type !== undefined) updateData.type = type;
    if (price !== undefined) updateData.price = parseInt(price) || 0;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (downloadUrl !== undefined) updateData.downloadUrl = downloadUrl;
    if (previewUrl !== undefined) updateData.previewUrl = previewUrl;
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured ? 1 : 0;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    updateData.updatedAt = new Date();
    
    const [updatedProduct] = await db
      .update(digitalProducts)
      .set(updateData)
      .where(eq(digitalProducts.id, id))
      .returning();
    
    if (!updatedProduct) {
      return badRequest(res, "Product not found", 404);
    }
    
    return success(res, updatedProduct);
  } catch (error) {
    logger.error("Failed to update product:", error);
    return badRequest(res, "Failed to update product");
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [deletedProduct] = await db
      .delete(digitalProducts)
      .where(eq(digitalProducts.id, id))
      .returning();
    
    if (!deletedProduct) {
      return badRequest(res, "Product not found", 404);
    }
    
    return success(res, { message: "Product deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete product:", error);
    return badRequest(res, "Failed to delete product");
  }
});

router.post("/:id/purchase", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, transactionId } = req.body;
    
    const [product] = await db
      .select()
      .from(digitalProducts)
      .where(eq(digitalProducts.id, id))
      .limit(1);
    
    if (!product) {
      return badRequest(res, "Product not found", 404);
    }
    
    const [purchase] = await db
      .insert(productPurchases)
      .values({
        productId: id,
        userId: req.user.id,
        pricePaid: product.price,
        paymentMethod: paymentMethod || null,
        transactionId: transactionId || null,
      })
      .returning();
    
    await db
      .update(digitalProducts)
      .set({
        salesCount: sql`${digitalProducts.salesCount} + 1`,
      })
      .where(eq(digitalProducts.id, id));
    
    return success(res, { purchase, downloadUrl: product.downloadUrl }, 201);
  } catch (error) {
    logger.error("Failed to process purchase:", error);
    return badRequest(res, "Failed to process purchase");
  }
});

router.get("/:id/purchases", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const purchases = await db
      .select()
      .from(productPurchases)
      .where(eq(productPurchases.productId, id))
      .orderBy(desc(productPurchases.createdAt));
    
    return success(res, purchases);
  } catch (error) {
    logger.error("Failed to fetch purchases:", error);
    return badRequest(res, "Failed to fetch purchases");
  }
});

export default router;
