"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { internal } from "./_generated/api";
import crypto from "crypto";

export const sendPaymentSuccessEmails = internalAction({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const adminClaimId = crypto.randomUUID();

        const adminClaim = await ctx.runMutation(
            internal.emailData.claimEmailSend,
            {
                orderId: args.orderId,
                emailType: "admin_new_order",
                claimId: adminClaimId,
            }
        );

        if (!adminClaim.alreadySent) {
            try {
                const result = await ctx.runQuery(
                    internal.emailData.getOrderForConfirmation,
                    { orderId: args.orderId }
                );

                if (!result) {
                    await ctx.runMutation(
                        internal.emailData.markEmailFailed,
                        {
                            orderId: args.orderId,
                            emailType: "admin_new_order",
                            claimId: adminClaimId,
                        }
                    );
                    throw new Error("Order not found for admin email");
                }

                const { order } = result;

                const resend = new Resend(process.env.RESEND_API_KEY);

                const { error: adminError } = await resend.emails.send({
                    from: "TCG Vault <onboarding@resend.dev>",
                    to: ["hatartcg@gmail.com"],
                    subject: `New order received: ${order.orderReference || String(order._id)}`,
                    html: `
                        <h2>New order received</h2>
                        <p><strong>Order ID:</strong> ${order.orderReference || String(order._id)}</p>
                        <p><strong>Customer Name:</strong> ${order.customerName || "Customer"}</p>
                        <p><strong>Customer Email:</strong> ${order.customerEmail}</p>
                        <p><strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)} SAR</p>
                        <p><strong>Paymob Order ID:</strong> ${order.paymobOrderId ?? "N/A"}</p>
                    `,
                });

                if (adminError) {
                    console.error("Resend admin email error:", adminError);
                    await ctx.runMutation(
                        internal.emailData.markEmailFailed,
                        {
                            orderId: args.orderId,
                            emailType: "admin_new_order",
                            claimId: adminClaimId,
                        }
                    );
                } else {
                    await ctx.runMutation(
                        internal.emailData.markEmailSent,
                        {
                            orderId: args.orderId,
                            emailType: "admin_new_order",
                            claimId: adminClaimId,
                        }
                    );
                }
            } catch (adminException) {
                console.error("Admin email exception:", adminException);
                await ctx.runMutation(
                    internal.emailData.markEmailFailed,
                    {
                        orderId: args.orderId,
                        emailType: "admin_new_order",
                        claimId: adminClaimId,
                    }
                );
            }
        }

        const customerClaimId = crypto.randomUUID();

        const customerClaim = await ctx.runMutation(
            internal.emailData.claimEmailSend,
            {
                orderId: args.orderId,
                emailType: "customer_confirmation",
                claimId: customerClaimId,
            }
        );

        if (!customerClaim.alreadySent) {
            try {
                const result = await ctx.runQuery(
                    internal.emailData.getOrderForConfirmation,
                    { orderId: args.orderId }
                );

                if (!result) {
                    await ctx.runMutation(
                        internal.emailData.markEmailFailed,
                        {
                            orderId: args.orderId,
                            emailType: "customer_confirmation",
                            claimId: customerClaimId,
                        }
                    );
                    throw new Error("Order not found for customer email");
                }

                const { order, enrichedItems } = result;

                const shippingFee = order.shippingFee ?? 0;
                const totalAmount = order.totalAmount ?? 0;
                const customerName = order.customerName || "Customer";
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

                const { error: customerError } = await resend.emails.send({
                    from: "TCG Vault <onboarding@resend.dev>",
                    to: [order.customerEmail],
                    subject: `Order Confirmation - ${orderNumber}`,
                    html: `
                    <h2>Order Confirmation</h2>
                    <p><strong>Order Number:</strong> ${orderNumber}</p>
                    <p><strong>Payment Status:</strong> ${order.paymentStatus || "paid"}</p>
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

                if (customerError) {
                    console.error("Resend customer email error:", customerError);
                    await ctx.runMutation(
                        internal.emailData.markEmailFailed,
                        {
                            orderId: args.orderId,
                            emailType: "customer_confirmation",
                            claimId: customerClaimId,
                        }
                    );
                } else {
                    await ctx.runMutation(
                        internal.emailData.markEmailSent,
                        {
                            orderId: args.orderId,
                            emailType: "customer_confirmation",
                            claimId: customerClaimId,
                        }
                    );
                }
            } catch (customerException) {
                console.error("Customer email exception:", customerException);
                await ctx.runMutation(
                    internal.emailData.markEmailFailed,
                    {
                        orderId: args.orderId,
                        emailType: "customer_confirmation",
                        claimId: customerClaimId,
                    }
                );
            }
        }
    },
});
