import type { MutationCtx, QueryCtx } from "./_generated/server";

type Ctx = MutationCtx | QueryCtx;

export async function requireAdmin(ctx: Ctx) {
    const identity = await ctx.auth.getUserIdentity();
    console.log("IDENTITY:", identity);

    if (!identity) {
        throw new Error("Unauthenticated");
    }

    return identity;
}