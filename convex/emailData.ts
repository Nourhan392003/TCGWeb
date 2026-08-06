import { internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";

async function resolveImageUrl(ctx: any, product: any) {
    let finalImageUrl = product.imageUrl || product.image || "";

    if (product.imageId) {
        const storageUrl = await ctx.storage.getUrl(product.imageId);
        if (storageUrl) {
            finalImageUrl = storageUrl;
        }
    }

    return finalImageUrl;
}

export const getOrderForConfirmation = internalQuery({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.orderId);
        if (!order) return null;

        const enrichedItems = await Promise.all(
            (order.storeItems ?? []).map(async (item: any) => {
                let imageUrl = "";
                if (item.productId) {
                    const product = await ctx.db.get(item.productId);
                    if (product) {
                        imageUrl = await resolveImageUrl(ctx, product);
                    }
                }
                const unitPrice = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 0;
                const name =
                    typeof item.name === "string"
                        ? item.name
                        : item.name?.en || item.name?.ar || "Product";

                return {
                    name,
                    imageUrl,
                    quantity,
                    unitPrice,
                    subtotal: unitPrice * quantity,
                };
            })
        );

        return {
            order,
            enrichedItems,
        };
    },
});

export const markConfirmationEmailSent = mutation({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.orderId, {
            confirmationEmailSent: true,
            updatedAt: Date.now(),
        });
    },
});
