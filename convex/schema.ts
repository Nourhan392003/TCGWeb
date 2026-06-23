import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    products: defineTable({
        name: v.union(
            v.string(),
            v.object({
                en: v.string(),
                ar: v.optional(v.string()),
            })
        ),
        description: v.optional(
            v.union(
                v.string(),
                v.object({
                    en: v.string(),
                    ar: v.optional(v.string()),
                })
            )
        ),
        price: v.number(),
        image: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        imageId: v.optional(v.string()),
        game: v.optional(v.string()),
        condition: v.optional(v.string()),
        isFoil: v.optional(v.boolean()),
        isFirstEdition: v.optional(v.boolean()),
        inStock: v.boolean(),
        stockQuantity: v.optional(v.number()),
        isFeatured: v.optional(v.boolean()),
        isPreorder: v.optional(v.boolean()),
        createdAt: v.optional(v.number()),
        isGraded: v.optional(v.boolean()),
    }).index("by_game", ["game"]),

    orders: defineTable({
        userId: v.string(),
        totalAmount: v.number(),
        status: v.string(),
        shippingFee: v.number(),
        shippingFeeOverride: v.optional(v.number()),
        shippingOverrideReason: v.optional(v.string()),
        shippingOverriddenBy: v.optional(v.string()),
        originalShippingFee: v.optional(v.number()),
        shippingAddress: v.optional(
            v.object({
                fullName: v.string(),
                address: v.string(),
                city: v.string(),
                phone: v.string(),
                postalCode: v.optional(v.string()),
            })
        ),
        shippingCountry: v.optional(v.string()),
        orderReference: v.optional(v.string()),
        paymobOrderId: v.optional(v.string()),
        paymobTransactionId: v.optional(v.string()),
        paymentReference: v.optional(v.string()),
        paymentStatus: v.optional(v.string()),
        paymentProvider: v.optional(v.string()),
        paymentRawPayload: v.optional(v.string()),
        storeItems: v.optional(
            v.array(
                v.object({
                    productId: v.id("products"),
                    name: v.union(
                        v.string(),
                        v.object({
                            en: v.string(),
                            ar: v.optional(v.string()),
                        })
                    ),
                    price: v.number(),
                    quantity: v.number(),
                })
            )
        ),
        stockDecremented: v.optional(v.boolean()),
        couponCode: v.optional(v.string()),
        couponType: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
    })
        .index("by_user", ["userId"])
        .index("by_order_reference", ["orderReference"])
        .index("by_paymob_order_id", ["paymobOrderId"])
        .index("by_payment_reference", ["paymentReference"]),

    promoCodes: defineTable({
        code: v.string(),
        type: v.string(),
        isActive: v.boolean(),
        minOrderAmount: v.optional(v.number()),
        expiresAt: v.optional(v.number()),
        usageLimit: v.optional(v.number()),
        usedCount: v.optional(v.number()),
        createdAt: v.optional(v.number()),
    }).index("by_code", ["code"]),
});