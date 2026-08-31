import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCheckoutProfile = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const userId = identity.subject;

        const profile = await ctx.db
            .query("checkoutProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!profile) {
            return null;
        }

        return {
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            city: profile.city,
            zipCode: profile.zipCode,
        };
    },
});

export const saveCheckoutProfile = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        phone: v.string(),
        address: v.string(),
        city: v.string(),
        zipCode: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const userId = identity.subject;

        const existing = await ctx.db
            .query("checkoutProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        const normalized = {
            firstName: args.firstName.trim(),
            lastName: args.lastName.trim(),
            email: args.email.trim().toLowerCase(),
            phone: args.phone.trim(),
            address: args.address.trim(),
            city: args.city.trim(),
            zipCode: args.zipCode.trim(),
        };

        if (existing) {
            await ctx.db.patch(existing._id, {
                ...normalized,
                updatedAt: Date.now(),
            });
            return existing._id;
        }

        return await ctx.db.insert("checkoutProfiles", {
            userId,
            ...normalized,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});
