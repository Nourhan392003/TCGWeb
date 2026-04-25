import { NextRequest, NextResponse } from "next/server";
import { createPaymobIntention, getPaymobCheckoutUrl } from "@/lib/paymob";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items = [], customer, orderReference } = body;

        // Ensure real customer data is present as requested (no hardcoded fallbacks for mandatory fields)
        if (!customer?.firstName || !customer?.lastName || !customer?.email || !customer?.phone) {
            return NextResponse.json({
                success: false,
                error: "Missing required customer billing data. Please ensure your profile/checkout form is complete."
            }, { status: 400 });
        }

        const paymobItems = items.map((item: any) => ({
            name: item.name,
            amount: Math.round(item.price * 100),
            quantity: item.quantity,
            description: item.name
        }));

        const totalAmount = paymobItems.reduce((sum: number, item: any) => sum + (item.amount * item.quantity), 0);

        let intention;
        try {
            intention = await createPaymobIntention({
                amount: totalAmount,
                currency: "SAR",
                items: paymobItems,
                billing_data: {
                    first_name: customer.firstName,
                    last_name: customer.lastName,
                    email: customer.email,
                    phone_number: customer.phone,
                    street: customer.address || "Riyadh", // Optional field fallback if needed by Paymob schema
                    city: customer.city || "Riyadh",
                    country: "SA",
                },
                special_reference: orderReference || `order_${Date.now()}`,
            });
        } catch (paymobError: any) {
            console.error("Paymob Intention API Call Failed:", paymobError);
            return NextResponse.json({
                success: false,
                error: paymobError.message
            }, { status: 502 });
        }

        return NextResponse.json({
            success: true,
            checkoutUrl: getPaymobCheckoutUrl(intention.client_secret),
        });
    } catch (error) {
        console.error("Critical API Route Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}