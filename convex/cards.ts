import { query } from "./_generated/server";
import { v } from "convex/values";

export const getFeaturedCards = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("products")
            .filter((q) => q.eq(q.field("isFeatured"), true))
            .order("desc")
            .take(8);
    },
});

export const getById = query({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("products").order("desc").collect();
    },
});

export const getByGame = query({
    args: { game: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("products")
            .withIndex("by_game", (q) => q.eq("game", args.game))
            .order("desc")
            .collect();
    },
});
