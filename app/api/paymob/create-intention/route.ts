import { NextRequest, NextResponse } from "next/server";
import { createPaymobIntention, getPaymobCheckoutUrl } from "@/lib/paymob";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const SAUDI_DOMESTIC_SHIPPING_FEE = 27;

const convex = new ConvexHttpClient(
    process.env.NEXT_PUBLIC_CONVEX_URL || ""
);

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
                    error:
                        "Missing required customer billing data. Please ensure your profile/checkout form is complete.",
                },
                { status: 400 }
            );
        }

        const storeItems = items.map((item: any) => ({
            productId: item.productId || item.id || "",
            name: item.name || "Unknown",
            price: Number(item.price),
            quantity: Number(item.quantity),
        }));

        const productPaymobItems = storeItems.map((item: any) => ({
            name: item.name,
            amount: Math.round(item.price * 100),
            quantity: item.quantity,
            description: item.name,
        }));
        const requestedShippingOverride =
            typeof body.shippingFeeOverride === "number"
                ? body.shippingFeeOverride
                : undefined;

        const shippingOverrideReason =
            typeof body.shippingOverrideReason === "string"
                ? body.shippingOverrideReason
                : undefined;

        const shippingFee =
            typeof requestedShippingOverride === "number"
                ? Math.max(0, requestedShippingOverride)
                : SAUDI_DOMESTIC_SHIPPING_FEE;

        const shippingFeeHalalas = Math.round(shippingFee * 100);

        const shippingPaymobItem =
            shippingFee > 0
                ? {
                    name: "Domestic Shipping",
                    amount: shippingFeeHalalas,
                    quantity: 1,
                    description: "Shipping داخل المملكة",
                }
                : null;
        const paymobItems = shippingPaymobItem
            ? [...productPaymobItems, shippingPaymobItem]
            : productPaymobItems;

        const totalAmount = paymobItems.reduce(
            (sum: number, item: any) => sum + item.amount * item.quantity,
            0
        );

        const ref = orderReference || `tcg-${Date.now()}`;

        try {
            await convex.mutation(api.orders.createOrder, {
                userId: customer.userId || "",
                totalAmount: totalAmount / 100,
                status: "pending",
                storeItems,
                orderReference: ref,
                paymentStatus: "pending",
                paymentProvider: "paymob",
                shippingFee,
                shippingCountry: "SA",
                shippingFeeOverride: requestedShippingOverride,
                shippingOverrideReason,
                stockDecremented: false,
            });
            console.log(`Preliminary order created with reference: ${ref}`);
        } catch (orderError: any) {
            console.error("Failed to create preliminary order:", orderError.message);
        }

        console.log("Products only items ===");
        console.log(JSON.stringify(productPaymobItems, null, 2));
        console.log("Requested shipping override:", requestedShippingOverride);
        console.log("Shipping override reason:", shippingOverrideReason);
        console.log("Applied shipping fee (halalas):", shippingFeeHalalas);
        console.log("Shipping fee (SAR):", shippingFee);

        console.log("Final Paymob items ===");
        console.log(JSON.stringify(paymobItems, null, 2));

        console.log("Final total (halalas):", totalAmount);

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
            special_reference: ref,
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
            orderReference: ref,
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