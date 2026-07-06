"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

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

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "YOUR_EMAIL@example.com",
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
    },
});