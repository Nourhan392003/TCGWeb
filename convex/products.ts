import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
async function requireAdmin(ctx: any) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        throw new Error("Unauthenticated");
    }

    const role =
        (identity as any).role ??
        (identity as any).metadata?.role ??
        (identity as any).publicMetadata?.role ??
        (identity as any).claims?.metadata?.role;

    if (role !== "admin") {
        throw new Error("Unauthorized");
    }

    return identity;
}
async function resolveImageUrl(ctx: any, product: any) {
    let finalImageUrl = product.imageUrl || product.image || "";

    if (product.imageId) {
        const storageUrl = await ctx.storage.getUrl(product.imageId);
        if (storageUrl) {
            finalImageUrl = storageUrl;
        }
    }

    return finalImageUrl;
}

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);

        return await ctx.storage.generateUploadUrl();
    },
});

export const updateProductImage = mutation({
    args: {
        productId: v.id("products"),
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const imageUrl = await ctx.storage.getUrl(args.storageId);

        await ctx.db.patch(args.productId, {
            image: imageUrl ?? undefined,
            imageUrl: imageUrl ?? undefined,
            imageId: args.storageId,
        });
    },
});
export const addProduct = mutation({
    args: {
        name: v.object({ en: v.string(), ar: v.optional(v.string()) }),
        price: v.number(),
        description: v.optional(v.object({ en: v.string(), ar: v.optional(v.string()) })),
        imageId: v.optional(v.id("_storage")),
        image: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        game: v.optional(v.string()),
        type: v.optional(v.string()),
        rarity: v.optional(v.string()),
        condition: v.optional(v.string()),
        inStock: v.boolean(),
        stockQuantity: v.optional(v.number()),
        isFoil: v.optional(v.boolean()),
        isFirstEdition: v.optional(v.boolean()),
        isFeatured: v.optional(v.boolean()),
        isGraded: v.optional(v.boolean()),
        isPreorder: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        let resolvedImageUrl = args.imageUrl || args.image;

        if (args.imageId) {
            const storageUrl = await ctx.storage.getUrl(args.imageId);
            if (storageUrl) {
                resolvedImageUrl = storageUrl;
            }
        }

        const newProductId = await ctx.db.insert("products", {
            ...args,
            image: resolvedImageUrl,
            imageUrl: resolvedImageUrl,
            createdAt: Date.now(),
        });

        return newProductId;
    },
});

export const getAllCards = query({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const allProducts = await ctx.db.query("products").order("desc").collect();

        const productsWithUrls = await Promise.all(
            allProducts.map(async (product) => {
                const finalImageUrl = await resolveImageUrl(ctx, product);

                return {
                    ...product,
                    imageUrl: finalImageUrl,
                };
            })
        );

        return productsWithUrls;
    },
});

export const addCard = mutation({
    args: {
        name: v.object({ en: v.string(), ar: v.optional(v.string()) }),
        description: v.optional(v.object({ en: v.string(), ar: v.optional(v.string()) })),
        price: v.number(),
        imageUrl: v.optional(v.string()),
        image: v.optional(v.string()),
        imageId: v.optional(v.id("_storage")),
        game: v.string(),
        rarity: v.optional(v.string()),
        condition: v.optional(v.string()),
        isFoil: v.optional(v.boolean()),
        isFirstEdition: v.optional(v.boolean()),
        inStock: v.boolean(),
        stockQuantity: v.optional(v.number()),
        isFeatured: v.optional(v.boolean()),
        isPreorder: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        let resolvedImageUrl = args.imageUrl || args.image;

        if (args.imageId) {
            const storageUrl = await ctx.storage.getUrl(args.imageId);
            if (storageUrl) {
                resolvedImageUrl = storageUrl;
            }
        }

        const cardId = await ctx.db.insert("products", {
            ...args,
            image: resolvedImageUrl,
            imageUrl: resolvedImageUrl,
            createdAt: Date.now(),
        });


        return cardId;
    },
});

export const deleteCard = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.delete(args.id);
    },
});

export const updateCard = mutation({
    args: {
        id: v.id("products"),
        name: v.optional(v.object({ en: v.string(), ar: v.optional(v.string()) })),
        description: v.optional(v.object({ en: v.string(), ar: v.optional(v.string()) })),
        price: v.optional(v.number()),
        imageUrl: v.optional(v.string()),
        image: v.optional(v.string()),
        imageId: v.optional(v.id("_storage")),
        game: v.optional(v.string()),
        rarity: v.optional(v.string()),
        condition: v.optional(v.string()),
        isFoil: v.optional(v.boolean()),
        isFirstEdition: v.optional(v.boolean()),
        inStock: v.optional(v.boolean()),
        stockQuantity: v.optional(v.number()),
        isFeatured: v.optional(v.boolean()),
        isPreorder: v.optional(v.boolean()),
        type: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const { id, ...updates } = args;

        let resolvedImageUrl = updates.imageUrl || updates.image;

        if (updates.imageId) {
            const storageUrl = await ctx.storage.getUrl(updates.imageId);
            if (storageUrl) {
                resolvedImageUrl = storageUrl;
            }
        }

        await ctx.db.patch(id, {
            ...updates,
            ...(resolvedImageUrl
                ? { image: resolvedImageUrl, imageUrl: resolvedImageUrl }
                : {}),
        });
    },
});

export const createOrder = mutation({
    args: {
        userId: v.string(),
        totalAmount: v.number(),
        status: v.string(),
        shippingAddress: v.object({
            fullName: v.string(),
            address: v.string(),
            city: v.string(),
            phone: v.string(),
            postalCode: v.string(),
        }),
        items: v.array(
            v.object({
                productId: v.id("products"),
                name: v.union(v.string(), v.object({ en: v.string(), ar: v.optional(v.string()) })),
                price: v.number(),
                quantity: v.number(),
            })
        ),

    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const productUpdates = [];
        for (const item of args.items) {
            const product = await ctx.db.get(item.productId); const itemName = typeof item.name === 'string' ? item.name : (item.name.en || 'Unknown');
            if (!product) {
                throw new Error(`Product not found: ${itemName}`);
            }
            if (product.stockQuantity !== undefined && item.quantity > product.stockQuantity) {
                throw new Error(`Insufficient stock for ${itemName}`);
            }
            productUpdates.push({
                id: product._id,
                currentStock: product.stockQuantity,
            });
        }

        const newOrderId = await ctx.db.insert("orders", {
            ...args,
            createdAt: Date.now(),
        });

        for (let i = 0; i < args.items.length; i++) {
            const item = args.items[i];
            const update = productUpdates[i];
            if (update.currentStock !== undefined) {
                const newStock = Math.max(0, update.currentStock - item.quantity);
                await ctx.db.patch(update.id, {
                    stockQuantity: newStock,
                    inStock: newStock > 0,
                });
            }
        }

        return newOrderId;
    },
});

/**
 * Finalize an order after confirmed payment.
 * Decrements stockQuantity and sets inStock = false when stock reaches 0.
 * Idempotent: safe to call multiple times (checks stockDecremented flag).
 * Does NOT require admin auth — callable from the Paymob callback server route.
 */
export const finalizeOrder = mutation({
    args: {
        orderReference: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db
            .query("orders")
            .withIndex("by_order_reference", (q) =>
                q.eq("orderReference", args.orderReference)
            )
            .first();

        if (!order) {
            throw new Error(`Order not found for finalization: ${args.orderReference}`);
        }

        // Idempotency guard: if stock was already decremented, skip
        if (order.stockDecremented === true) {
            return { success: true, message: "Already finalized" };
        }

        // Only finalize orders that are in "paid" status
        if (order.status !== "paid" && order.paymentStatus !== "paid") {
            throw new Error(`Order ${args.orderReference} is not paid (status: ${order.status}, paymentStatus: ${order.paymentStatus})`);
        }

        const storeItems: Array<{ productId: string; quantity: number }> =
            (order.storeItems as Array<{ productId: string; quantity: number }>) ?? [];
        if (storeItems.length === 0) {
            // No items to decrement — just mark as finalized
            await ctx.db.patch(order._id, { stockDecremented: true });
            return { success: true, message: "No items to decrement, marked as finalized" };
        }

        // Validate and decrement stock for each product
        const productUpdates: Array<{ id: Id<"products">; newStock: number }> = [];
        for (const item of storeItems) {
            const product = await ctx.db.get(item.productId as Id<"products">);
            if (!product) {
                throw new Error(`Product not found during finalization: ${item.productId}`);
            }

            const currentStock: number = (product as { stockQuantity?: number }).stockQuantity ?? 0;
            if (currentStock < item.quantity) {
                throw new Error(
                    `Insufficient stock for product ${item.productId}: ` +
                    `requested ${item.quantity}, available ${currentStock}`
                );
            }

            productUpdates.push({
                id: product._id as Id<"products">,
                newStock: Math.max(0, currentStock - item.quantity),
            });
        }

        // Apply stock decrements
        for (const update of productUpdates) {
            await ctx.db.patch(update.id, {
                stockQuantity: update.newStock,
                inStock: update.newStock > 0,
            });
        }

        // Mark order as finalized to prevent duplicate decrements
        await ctx.db.patch(order._id, { stockDecremented: true });

        return { success: true, message: "Stock finalized" };
    },
});

export const getProductById = query({
    args: { id: v.id("products") },

    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const product = await ctx.db.get(args.id);
        if (!product) return null;

        const finalImageUrl = await resolveImageUrl(ctx, product);

        return {
            ...product,
            imageUrl: finalImageUrl,
        };
    },
});

export const getFeaturedCards = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").order("desc").take(8);

        const productsWithUrls = await Promise.all(
            products.map(async (product) => {
                const finalImageUrl = await resolveImageUrl(ctx, product);

                return {
                    ...product,
                    imageUrl: finalImageUrl,
                };
            })
        );

        return productsWithUrls;
    },
});
export const getPreorderProducts = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db
            .query("products")
            .filter((q) => q.eq(q.field("isPreorder"), true))
            .collect();

        const productsWithUrls = await Promise.all(
            products.map(async (product) => {
                const finalImageUrl = await resolveImageUrl(ctx, product);
                return {
                    ...product,
                    imageUrl: finalImageUrl,
                };
            })
        );

        return productsWithUrls;
    },
});

export const getAllProducts = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("products").collect();
    },
});

/**
 * One-off migration mutation to convert flat strings to multilingual objects
 */
export const migrateToMultilingual = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const products = await ctx.db.query("products").collect();
        let migratedCount = 0;

        for (const product of products) {
            let updates: any = {};
            let hasUpdate = false;

            // Migrate name
            if (typeof product.name === "string") {
                updates.name = { en: product.name, ar: product.name };
                hasUpdate = true;
            }

            // Migrate description
            if (product.description && typeof product.description === "string") {
                updates.description = { en: product.description, ar: product.description };
                hasUpdate = true;
            }

            if (hasUpdate) {
                await ctx.db.patch(product._id, updates);
                migratedCount++;
            }
        }

        return { success: true, migratedCount };
    },
});