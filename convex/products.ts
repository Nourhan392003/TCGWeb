import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
        return await ctx.storage.generateUploadUrl();
    },
});

export const updateProductImage = mutation({
    args: {
        productId: v.id("products"),
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
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
        name: v.string(),
        price: v.number(),
        description: v.optional(v.string()),
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
    },
    handler: async (ctx, args) => {
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
        name: v.string(),
        description: v.optional(v.string()),
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
    },
    handler: async (ctx, args) => {
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
        await ctx.db.delete(args.id);
    },
});

export const updateCard = mutation({
    args: {
        id: v.id("products"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
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
        type: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
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
                productId: v.string(),
                name: v.string(),
                price: v.number(),
                quantity: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const newOrderId = await ctx.db.insert("orders", {
            ...args,
            createdAt: Date.now(),
        });
        return newOrderId;
    },
});

export const getProductById = query({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
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
export const getAllProducts = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("products").collect();
    },
});