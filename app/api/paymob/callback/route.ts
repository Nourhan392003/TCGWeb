import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || "";
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

const convex = new ConvexHttpClient(CONVEX_URL);

function sortObject(obj: Record<string, unknown>) {
    return Object.keys(obj)
        .sort()
        .map((key) => {
            const value = obj[key];
            if (value === null || value === undefined) return "";
            if (typeof value === "object") return JSON.stringify(value);
            return String(value);
        })
        .join("");
}

function verifyHmac(payload: Record<string, unknown>, receivedHmac: string) {
    if (!HMAC_SECRET || !receivedHmac) return false;

    const sortedString = sortObject(payload);
    const calculatedHmac = crypto
        .createHmac("sha512", HMAC_SECRET)
        .update(sortedString)
        .digest("hex");

    return calculatedHmac === receivedHmac;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const receivedHmac =
            body.hmac ||
            body.HMAC ||
            body.obj?.hmac ||
            "";

        const payload = body.obj || body;

        const isVerified = verifyHmac(payload, receivedHmac);

        if (!isVerified) {
            return NextResponse.json(
                { success: false, error: "Invalid HMAC" },
                { status: 401 }
            );
        }

        const isPaid =
            payload.success === true ||
            payload.success === "true" ||
            payload.pending === false;

        const orderReference =
            payload.order?.merchant_order_id ||
            payload.order?.id ||
            payload.id ||
            payload.special_reference ||
            null;

        if (orderReference) {
            await convex.mutation(api.orders.updatePaymentStatus, {
                orderReference: String(orderReference),
                paymentStatus: isPaid ? "paid" : "failed",
                paymentProvider: "paymob",
                rawPayload: JSON.stringify(payload),
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Paymob callback error:", error);
        return NextResponse.json(
            { success: false, error: "Callback handling failed" },
            { status: 500 }
        );
    }
}