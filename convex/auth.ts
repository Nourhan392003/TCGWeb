import type { MutationCtx, QueryCtx, ActionCtx } from "./_generated/server";

type Ctx = MutationCtx | QueryCtx | ActionCtx;

export async function requireAdmin(ctx: Ctx) {
    const identity = await ctx.auth.getUserIdentity();

    console.log("IDENTITY", identity);

    if (!identity) {
        throw new Error("Unauthenticated");
    }

    const role =
        (identity as any).role ??
        (identity as any)["metadata.role"] ??
        (identity as any).metadata?.role ??
        (identity as any).publicMetadata?.role ??
        (identity as any).claims?.role ??
        (identity as any).claims?.metadata?.role ??
        (identity as any).claims?.publicMetadata?.role;

    console.log("ROLE", role);

    if (role !== "admin") {
        throw new Error("Unauthorized");
    }

    return identity;
}