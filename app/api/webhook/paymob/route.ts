import { NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
// 1. غيّر دي لـ api بدل internal
import { api } from "../../../../convex/_generated/api";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const paymobOrderId = body.obj?.order?.id;
        const isSuccess = body.obj?.success;
        const newStatus = isSuccess ? "paid" : "failed";

        if (paymobOrderId) {
            await fetchMutation(api.orders.updateOrderStatusByPaymobOrderId, {
                paymobOrderId,
                status: newStatus,
            });
        }

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
