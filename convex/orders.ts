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
        });
    },
});
export const updateOrderStatusByPaymobOrderId = mutation({
    args: {
        paymobOrderId: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db
            .query("orders")
            .filter((q) => q.eq(q.field("paymobOrderId"), args.paymobOrderId))
            .first();

        if (!order) {
            throw new Error("Order not found");
        }

        await ctx.db.patch(order._id, {
            status: args.status,
        });
    },
});