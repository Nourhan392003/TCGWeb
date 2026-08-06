import { internalQuery, internalMutation } from "./_generated/server";
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

type EmailType = "admin_new_order" | "customer_confirmation";
type EmailStatus = "pending" | "sending" | "sent" | "failed";
type EmailNotification = {
    type: EmailType;
    status: EmailStatus;
    sentAt?: number;
    claimId?: string;
};

export const claimEmailSend = internalMutation({
    args: {
        orderId: v.id("orders"),
        emailType: v.union(
            v.literal("admin_new_order"),
            v.literal("customer_confirmation")
        ),
        claimId: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.orderId);
        if (!order) throw new Error("Order not found");

        const notifications = (order.emailNotifications ?? []) as EmailNotification[];

        const existingIndex = notifications.findIndex(
            (n) => n.type === args.emailType
        );

        if (existingIndex !== -1) {
            const existing = notifications[existingIndex];

            if (existing.status === "sent") {
                return { alreadySent: true };
            }

            if (existing.status === "sending") {
                return { alreadySent: true };
            }

            if (existing.status === "failed") {
                const updatedNotifications = [...notifications];
                updatedNotifications[existingIndex] = {
                    type: args.emailType,
                    status: "sending" as const,
                    sentAt: Date.now(),
                    claimId: args.claimId,
                };

                await ctx.db.patch(args.orderId, {
                    emailNotifications: updatedNotifications,
                    updatedAt: Date.now(),
                });

                return { alreadySent: false };
            }

            const updatedNotifications = [...notifications];
            updatedNotifications[existingIndex] = {
                type: args.emailType,
                status: "sending" as const,
                sentAt: Date.now(),
                claimId: args.claimId,
            };

            await ctx.db.patch(args.orderId, {
                emailNotifications: updatedNotifications,
                updatedAt: Date.now(),
            });

            return { alreadySent: false };
        }

        const newNotification: EmailNotification = {
            type: args.emailType,
            status: "sending" as const,
            sentAt: Date.now(),
            claimId: args.claimId,
        };

        await ctx.db.patch(args.orderId, {
            emailNotifications: [...notifications, newNotification],
            updatedAt: Date.now(),
        });

        return { alreadySent: false };
    },
});

export const markEmailSent = internalMutation({
    args: {
        orderId: v.id("orders"),
        emailType: v.union(
            v.literal("admin_new_order"),
            v.literal("customer_confirmation")
        ),
        claimId: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.orderId);
        if (!order) throw new Error("Order not found");

        const notifications = (order.emailNotifications ?? []) as EmailNotification[];

        const updatedNotifications = notifications.map((n) =>
            n.type === args.emailType &&
            n.claimId === args.claimId &&
            n.status === "sending"
                ? { ...n, status: "sent" as const, sentAt: Date.now() }
                : n
        );

        await ctx.db.patch(args.orderId, {
            emailNotifications: updatedNotifications,
            updatedAt: Date.now(),
        });
    },
});

export const markEmailFailed = internalMutation({
    args: {
        orderId: v.id("orders"),
        emailType: v.union(
            v.literal("admin_new_order"),
            v.literal("customer_confirmation")
        ),
        claimId: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.orderId);
        if (!order) throw new Error("Order not found");

        const notifications = (order.emailNotifications ?? []) as EmailNotification[];

        const updatedNotifications = notifications.map((n) =>
            n.type === args.emailType &&
            n.claimId === args.claimId &&
            n.status === "sending"
                ? { ...n, status: "failed" as const }
                : n
        );

        await ctx.db.patch(args.orderId, {
            emailNotifications: updatedNotifications,
            updatedAt: Date.now(),
        });
    },
});
