import { query, mutation, action, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";
import { internal, api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

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
                console.error(
                    `Order ${order._id} has no storeItems; skipping stock deduction and email`
                );
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
                    internal.emails.sendPaymentSuccessEmails,
                    { orderId: order._id }
                );
            }

            // Customer + admin emails are handled by sendPaymentSuccessEmails
        }
    },
});
export const createOrder = mutation({
    args: {
        userId: v.string(),
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
                    price: v.optional(v.number()),
                    quantity: v.number(),
                    purchaseOptionType: v.optional(v.string()),
                })
            )
        ),
        stockDecremented: v.optional(v.boolean()),
        validatedPrices: v.optional(v.record(v.string(), v.number())),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("You must be signed in to checkout");
        }

        if (args.userId !== identity.subject) {
            throw new Error("Unauthorized: user ID does not match authenticated user");
        }

        const items = args.storeItems ?? [];
        const validatedPrices = args.validatedPrices ?? {};
        let serverCalculatedTotal = 0;
        const enrichedItems: Array<{
            productId: Id<"products">;
            name: string;
            price: number;
            quantity: number;
            purchaseOptionType?: string;
        }> = [];

        const purchaseLimitErrors: Array<{
            productId: string;
            name: string;
            limit: number;
            purchased: number;
            requested: number;
            remaining: number;
        }> = await ctx.runQuery(
            internal.internal_orders.getPurchaseLimitErrors,
            {
                userId: args.userId,
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    purchaseOptionType: item.purchaseOptionType,
                })),
            }
        );

        if (purchaseLimitErrors.length > 0) {
            const messages = purchaseLimitErrors
                .map(
                    (e: any) =>
                        `Purchase limit exceeded for ${e.name}: limit ${e.limit}, already purchased ${e.purchased}, requested ${e.requested}`
                )
                .join("; ");
            throw new Error(messages);
        }

        for (const item of items) {
            const product = await ctx.db.get(item.productId);
            if (!product) {
                throw new Error(`Product not found during order creation: ${item.productId}`);
            }

            let effectivePrice = item.price ?? validatedPrices[String(item.productId)];
            let effectiveStockQuantity = product.stockQuantity;

            if (item.purchaseOptionType && Array.isArray(product.purchaseOptions)) {
                const option = product.purchaseOptions.find(
                    (o: { type: string; price: number; stockQuantity?: number }) => o.type === item.purchaseOptionType
                );
                if (option) {
                    effectivePrice = effectivePrice ?? option.price;
                    effectiveStockQuantity = option.stockQuantity ?? product.stockQuantity;
                }
            }

            if (effectivePrice === undefined || effectivePrice === null) {
                effectivePrice = product.price;
            }

            if (effectiveStockQuantity !== undefined && item.quantity > effectiveStockQuantity) {
                throw new Error(`Insufficient stock for product ${String(item.productId)}: requested ${item.quantity}, available ${effectiveStockQuantity}`);
            }

            const itemTotal = effectivePrice * item.quantity;
            serverCalculatedTotal += itemTotal;

            const localizedName =
                typeof product.name === "string"
                    ? product.name
                    : product.name?.en || product.name?.ar || "Product";

            enrichedItems.push({
                productId: product._id,
                name: localizedName,
                price: effectivePrice,
                quantity: item.quantity,
                purchaseOptionType: item.purchaseOptionType,
            });
        }

        const initialShippingFee = args.shippingFee ?? 27;
        const finalTotal = serverCalculatedTotal + initialShippingFee;

        const orderId = await ctx.db.insert("orders", {
            userId: args.userId,
            totalAmount: finalTotal,
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
            storeItems: enrichedItems,
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

export const validateCheckout = action({
    args: {
        items: v.array(
            v.object({
                productId: v.id("products"),
                quantity: v.number(),
                purchaseOptionType: v.optional(v.string()),
            })
        ),
        couponCode: v.optional(v.string()),
        shippingCountry: v.optional(v.string()),
    },
    handler: async (ctx, args): Promise<{
        items: Array<{
            productId: Id<"products">;
            name: string;
            price: number;
            quantity: number;
            purchaseOptionType?: string;
        }>;
        subtotal: number;
        shippingFee: number;
        totalAmount: number;
        freeShipping: boolean;
        priceChanges: Array<{
            productId: string;
            oldPrice: number;
            newPrice: number;
            name?: string;
        }>;
        unavailableItems: Array<{
            productId: string;
            reason: string;
            name?: string;
        }>;
        hasError: boolean;
        purchaseLimitErrors: Array<{
            productId: string;
            name: string;
            limit: number;
            purchased: number;
            requested: number;
            remaining: number;
        }>;
    }> => {
        const { items, couponCode, shippingCountry } = args;

        if (!items || items.length === 0) {
            throw new Error("Cart is empty");
        }

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("You must be signed in to checkout");
        }

        const products = await ctx.runQuery(api.products.getAllProducts, {});
        const productMap = new Map<string, any>(products.map((p: any) => [String(p._id), p]));

        const validatedItems: Array<{
            productId: Id<"products">;
            name: string;
            price: number;
            quantity: number;
            purchaseOptionType?: string;
        }> = [];
        const priceChanges: Array<{
            productId: string;
            oldPrice: number;
            newPrice: number;
            name?: string;
        }> = [];
        const unavailableItems: Array<{
            productId: string;
            reason: string;
            name?: string;
        }> = [];
        let subtotal = 0;
        let hasError = false;

        for (const item of items) {
            const product = productMap.get(String(item.productId));

            if (!product) {
                unavailableItems.push({
                    productId: item.productId,
                    reason: "deleted",
                    name: item.productId,
                });
                hasError = true;
                continue;
            }

            const localizedName =
                typeof product.name === "string"
                    ? product.name
                    : product.name?.en || product.name?.ar || "Product";

            let effectivePrice = product.price;
            let effectiveStockQuantity = product.stockQuantity;
            let effectiveInStock = product.inStock;

            if (item.purchaseOptionType && Array.isArray(product.purchaseOptions)) {
                const option = product.purchaseOptions.find(
                    (o: any) => o.type === item.purchaseOptionType
                );

                if (!option) {
                    unavailableItems.push({
                        productId: item.productId,
                        reason: "option_not_found",
                        name: localizedName,
                    });
                    hasError = true;
                    continue;
                }

                effectivePrice = option.price;
                effectiveInStock = option.inStock ?? product.inStock;
                effectiveStockQuantity = option.stockQuantity ?? product.stockQuantity;
            }

            if (!effectiveInStock) {
                unavailableItems.push({
                    productId: item.productId,
                    reason: "out_of_stock",
                    name: localizedName,
                });
                hasError = true;
            } else if (
                effectiveStockQuantity !== undefined &&
                item.quantity > effectiveStockQuantity
            ) {
                unavailableItems.push({
                    productId: item.productId,
                    reason: "insufficient_stock",
                    name: localizedName,
                });
                hasError = true;
            }

            if (item.quantity <= 0) {
                unavailableItems.push({
                    productId: item.productId,
                    reason: "invalid_quantity",
                    name: localizedName,
                });
                hasError = true;
            }

            const itemTotal = effectivePrice * item.quantity;
            subtotal += itemTotal;

            validatedItems.push({
                productId: product._id,
                name: localizedName,
                price: effectivePrice,
                quantity: item.quantity,
                purchaseOptionType: item.purchaseOptionType,
            });
        }

        let freeShipping = false;

        if (typeof couponCode === "string" && couponCode.trim() && !hasError) {
            try {
                const couponResult = await ctx.runQuery(api.promoCodes.validateCoupon, {
                    code: couponCode.trim(),
                    subtotal,
                });

                if (couponResult.valid && couponResult.type === "free_shipping") {
                    freeShipping = true;
                }
            } catch (couponError) {
                console.error("Coupon validation failed in validateCheckout:", couponError);
            }
        }

        const purchaseLimitErrors = await ctx.runQuery(
            internal.internal_orders.getPurchaseLimitErrors,
            {
                userId: identity.subject,
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    purchaseOptionType: item.purchaseOptionType,
                })),
            }
        );

        if (purchaseLimitErrors.length > 0) {
            hasError = true;
        }

        const shippingFee = freeShipping ? 0 : 27;
        const totalAmount = subtotal + shippingFee;

        return {
            items: validatedItems,
            subtotal,
            shippingFee,
            totalAmount,
            freeShipping,
            priceChanges,
            unavailableItems,
            hasError,
            purchaseLimitErrors,
        };
    },
});