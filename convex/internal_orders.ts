import { internalQuery } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const getPurchaseLimitErrors = internalQuery({
    args: {
        userId: v.string(),
        items: v.array(
            v.object({
                productId: v.id("products"),
                quantity: v.number(),
                purchaseOptionType: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, args) => {
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        const paidOrders = orders.filter((o) => o.paymentStatus === "paid");

        const productIds = new Set<string>();
        for (const item of args.items) {
            productIds.add(String(item.productId));
        }

        const products = new Map<string, any>();
        for (const pid of Array.from(productIds)) {
            const product = await ctx.db.get(pid as any);
            if (product) {
                products.set(pid, product);
            }
        }

        const previousTotals = new Map<string, number>();
        for (const order of paidOrders) {
            for (const item of order.storeItems ?? []) {
                const key = String(item.productId);
                const current = previousTotals.get(key) ?? 0;
                previousTotals.set(key, current + (item.quantity ?? 0));
            }
        }

        const errors: Array<{
            productId: string;
            name: string;
            limit: number;
            purchased: number;
            requested: number;
            remaining: number;
        }> = [];

        for (const item of args.items) {
            const product = products.get(String(item.productId));
            if (!product || product.maxPerCustomer === undefined) continue;

            const purchased = previousTotals.get(String(item.productId)) ?? 0;
            const total = purchased + item.quantity;

            if (total > product.maxPerCustomer) {
                const name =
                    typeof product.name === "string"
                        ? product.name
                        : product.name?.en || product.name?.ar || "Product";

                errors.push({
                    productId: String(item.productId),
                    name,
                    limit: product.maxPerCustomer,
                    purchased,
                    requested: item.quantity,
                    remaining: Math.max(0, product.maxPerCustomer - purchased),
                });
            }
        }

        return errors;
    },
});
