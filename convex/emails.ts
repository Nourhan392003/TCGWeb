"use node";

import { query, mutation, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { internal, api } from "./_generated/api";

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

export const sendNewOrderEmail = internalAction({
    args: {
        orderId: v.id("orders"),
        customerName: v.optional(v.string()),
        customerEmail: v.optional(v.string()),
        totalAmount: v.number(),
        paymobOrderId: v.optional(v.string()),
    },
    handler: async (_ctx, args) => {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: "TCG Vault <onboarding@resend.dev>",
            to: ["hatartcg@gmail.com"],
            subject: `New order received: ${args.orderId}`,
            html: `
        <h2>New order received</h2>
        <p><strong>Order ID:</strong> ${args.orderId}</p>
        <p><strong>Customer Name:</strong> ${args.customerName ?? "N/A"}</p>
        <p><strong>Customer Email:</strong> ${args.customerEmail ?? "N/A"}</p>
        <p><strong>Total Amount:</strong> ${args.totalAmount}</p>
        <p><strong>Paymob Order ID:</strong> ${args.paymobOrderId ?? "N/A"}</p>
      `,
        });

        if (error) {
            console.error("Resend admin email error:", error);
            throw new Error(error.message);
        }

        console.log("Admin notification email sent:", data?.id ?? "ok");
    },
});

export const sendOrderConfirmationEmail = internalAction({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const result = await ctx.runQuery(
            internal.emailData.getOrderForConfirmation,
            { orderId: args.orderId }
        );

        if (!result) {
            throw new Error("Order not found for confirmation email");
        }

        const { order, enrichedItems } = result;

        if (order.confirmationEmailSent) {
            return;
        }

        const shippingFee = order.shippingFee ?? 0;
        const totalAmount = order.totalAmount ?? 0;
        const customerName = order.customerName || "Customer";
        const paymentStatus = order.paymentStatus || "unknown";
        const orderNumber = order.orderReference || String(order._id);

        const address = order.shippingAddress
            ? `${order.shippingAddress.fullName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.phone}`
            : "N/A";

        const productsHtml = enrichedItems
            .map(
                (item: any) => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">
                    ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" width="60" height="60" style="object-fit:cover;border-radius:4px;" />` : "<span>No image</span>"}
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right;">${item.unitPrice.toFixed(2)} SAR</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right;">${item.subtotal.toFixed(2)} SAR</td>
            </tr>
        `
            )
            .join("");

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: "TCG Vault <onboarding@resend.dev>",
            to: [order.customerEmail || "hatartcg@gmail.com"],
            subject: `Order Confirmation - ${orderNumber}`,
            html: `
        <h2>Order Confirmation</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Payment Status:</strong> ${paymentStatus}</p>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <h3>Products</h3>
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr>
                    <th style="text-align:left;">Image</th>
                    <th style="text-align:left;">Product</th>
                    <th style="text-align:center;">Qty</th>
                    <th style="text-align:right;">Unit Price</th>
                    <th style="text-align:right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${productsHtml}
            </tbody>
        </table>
        <p><strong>Shipping Fee:</strong> ${shippingFee.toFixed(2)} SAR</p>
        <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)} SAR</p>
        <p><strong>Shipping Address:</strong> ${address}</p>
      `,
        });

        if (error) {
            console.error("Resend confirmation email error:", error);
            throw new Error(error.message);
        }

        await ctx.runMutation(api.emailData.markConfirmationEmailSent, {
            orderId: args.orderId,
        });

        console.log("Customer confirmation email sent:", data?.id ?? "ok");
    },
});
