import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllOrders = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("orders").order("desc").collect();
    },
});

export const getUserOrders = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

export const updateOrderStatus = mutation({
    args: {
        id: v.id("orders"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            status: args.status,
            updatedAt: Date.now(),
        });
    },
});

export const updateOrderStatusByPaymobOrderId = mutation({
    args: {
        paymobOrderId: v.string(),
        status: v.string(),
        storeItems: v.optional(
            v.array(
                v.object({
                    productId: v.id("products"),
                    name: v.union(v.string(), v.object({ en: v.string(), ar: v.optional(v.string()) })),
                    price: v.number(),
                    quantity: v.number(),
                })
            )
        ),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db
            .query("orders")
            .withIndex("by_paymob_order_id", (q) =>
                q.eq("paymobOrderId", args.paymobOrderId)
            )
            .first();

        if (!order) {
            throw new Error("Order not found");
        }

        const updateFields: Record<string, unknown> = {
            status: args.status,
            updatedAt: Date.now(),
        };

        if (args.storeItems) {
            updateFields.storeItems = args.storeItems;
        }

        await ctx.db.patch(order._id, updateFields);
    },
});

export const updatePaymentStatus = mutation({
    args: {
        orderReference: v.string(),
        paymentStatus: v.union(
            v.literal("pending"),
            v.literal("paid"),
            v.literal("failed")
        ),
        paymentProvider: v.string(),
        rawPayload: v.optional(v.string()),
        paymobOrderId: v.optional(v.string()),
        paymentReference: v.optional(v.string()),
        storeItems: v.optional(
            v.array(
                v.object({
                    productId: v.id("products"),
                    name: v.union(v.string(), v.object({ en: v.string(), ar: v.optional(v.string()) })),
                    price: v.number(),
                    quantity: v.number(),
                })
            )
        ),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db
            .query("orders")
            .withIndex("by_order_reference", (q) =>
                q.eq("orderReference", args.orderReference)
            )
            .first();

        if (!order) {
            throw new Error(`Order not found: ${args.orderReference}`);
        }

        const updateFields: Record<string, unknown> = {
            paymentStatus: args.paymentStatus,
            paymentProvider: args.paymentProvider,
            paymentRawPayload: args.rawPayload,
            paymobOrderId: args.paymobOrderId ?? order.paymobOrderId,
            paymentReference: args.paymentReference ?? order.paymentReference,
            status: args.paymentStatus === "paid" ? "paid" : order.status,
            updatedAt: Date.now(),
        };

        if (args.storeItems) {
            updateFields.storeItems = args.storeItems;
        }

        await ctx.db.patch(order._id, updateFields);
    },
});
export const createOrder = mutation({
    args: {
        userId: v.string(),
        totalAmount: v.number(),
        status: v.string(),
        shippingFee: v.optional(v.number()),
        shippingCountry: v.optional(v.string()),
        shippingAddress: v.optional(
            v.object({
                fullName: v.string(),
                address: v.string(),
                city: v.string(),
                phone: v.string(),
                postalCode: v.optional(v.string()),
            })
        ),

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
                    name: v.union(v.string(), v.object({ en: v.string(), ar: v.optional(v.string()) })),
                    price: v.number(),
                    quantity: v.number(),
                })
            )
        ),
        stockDecremented: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const orderId = await ctx.db.insert("orders", {
            userId: args.userId,
            totalAmount: args.totalAmount,
            status: args.status,
            shippingAddress: args.shippingAddress,
            orderReference: args.orderReference,
            paymobOrderId: args.paymobOrderId,
            paymobTransactionId: args.paymobTransactionId,
            paymentReference: args.paymentReference,
            paymentStatus: args.paymentStatus ?? "pending",
            paymentProvider: args.paymentProvider ?? "paymob",
            paymentRawPayload: args.paymentRawPayload,
            shippingFee: args.shippingFee ?? 0,
            shippingCountry: args.shippingCountry ?? "SA",
            storeItems: args.storeItems,
            stockDecremented: args.stockDecremented ?? false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return orderId;
    },
});