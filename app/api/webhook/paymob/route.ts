import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

const HMAC_SECRET =
    process.env.PAYMOB_HMAC_SECRET || process.env.PAYMOB_HMAC || "";

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

    const cleanPayload: Record<string, unknown> = {};
    for (const key of Object.keys(payload)) {
        if (key.toLowerCase() === "hmac") continue;
        cleanPayload[key] = payload[key];
    }

    const sortedString = sortObject(cleanPayload);
    const calculatedHmac = crypto
        .createHmac("sha512", HMAC_SECRET)
        .update(sortedString)
        .digest("hex");

    return calculatedHmac === receivedHmac;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const receivedHmac =
            request.nextUrl.searchParams.get("hmac") ||
            body.hmac ||
            body.HMAC ||
            body.obj?.hmac ||
            "";

        const payload = body.obj || body;

        const isHmacValid = verifyHmac(payload, receivedHmac);
        if (!isHmacValid) {
            console.warn("Paymob webhook HMAC verification failed", {
                receivedHmac: receivedHmac ? receivedHmac.substring(0, 16) + "..." : "missing",
                hasHmacSecret: !!HMAC_SECRET,
            });
            return NextResponse.json(
                { success: false, error: "Invalid HMAC" },
                { status: 401 }
            );
        }

        const isSuccess =
            payload.success === true || payload.success === "true";
        const paymentStatus = isSuccess ? "paid" : "failed";

        const paymobOrderId = payload.id || payload.obj?.id || null;
        const orderReference =
            payload.special_reference ||
            payload.order?.merchant_order_id ||
            null;

        if (paymobOrderId) {
            await fetchMutation(api.orders.updatePaymentStatus, {
                paymobOrderId,
                paymentStatus,
                paymentProvider: "paymob",
                orderReference: orderReference || undefined,
                rawPayload: JSON.stringify(payload),
            });
        } else if (orderReference) {
            await fetchMutation(api.orders.updatePaymentStatus, {
                orderReference,
                paymentStatus,
                paymentProvider: "paymob",
                rawPayload: JSON.stringify(payload),
            });
        }

        // Note: stock finalization and emails are handled by the primary callback
        // at /api/paymob/callback to avoid double-processing.

        return NextResponse.json(
            { message: "Webhook processed" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing Paymob webhook:", error);
        return NextResponse.json(
            { message: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
