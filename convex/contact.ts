import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendContactEmail = action({
    args: {
        name: v.string(),
        email: v.string(),
        message: v.string(),
    },
    async handler(ctx, args) {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "TCG Vault <noreply@mail.hatartcg.com>",
                to: "hatartcg@gmail.com",
                subject: `New contact message from ${args.name}`,
                html: `
          <h2>New Contact Form</h2>
          <p><strong>Name:</strong> ${args.name}</p>
          <p><strong>Email:</strong> ${args.email}</p>
          <p><strong>Message:</strong><br>${args.message.replace(/\n/g, "<br>")}</p>
        `,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send email: ${errorText}`);
        }

        return { success: true, message: "Email sent successfully" };
    },
});

export const subscribeNewsletter = action({
    args: {
        email: v.string(),
    },
    async handler(ctx, args) {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "Newsletter <newsletter@mail.hatartcg.com>",
                to: "hatartcg@gmail.com",
                subject: `New Subscriber: ${args.email}`,
                html: `<p>New subscriber joined: <strong>${args.email}</strong></p>`,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to subscribe: ${errorText}`);
        }

        return { success: true, message: "Subscribed successfully" };
    },
});