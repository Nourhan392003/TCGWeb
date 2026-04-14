"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { formatPrice } from "@/utils/currency";

const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
        common: "bg-gray-500",
        uncommon: "bg-green-500",
        rare: "bg-blue-500",
        super_rare: "bg-purple-500",
        ultra_rare: "bg-yellow-500",
        secret_rare: "bg-gradient-to-r from-pink-500 to-purple-500",
        mythic: "bg-red-500",
    };
    return colors[rarity.toLowerCase()] || "bg-gray-500";
};

function CartItemCard({ item }: { item: CartItem }) {
    const { updateQuantity, removeItem } = useCartStore();

    const handleIncrement = () => {
        updateQuantity(item.id, item.quantity + 1);
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        } else {
            removeItem(item.id);
        }
    };

    const handleRemove = () => {
        removeItem(item.id);
    };

    return (
        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-[#12121a]/80 backdrop-blur-lg border border-[#2a2a38] rounded-lg sm:rounded-xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-[#1a1a24] rounded-md sm:rounded-lg overflow-hidden border border-[#2a2a38]">
                <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                        {item.name}
                    </h4>
                    <button
                        onClick={handleRemove}
                        className="p-1 sm:p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>

                <span
                    className={`inline-block px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-white rounded w-fit ${getRarityColor(
                        item.rarity
                    )}`}
                >
                    {item.rarity.replace("_", " ")}
                </span>

                <div className="flex justify-between items-center mt-1.5 sm:mt-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-300">
                        {formatPrice(item.price)}
                    </span>

                    <div className="flex items-center gap-1.5 sm:gap-2 bg-[#1a1a24] rounded-md sm:rounded-lg border border-[#2a2a38]">
                        <button
                            onClick={handleDecrement}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-[#2a2a38] rounded-md sm:rounded-lg transition-all"
                        >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium text-white">
                            {item.quantity}
                        </span>
                        <button
                            onClick={handleIncrement}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-[#2a2a38] rounded-md sm:rounded-lg transition-all"
                        >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmptyCartState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#12121a]/80 backdrop-blur-lg border border-[#2a2a38] rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6 sm:mb-8 text-center max-w-md text-sm sm:text-base">
                Looks like you haven't added any cards to your collection yet.
            </p>
            <Link
                href="/products"
                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm sm:text-base rounded-xl transition-all"
            >
                Continue Shopping
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
        </div>
    );
}

function OrderSummary() {
    const { items, getTotalPrice, clearCart } = useCartStore();

    const subtotal = getTotalPrice();
    const shipping = 0;
    const total = subtotal + shipping;

    const handleClearCart = () => {
        clearCart();
    };

    return (
        <div className="bg-[#12121a]/80 backdrop-blur-lg border border-[#2a2a38] rounded-xl p-4 sm:p-6 sticky top-4">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Order Summary</h3>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Subtotal</span>
                    <span className="text-sm sm:text-base text-white font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Shipping</span>
                    <span className="text-sm text-green-400 font-medium">Free</span>
                </div>
                <div className="border-t border-[#2a2a38] pt-3 sm:pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-white font-bold">Total</span>
                        <span className="text-lg sm:text-xl font-bold text-white">{formatPrice(total)}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
                <button
                    onClick={handleClearCart}
                    disabled={items.length === 0}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-[#2a2a38] text-gray-400 hover:text-red-400 hover:border-red-400/50 font-medium text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Clear Cart
                </button>
                <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-[#F5A524] hover:bg-[#e09420] text-black font-bold text-sm rounded-xl transition-all"
                >
                    Checkout
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
            </div>
        </div>
    );
}

export default function CartPage() {
    const { items } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Shopping Cart</h1>
                    <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                        {items.length === 0
                            ? "Your cart is empty"
                            : `${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
                    </p>
                </div>

                {items.length === 0 ? (
                    <EmptyCartState />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                            {items.map((item) => (
                                <CartItemCard key={item.id} item={item} />
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <OrderSummary />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
