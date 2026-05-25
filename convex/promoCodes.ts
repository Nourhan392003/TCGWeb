import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createPromoCode = mutation({
    args: {
        code: v.string(),
        type: v.string(),
        isActive: v.boolean(),
        minOrderAmount: v.optional(v.number()),
        expiresAt: v.optional(v.number()),
        usageLimit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("promoCodes", {
            ...args,
            code: args.code.trim().toUpperCase(),
            usedCount: 0,
        });
    },
});

export const seedFreeShipCode = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db
            .query("promoCodes")
            .withIndex("by_code", (q) => q.eq("code", "FREESHIP"))
            .first();

        if (existing) {
            return { success: true, message: "FREESHIP already exists" };
        }

        await ctx.db.insert("promoCodes", {
            code: "FREESHIP",
            type: "free_shipping",
            isActive: true,
            minOrderAmount: 0,
            usedCount: 0,
        });

        return { success: true, message: "FREESHIP created" };
    },
});