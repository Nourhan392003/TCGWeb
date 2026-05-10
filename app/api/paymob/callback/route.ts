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

    // Exclude hmac/HMAC fields from the verification payload —
    // they are not part of the signed content.
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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const receivedHmac =
            body.hmac ||
            body.HMAC ||
            body.obj?.hmac ||
            "";

        const payload = body.obj || body;

        // HMAC verification: validate callback authenticity
        const isHmacValid = verifyHmac(payload, receivedHmac);
        if (!isHmacValid) {
            console.warn("Paymob callback HMAC verification failed", {
                receivedHmac: receivedHmac ? receivedHmac.substring(0, 16) + "..." : "missing",
                hasHmacSecret: !!HMAC_SECRET,
            });
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

        if (!orderReference) {
            console.error("Paymac callback: no orderReference found in payload");
            return NextResponse.json(
                { success: false, error: "No order reference" },
                { status: 400 }
            );
        }

        const paymobOrderId = payload.id || payload.obj?.id || null;

        // Update payment status and store items on the order
        await convex.mutation(api.orders.updatePaymentStatus, {
            orderReference: String(orderReference),
            paymentStatus: isPaid ? "paid" : "failed",
            paymentProvider: "paymob",
            rawPayload: JSON.stringify(payload),
            paymobOrderId: paymobOrderId ? String(paymobOrderId) : undefined,
        });

        // On confirmed payment, finalize the order (decrement stock)
        // This is idempotent — if stockDecremented is already true, it returns early.
        if (isPaid) {
            try {
                const result = await convex.mutation(api.products.finalizeOrder, {
                    orderReference: String(orderReference),
                });
                console.log(`finalizeOrder for ${orderReference}:`, result);
            } catch (finalizeError: any) {
                // Log but do not return error to Paymob — we don't want retries
                // to cause issues. The stockDecremented flag prevents double-decrement.
                console.error(`Error during finalizeOrder for ${orderReference}:`, finalizeError.message);
                return NextResponse.json(
                    { success: false, error: "Finalization failed" },
                    { status: 500 }
                );
            }
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