import { query, mutation } from "./_generated/server";
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
    return await ctx.db.insert("promoCodes", {
      ...args,
      code: args.code.trim().toUpperCase(),
      usedCount: 0,
      createdAt: Date.now(),
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
      return { success: true, message: "FREESHIP already exists", id: existing._id };
    }

    const id = await ctx.db.insert("promoCodes", {
      code: "FREESHIP",
      type: "free_shipping",
      isActive: true,
      minOrderAmount: 0,
      usedCount: 0,
      createdAt: Date.now(),
    });

    return { success: true, message: "FREESHIP created", id };
  },
});

export const validateCoupon = query({
  args: {
    code: v.string(),
    subtotal: v.number(),
  },
  handler: async (ctx, args) => {
    const normalizedCode = args.code.trim().toUpperCase();

    const promo = await ctx.db
      .query("promoCodes")
      .withIndex("by_code", (q) => q.eq("code", normalizedCode))
      .first();

    if (!promo || !promo.isActive) {
      return { valid: false, message: "Invalid promo code" };
    }

    if (promo.expiresAt && Date.now() > promo.expiresAt) {
      return { valid: false, message: "Promo code expired" };
    }

    if (
      typeof promo.usageLimit === "number" &&
      (promo.usedCount ?? 0) >= promo.usageLimit
    ) {
      return { valid: false, message: "Promo code usage limit reached" };
    }

    if (
      typeof promo.minOrderAmount === "number" &&
      args.subtotal < promo.minOrderAmount
    ) {
      return {
        valid: false,
        message: `Minimum order amount is ${promo.minOrderAmount} SAR`,
      };
    }

    return {
      valid: true,
      code: promo.code,
      type: promo.type,
      message: "Promo code applied successfully",
    };
  },
});