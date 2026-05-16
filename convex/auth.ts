import { QueryCtx, MutationCtx } from "./_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function requireAdmin(ctx: Ctx) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        throw new Error("Unauthorized");
    }

    const role =
        (identity.role as string | undefined) ||
        (identity["publicMetadata.role"] as string | undefined) ||
        (identity["metadata.role"] as string | undefined);

    if (role !== "admin") {
        throw new Error("Forbidden");
    }

    return identity;
}