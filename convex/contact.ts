import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendContactEmail = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        message: v.string(),
    },
    async handler(ctx, args) {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Contact Form <noreply@tcgweb.com>',
                to: 'hatartcg@gmail.com',
                subject: `New Contact: ${args.name}`,
                html: `
          <h2>New Contact Form</h2>
          <p><strong>Name:</strong> ${args.name}</p>
          <p><strong>Email:</strong> ${args.email}</p>
          <p><strong>Message:</strong><br>${args.message.replace(/\n/g, '<br>')}</p>
        `,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return { success: true };
    },
});

export const subscribeNewsletter = mutation({
    args: {
        email: v.string(),
    },
    async handler(ctx, args) {
        // Here you would normally save to a database or call a service like Mailchimp/Resend
        // For now, we'll simulate a real API call to Resend to log the subscriber
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Newsletter <noreply@tcgweb.com>',
                to: 'hatartcg@gmail.com',
                subject: `New Subscriber: ${args.email}`,
                html: `<p>New subscriber joined: <strong>${args.email}</strong></p>`,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to subscribe');
        }

        return { success: true };
    },
});