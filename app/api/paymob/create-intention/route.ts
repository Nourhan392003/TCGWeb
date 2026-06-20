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

        const { items = [], customer, orderReference, couponCode } = body;


        if (
            !customer?.firstName ||
            !customer?.lastName ||
            !customer?.email ||
            !customer?.phone
        ) {
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

        const subtotal = storeItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );

        let freeShipping = false;

        if (typeof couponCode === "string" && couponCode.trim()) {
            try {
                const couponResult = await convex.query(api.promoCodes.validateCoupon, {
                    code: couponCode.trim(),
                    subtotal,
                });

                if (couponResult.valid && couponResult.type === "free_shipping") {
                    freeShipping = true;
                }

                console.log("Coupon validation result ===");
                console.log(JSON.stringify(couponResult, null, 2));

            } catch (couponError) {
                console.error("Coupon validation failed:", couponError);
            }
        }

        const shippingFee = freeShipping ? 0 : SAUDI_DOMESTIC_SHIPPING_FEE;
        const shippingFeeHalalas = Math.round(shippingFee * 100);

        const productPaymobItems = storeItems.map((item: any) => ({
            name: item.name,
            amount: Math.round(item.price * 100),
            quantity: item.quantity,
            description: item.name,
        }));

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



        let intention;
        try {
            intention = await createPaymobIntention(payload);


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



        return NextResponse.json({
            success: true,
            checkoutUrl,
            orderReference: ref,
            paymobClientSecret: intention.client_secret,
            freeShippingApplied: freeShipping,
            shippingFee,
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