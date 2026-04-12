import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { amount, billingData } = await req.json();

        // 1. Authentication Request (بنجيب الـ Auth Token)
        const authRes = await fetch("https://accept.paymobsolutions.com/api/auth/tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
        });
        const authData = await authRes.json();
        const authToken = authData.token;

        // 2. Order Registration Request (بنسجل الطلب)
        const orderRes = await fetch("https://accept.paymobsolutions.com/api/ecommerce/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                auth_token: authToken,
                delivery_needed: "false",
                amount_cents: Math.round(amount * 100), // السعر بالقروش/هللات
                currency: "SAR", // العملة ريال سعودي
                items: [], // ممكن تبعت المنتجات هنا لو عايز
            }),
        });
        const orderData = await orderRes.json();
        const orderId = orderData.id;

        // 3. Payment Key Request (بنجيب المفتاح اللي هيفتح الـ iframe)
        const paymentRes = await fetch("https://accept.paymobsolutions.com/api/acceptance/payment_keys", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                auth_token: authToken,
                amount_cents: Math.round(amount * 100),
                order_id: orderId,
                payment_methods: ["card"],
                billing_data: billingData, // اسم ورقم تليفون وإيميل العميل (Paymob بيطلبهم إجباري)
                currency: "SAR",
                integration_id: process.env.PAYMOB_INTEGRATION_ID,
            }),
        });
        const paymentData = await paymentRes.json();
        const paymentKey = paymentData.token;

        // بنرجع الـ Token للفرونت إند عشان يفتح الشاشة
        return NextResponse.json({ paymentKey });

    } catch (error) {
        console.error("Paymob Error:", error);
        return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
    }
}
