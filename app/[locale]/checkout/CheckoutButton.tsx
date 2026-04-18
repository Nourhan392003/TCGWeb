"use client";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutButton() {
    const { items } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);

    const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handlePaymobCheckout = async () => {
        setIsLoading(true);
        try {
            // بيانات وهمية للعميل (لأن Paymob بيطلبها إجباري، تقدر تخلي المستخدم يدخلها في فورم بعدين)
            const dummyBillingData = {
                apartment: "803",
                email: "test@example.com",
                floor: "42",
                first_name: "Mustafa",
                street: "Ethan Land",
                building: "8028",
                phone_number: "+201000000000",
                shipping_method: "PKG",
                postal_code: "01898",
                city: "Jeddah",
                country: "SA",
                last_name: "Sayed",
                state: "Makkah"
            };

            const response = await fetch("/api/paymob", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: totalPrice,
                    billingData: dummyBillingData
                }),
            });

            const data = await response.json();

            if (data.paymentKey) {
                // ده الرابط اللي بيفتح شاشة الدفع الحقيقية
                // متنساش تبدل رقم الـ iframe_id برقمك الحقيقي
                const iframeId = process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID || "YOUR_IFRAME_ID";
                window.location.href = `https://accept.paymobsolutions.com/api/acceptance/iframes/${iframeId}?payment_token=${data.paymentKey}`;
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePaymobCheckout}
            disabled={isLoading || items.length === 0}
            className="w-full bg-yellow-500 text-black py-4 font-bold rounded-xl"
        >
            {isLoading ? "جاري التوجيه للدفع..." : "الدفع بالفيزا (Paymob)"}
        </button>
    );
}
