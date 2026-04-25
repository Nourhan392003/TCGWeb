"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
type LocalizedName = {
    en?: string;
    ar?: string;
};

function getItemName(name: string | LocalizedName): string {
    if (typeof name === "string") return name;
    return name.en || name.ar || "Product";
}

export default function CheckoutButton() {
    const { items } = useCartStore();
    const { user } = useUser();
    const createOrder = useMutation(api.orders.createOrder);
    const [isLoading, setIsLoading] = useState(false);

    const totalPrice = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handlePaymobCheckout = async () => {
        if (!user) {
            toast.error("يرجى تسجيل الدخول أولاً");
            return;
        }

        if (items.length === 0) {
            toast.error("السلة فارغة");
            return;
        }

        setIsLoading(true);

        try {
            const orderReference = `order_${Date.now()}_${Math.floor(
                Math.random() * 1000
            )}`;

            await createOrder({
                userId: user.id,
                totalAmount: totalPrice,
                status: "pending",
                orderReference,
                paymentStatus: "pending",
                paymentProvider: "paymob",
                shippingAddress: {
                    fullName: user.fullName || "",
                    address: "Riyadh",
                    city: "Riyadh",
                    phone: user.primaryPhoneNumber?.phoneNumber || "",
                    postalCode: "",
                },
            });

            const response = await fetch("/api/paymob/create-intention", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    locale: "ar",
                    orderReference,
                    customer: {
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        email: user.emailAddresses[0]?.emailAddress || "",
                        phone: user.primaryPhoneNumber?.phoneNumber || "",
                        address: "Riyadh",
                        city: "Riyadh",
                        zipCode: "",
                    },
                    items: items.map((item) => ({
                        id: item.id,
                        name: getItemName(item.name),
                        price: item.price,
                        quantity: item.quantity,
                    })),
                }),
            });

            const text = await response.text();

            let data: any = null;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(`Server returned non-JSON response: ${text.slice(0, 200)}`);
            }

            if (!response.ok) {
                throw new Error(
                    data?.detail || data?.message || data?.error || "Failed to create payment intention"
                );
            }

            if (!data?.checkoutUrl) {
                throw new Error("Missing checkout URL from server");
            }

            window.location.href = data.checkoutUrl;
        } catch (error) {
            console.error("Error during checkout:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "حدث خطأ أثناء التوجيه للدفع"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePaymobCheckout}
            disabled={isLoading || items.length === 0}
            className="w-full bg-yellow-500 text-black py-4 font-bold rounded-xl disabled:opacity-50"
        >
            {isLoading ? "جاري التوجيه للدفع..." : "إتمام الدفع عبر Paymob"}
        </button>
    );
}