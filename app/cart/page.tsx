"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { formatPrice } from "@/utils/currency";

/**
 * Rarity badge colors
 */
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

/**
 * Format price to currency - يستخدم الريال السعودي
 * ملاحظة: formatPrice مستورد من @/utils/currency
 */

/**
 * Individual Cart Item Component
 */
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
        <div className="flex gap-4 p-4 bg-[#12121a]/80 backdrop-blur-lg border border-[#2a2a38] rounded-xl">
            {/* Item Image */}
            <div className="w-24 h-24 flex-shrink-0 bg-[#1a1a24] rounded-lg overflow-hidden border border-[#2a2a38]">
                <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">
                        {item.name}
                    </h4>
                    <button
                        onClick={handleRemove}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium text-white rounded w-fit ${getRarityColor(
                        item.rarity
                    )}`}
                >
                    {item.rarity.replace("_", " ")}
                </span>

                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-300">
                        {formatPrice(item.price)}
                    </span>

                    {/* Quantity Controller */}
                    <div className="flex items-center gap-2 bg-[#1a1a24] rounded-lg border border-[#2a2a38]">
                        <button
                            onClick={handleDecrement}
                            className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a38] rounded-lg transition-all"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-white">
                            {item.quantity}
                        </span>
                        <button
                            onClick={handleIncrement}
                            className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a38] rounded-lg transition-all"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Empty Cart State Component
 */
function EmptyCartState() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-[#12121a]/80 backdrop-blur-lg border border-[#2a2a38] rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                Looks like you haven't added any cards to your collection yet.
                Start shopping to build your deck!
            </p>
            <Link
                href="/products"
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all"
            >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
    );
}

/**
 * Order Summary Component
 */
function OrderSummary() {
    const { items, getTotalPrice, clearCart } = useCartStore();

    const subtotal = getTotalPrice();
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    const handleClearCart = () => {
        clearCart();
    };

    return (
        <div className="bg-[#12121a]/80 backdrop-blur-lg border border-[#2a2a38] rounded-xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-green-400 font-medium">Free</span>
                </div>
                <div className="border-t border-[#2a2a38] pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={handleClearCart}
                    disabled={items.length === 0}
                    className="w-full py-3 px-4 border border-[#2a2a38] text-gray-400 hover:text-red-400 hover:border-red-400/50 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Clear Cart
                </button>
                <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#F5A524] hover:bg-[#e09420] text-black font-bold rounded-xl transition-all"
                >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}

/**
 * Main Cart Page Component
 */
export default function CartPage() {
    const { items } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Handle hydration - wait for component to mount before rendering store data
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
                    <p className="text-gray-400 mt-2">
                        {items.length === 0
                            ? "Your cart is empty"
                            : `${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
                    </p>
                </div>

                {items.length === 0 ? (
                    <EmptyCartState />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <CartItemCard key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <OrderSummary />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
