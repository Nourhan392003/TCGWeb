import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    products: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        price: v.number(),
        image: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        imageId: v.optional(v.string()),

        game: v.optional(v.string()),
        rarity: v.optional(v.string()),
        condition: v.optional(v.string()),
        isFoil: v.optional(v.boolean()),
        isFirstEdition: v.optional(v.boolean()),
        inStock: v.boolean(),
        stockQuantity: v.optional(v.number()),
        isFeatured: v.optional(v.boolean()),
        createdAt: v.optional(v.number()),
        isGraded: v.optional(v.boolean()),

    }).index("by_game", ["game"]),

    orders: defineTable({
        userId: v.string(),
        items: v.array(
            v.object({
                productId: v.optional(v.string()),
                id: v.optional(v.string()),
                quantity: v.number(),
                price: v.number(),
                name: v.string(),
                image: v.optional(v.string()),
                rarity: v.optional(v.string()),
            })
        ),
        totalAmount: v.number(),
        status: v.string(),
        shippingAddress: v.optional(
            v.object({
                fullName: v.string(),
                address: v.string(),
                city: v.string(),
                phone: v.string(),
                postalCode: v.optional(v.string()),
            })
        ),
        paymobOrderId: v.optional(v.string()),
        paymobTransactionId: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_paymob_order", ["paymobOrderId"]),
});