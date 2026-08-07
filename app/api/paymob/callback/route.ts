import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const HMAC_SECRET =
    process.env.PAYMOB_HMAC_SECRET || process.env.PAYMOB_HMAC || "";
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

const convex = new ConvexHttpClient(CONVEX_URL);

function paymobStr(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "true" : "false";
    return String(value);
}

function verifyTransactionHmac(obj: Record<string, unknown>, receivedHmac: string): boolean {
    if (!HMAC_SECRET || !receivedHmac) return false;

    const fields: unknown[] = [
        obj.amount_cents,
        obj.created_at,
        obj.currency,
        obj.error_occured,
        obj.has_parent_transaction,
        obj.id,
        obj.integration_id,
        obj.is_3d_secure,
        obj.is_auth,
        obj.is_capture,
        obj.is_refunded,
        obj.is_standalone_payment,
        obj.is_voided,
        typeof obj.order === "object" && obj.order !== null ? (obj.order as any).id : "",
        obj.owner,
        obj.pending,
        typeof obj.source_data === "object" && obj.source_data !== null ? (obj.source_data as any).pan : "",
        typeof obj.source_data === "object" && obj.source_data !== null ? (obj.source_data as any).sub_type : "",
        typeof obj.source_data === "object" && obj.source_data !== null ? (obj.source_data as any).type : "",
        obj.success,
    ];

    const concatenated = fields.map(paymobStr).join("");

    const calculatedHmac = crypto
        .createHmac("sha512", HMAC_SECRET)
        .update(concatenated)
        .digest("hex");

    if (!/^[a-f0-9]{128}$/i.test(receivedHmac)) {
        return false;
    }

    if (calculatedHmac.length !== receivedHmac.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        Buffer.from(calculatedHmac, "hex"),
        Buffer.from(receivedHmac, "hex")
    );
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const receivedHmac = req.nextUrl.searchParams.get("hmac") || "";

        const obj = body.obj || body;

        // HMAC verification: validate callback authenticity
        const isHmacValid = verifyTransactionHmac(obj, receivedHmac);
        if (!isHmacValid) {
            console.warn("Paymob callback HMAC verification failed", {
                hasHmacSecret: !!HMAC_SECRET,
                hasHmac: !!receivedHmac,
            });
            return NextResponse.json(
                { success: false, error: "Invalid HMAC" },
                { status: 401 }
            );
        }

        const isPaid =
            obj.success === true ||
            obj.success === "true";

        const orderReference =
            obj.special_reference ||
            (typeof obj.order === "object" && obj.order !== null ? (obj.order as any).merchant_order_id : null) ||
            null;

        console.log("Paymob callback HMAC", {
            valid: isHmacValid,
            orderReference,
        });

        console.log("Paymob callback received", {
            success: obj.success,
            orderReference,
            hasHmac: !!receivedHmac,
        });

        if (!orderReference) {
            console.error("Paymob callback: no orderReference found in payload");
            return NextResponse.json(
                { success: false, error: "No order reference" },
                { status: 400 }
            );
        }

        const paymobOrderId = obj.id || null;

        console.log("Paymob callback updating payment", {
            orderReference,
            paymentStatus: isPaid ? "paid" : "failed",
            paymobOrderId,
        });

        // Update payment status and store items on the order.
        // updatePaymentStatus handles stock decrement and customer email idempotently.
        await convex.mutation(api.orders.updatePaymentStatus, {
            orderReference: String(orderReference),
            paymentStatus: isPaid ? "paid" : "failed",
            paymentProvider: "paymob",
            rawPayload: JSON.stringify(obj),
            paymobOrderId: paymobOrderId != null ? String(paymobOrderId) : undefined,
        });

        console.log("Paymob callback updated", {
            orderReference,
            paymentStatus: isPaid ? "paid" : "failed",
            paymobOrderId,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Paymob callback error:", error);
        return NextResponse.json(
            { success: false, error: "Callback handling failed" },
            { status: 500 }
        );
    }
}
