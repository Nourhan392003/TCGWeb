import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";
import { internal } from "./_generated/api";

export const getAllOrders = query({
    args: {},
    handler: async (ctx) => {
        const orders = await ctx.db.query("orders").order("desc").collect();

        return await Promise.all(
            orders.map(async (order) => {
                if (!order.storeItems) return order;

                const enrichedItems = await Promise.all(
                    (order.storeItems ?? []).map(async (item) => {
                        if (item.productId) {
                            const product = await ctx.db.get(item.productId);
                            return {
                                ...item,
                                image: product?.imageUrl ?? product?.image ?? null,
                            };
                        }
                        return { ...item, image: null };
                    })
                );

                return { ...order, storeItems: enrichedItems };
            })
        );
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

export const setOrderShippingOverride = mutation({
    args: {
        orderId: v.id("orders"),
        shippingFeeOverride: v.number(),
        shippingOverrideReason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        const currentShippingFee = Math.max(0, order.shippingFee ?? 0);
        const normalizedShippingFee = Math.max(0, args.shippingFeeOverride);
        const currentTotalAmount = order.totalAmount ?? 0;

        const recalculatedTotal =
            currentTotalAmount - currentShippingFee + normalizedShippingFee;

        await ctx.db.patch(args.orderId, {
            shippingFee: normalizedShippingFee,
            shippingFeeOverride: normalizedShippingFee,
            shippingOverrideReason: args.shippingOverrideReason ?? "admin_manual",
            originalShippingFee: order.originalShippingFee ?? currentShippingFee,
            totalAmount: recalculatedTotal,
            updatedAt: Date.now(),
        });

        return {
            success: true,
            previousShippingFee: currentShippingFee,
            newShippingFee: normalizedShippingFee,
            newTotalAmount: recalculatedTotal,
        };
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
                    name: v.union(
                        v.string(),
                        v.object({ en: v.string(), ar: v.optional(v.string()) })
                    ),
                    price: v.number(),
                    quantity: v.number(),
                    purchaseOptionType: v.optional(v.string()),
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
        orderReference: v.optional(v.string()),
        paymobOrderId: v.optional(v.string()),
        paymentStatus: v.union(
            v.literal("pending"),
            v.literal("paid"),
            v.literal("failed")
        ),
        paymentProvider: v.string(),
        rawPayload: v.optional(v.string()),
        paymentReference: v.optional(v.string()),
        storeItems: v.optional(
            v.array(
                v.object({
                    productId: v.id("products"),
                    name: v.union(
                        v.string(),
                        v.object({ en: v.string(), ar: v.optional(v.string()) })
                    ),
                    price: v.number(),
                    quantity: v.number(),
                    purchaseOptionType: v.optional(v.string()),
                })
            )
        ),
    },
    handler: async (ctx, args) => {
        let order;
        if (args.orderReference) {
            order = await ctx.db
                .query("orders")
                .withIndex("by_order_reference", (q) =>
                    q.eq("orderReference", args.orderReference)
                )
                .first();
        } else if (args.paymobOrderId) {
            order = await ctx.db
                .query("orders")
                .withIndex("by_paymob_order_id", (q) =>
                    q.eq("paymobOrderId", args.paymobOrderId)
                )
                .first();
        }

        if (!order) {
            throw new Error(
                `Order not found: ${args.orderReference ?? args.paymobOrderId}`
            );
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

        if (args.paymentStatus === "paid") {
            const freshOrder = await ctx.db.get(order._id);

            if (!freshOrder) {
                throw new Error("Order not found after payment update");
            }

            const items = (freshOrder.storeItems ?? args.storeItems) ?? [];

            if (!items || items.length === 0) {
                if (!freshOrder.confirmationEmailSent) {
                    await ctx.scheduler.runAfter(
                        0,
                        internal.emails.sendOrderConfirmationEmail,
                        { orderId: order._id }
                    );
                }
                return;
            }

            if (!freshOrder.stockDecremented) {
                for (const item of items) {
                    if (!item.productId || !item.quantity) continue;

                    const product = await ctx.db.get(item.productId);
                    if (!product) continue;

                    const currentStock = product.stockQuantity ?? 0;
                    const newStock = Math.max(0, currentStock - item.quantity);

                    await ctx.db.patch(item.productId, {
                        stockQuantity: newStock,
                        inStock: newStock > 0,
                    });
                }

                await ctx.db.patch(order._id, {
                    stockDecremented: true,
                    updatedAt: Date.now(),
                });

                await ctx.scheduler.runAfter(
                    0,
                    internal.emails.sendNewOrderEmail,
                    {
                        orderId: order._id,
                        customerName: freshOrder.customerName,
                        customerEmail: freshOrder.customerEmail,
                        totalAmount: freshOrder.totalAmount,
                        paymobOrderId: freshOrder.paymobOrderId,
                    }
                );
            }

            if (!freshOrder.confirmationEmailSent) {
                await ctx.scheduler.runAfter(
                    0,
                    internal.emails.sendOrderConfirmationEmail,
                    { orderId: order._id }
                );
            }
        }
    },
});
export const createOrder = mutation({
    args: {
        userId: v.string(),
        totalAmount: v.number(),
        status: v.string(),
        shippingFee: v.optional(v.number()),
        shippingFeeOverride: v.optional(v.number()),
        shippingOverrideReason: v.optional(v.string()),
        shippingCountry: v.optional(v.string()),
        customerName: v.optional(v.string()),
        customerEmail: v.optional(v.string()),
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
        couponCode: v.optional(v.string()),
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
                    purchaseOptionType: v.optional(v.string()),
                })
            )
        ),
        stockDecremented: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        console.log("createOrder args:", args);

        const initialShippingFee = args.shippingFee ?? 27;

        const orderId = await ctx.db.insert("orders", {
            userId: args.userId,
            totalAmount: args.totalAmount,
            status: args.status,
            customerName: args.customerName,
            customerEmail: args.customerEmail,
            shippingAddress: args.shippingAddress,
            orderReference: args.orderReference,
            paymobOrderId: args.paymobOrderId,
            paymobTransactionId: args.paymobTransactionId,
            paymentReference: args.paymentReference,
            paymentStatus: args.paymentStatus ?? "pending",
            paymentProvider: args.paymentProvider ?? "paymob",
            paymentRawPayload: args.paymentRawPayload,
            shippingCountry: args.shippingCountry ?? "SA",
            storeItems: args.storeItems,
            stockDecremented: args.stockDecremented ?? false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            shippingFee: initialShippingFee,
            originalShippingFee: initialShippingFee,
            shippingFeeOverride: args.shippingFeeOverride,
            shippingOverrideReason: args.shippingOverrideReason,
            couponCode: args.couponCode,
        });

        console.log("createOrder success orderId:", orderId);

        return orderId;
    }
});

export const getOrderByPaymobOrderId = query({
    args: {
        paymobOrderId: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db
            .query("orders")
            .withIndex("by_paymob_order_id", (q) =>
                q.eq("paymobOrderId", args.paymobOrderId)
            )
            .first();

        return order;
    },
});