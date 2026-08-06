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
function getStoreItemName(name: string | { en?: string; ar?: string }) {
  return typeof name === "string" ? name : name?.en || name?.ar || "Product";
}
export default function CheckoutButton() {
  const {
    items,
    freeShipping,
    appliedCoupon,
  } = useCartStore();
  const { user, isLoaded, isSignedIn } = useUser();
  const createOrder = useMutation(api.orders.createOrder);


  const [isLoading, setIsLoading] = useState(false);

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
    ...(item.purchaseOptionType ? { purchaseOptionType: item.purchaseOptionType } : {}),
  }));

  const handlePaymobCheckout = async () => {
    try {
      if (!isLoaded || !isSignedIn || !user) {
        toast.error("يجب تسجيل الدخول أولاً");
        return;
      }

      setIsLoading(true);

      const orderReference = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      const testOrderPayload = {
        userId: user.id,
        totalAmount,
        status: "pending",
        orderReference,
        paymentStatus: "pending",
        paymentProvider: "paymob",
        customerName: user.fullName ?? "Unknown",
        customerEmail: user.primaryEmailAddress?.emailAddress ?? "N/A",
        shippingAddress: {
          fullName: user.fullName || "",
          address: "Riyadh",
          city: "Riyadh",
          phone: user.primaryPhoneNumber?.phoneNumber || "",
          postalCode: "",
        },
        shippingFee,
        stockDecremented: false,
        shippingCountry: "SA",
        storeItems,
      };

      console.log("STEP 1 - before createOrder");
      console.log("STEP 2 - payload:", testOrderPayload);

      const createdOrderId = await createOrder(testOrderPayload);

      console.log("STEP 3 - order created:", createdOrderId);
      toast.success("Order created successfully");
      return;
    } catch (error) {
      console.error("CHECKOUT ERROR FULL:", error);
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الأوردر"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-neutral-900 p-3 text-sm text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} SAR</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className={shippingFee === 0 ? "text-green-400 font-medium" : ""}>
            {shippingFee === 0 ? "Free" : `${shippingFee.toFixed(2)} SAR`}
          </span>
        </div>
        <div className="flex justify-between font-bold text-white border-t border-neutral-700 pt-2">
          <span>Total</span>
          <span>{totalAmount.toFixed(2)} SAR</span>
        </div>
      </div>
      <div className="text-white text-xs">
        items: {items.length} | isLoaded: {String(isLoaded)} | isSignedIn: {String(isSignedIn)}
      </div>

      <button
        onClick={handlePaymobCheckout}
        disabled={isLoading || items.length === 0 || !isLoaded}
        className="w-full bg-yellow-500 text-black py-4 font-bold rounded-xl disabled:opacity-50"
      >
        {isLoading
          ? "جاري التوجيه للدفع..."
          : `إتمام الدفع عبر Paymob - ${totalAmount.toFixed(2)} SAR`}
      </button>

    </div>
  );
}