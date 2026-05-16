"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { getShippingFee } from "@/lib/shipping";

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
    const [freeShipping, setFreeShipping] = useState(false);

    const subtotal = items.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
    );

    const shippingFee = freeShipping ? 0 : getShippingFee();
    const shippingFeeOverride = freeShipping ? 0 : undefined;
    const totalAmount = subtotal + shippingFee;

    const storeItems = items.map((item) => ({
        productId: item.id as Id<"products">,
        name: getItemName(item.name),
        price: Number(item.price),
        quantity: Number(item.quantity),
    }));

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
                totalAmount,
                status: "pending",
                orderReference,
                paymentStatus: "pending",
                paymentProvider: "paymob",
                storeItems,
                shippingAddress: {
                    fullName: user.fullName || "",
                    address: "Riyadh",
                    city: "Riyadh",
                    phone: user.primaryPhoneNumber?.phoneNumber || "",
                    postalCode: "",
                },
                shippingFee,
                shippingFeeOverride,
                shippingOverrideReason: freeShipping
                    ? "manual free shipping"
                    : undefined,
                stockDecremented: false,
                shippingCountry: "SA",
            });

            const response = await fetch("/api/paymob/create-intention", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    locale: "ar",
                    orderReference,
                    customer: {
                        userId: user.id,
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
                        productId: item.id,
                        name: getItemName(item.name),
                        price: Number(item.price),
                        quantity: Number(item.quantity),
                    })),
                    shippingFee,
                    shippingFeeOverride,
                    shippingOverrideReason: freeShipping
                        ? "manual free shipping"
                        : undefined,
                    totalAmount,
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
                    data?.detail ||
                    data?.message ||
                    data?.error ||
                    "Failed to create payment intention"
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
        <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm text-white">
                <input
                    type="checkbox"
                    checked={freeShipping}
                    onChange={(e) => setFreeShipping(e.target.checked)}
                    className="h-4 w-4"
                />
                شحن مجاني لهذا الطلب
            </label>

            <div className="rounded-lg bg-neutral-900 p-3 text-sm text-gray-300 space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingFee.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between font-bold text-white border-t border-neutral-700 pt-2">
                    <span>Total</span>
                    <span>{totalAmount.toFixed(2)} SAR</span>
                </div>
            </div>

            <button
                onClick={handlePaymobCheckout}
                disabled={isLoading || items.length === 0}
                className="w-full bg-yellow-500 text-black py-4 font-bold rounded-xl disabled:opacity-50"
            >
                {isLoading ? "جاري التوجيه للدفع..." : `إتمام الدفع عبر Paymob - ${totalAmount.toFixed(2)} SAR`}
            </button>
        </div>
    );
}