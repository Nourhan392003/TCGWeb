import { NextRequest, NextResponse } from "next/server";
import { createPaymobIntention, getPaymobCheckoutUrl } from "@/lib/paymob";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items = [], customer, orderReference } = body;

        console.log("=== /api/paymob/create-intention incoming body ===");
        console.log(JSON.stringify(body, null, 2));

        if (!customer?.firstName || !customer?.lastName || !customer?.email || !customer?.phone) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required customer billing data. Please ensure your profile/checkout form is complete.",
                },
                { status: 400 }
            );
        }

        const paymobItems = items.map((item: any) => ({
            name: item.name,
            amount: Math.round(item.price * 100),
            quantity: item.quantity,
            description: item.name,
        }));

        const totalAmount = paymobItems.reduce(
            (sum: number, item: any) => sum + item.amount * item.quantity,
            0
        );

        const payload = {
            amount: totalAmount,
            currency: "SAR",
            items: paymobItems,
            billing_data: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                email: customer.email,
                phone_number: customer.phone,
                street: customer.address || "Riyadh",
                city: customer.city || "Riyadh",
                country: "SA",
            },
            special_reference: orderReference || `order_${Date.now()}`,
        };

        console.log("=== Paymob intention payload ===");
        console.log(JSON.stringify(payload, null, 2));

        let intention;
        try {
            intention = await createPaymobIntention(payload);

            console.log("=== Paymob intention raw response ===");
            console.log(JSON.stringify(intention, null, 2));
        } catch (paymobError: any) {
            console.error("Paymob Intention API Call Failed:");
            console.error(paymobError);

            return NextResponse.json(
                {
                    success: false,
                    error: paymobError?.message || "Paymob intention request failed",
                },
                { status: 502 }
            );
        }

        if (!intention) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Paymob returned empty intention response",
                },
                { status: 502 }
            );
        }

        if (!intention.client_secret) {
            console.error("Paymob intention missing client_secret:", intention);

            return NextResponse.json(
                {
                    success: false,
                    error: "Paymob response missing client_secret",
                    paymobResponse: intention,
                },
                { status: 502 }
            );
        }

        const checkoutUrl = getPaymobCheckoutUrl(intention.client_secret);

        console.log("=== Generated checkout URL ===");
        console.log(checkoutUrl);

        return NextResponse.json({
            success: true,
            checkoutUrl,
            orderReference: payload.special_reference,
            paymobClientSecret: intention.client_secret,
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