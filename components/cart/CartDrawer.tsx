"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

/**
 * Cart Drawer Props
 */
interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

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
 * Format price to currency
 */
const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
};

/**
 * Individual Cart Item Component
 */
function CartItemRow({ item }: { item: CartItem }) {
    const { updateQuantity, removeItem } = useCartStore();

    return (
        <div className="flex gap-4 p-4 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)]">
            {/* Item Image */}
            <div className="w-20 h-20 flex-shrink-0 bg-[var(--color-bg-tertiary)] rounded-md overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {item.name}
                    </h4>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium text-white rounded mt-1 ${getRarityColor(
                        item.rarity
                    )}`}
                >
                    {item.rarity.replace("_", " ")}
                </span>

                <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1.5 bg-[var(--color-bg-tertiary)] rounded-md hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-[var(--color-text-primary)]">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1.5 bg-[var(--color-bg-tertiary)] rounded-md hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-bold text-[var(--color-accent)]">
                        {formatPrice(item.price * item.quantity)}
                    </span>
                </div>
            </div>
        </div>
    );
}

/**
 * Cart Drawer Component
 * Sliding drawer from the right side with cart items
 */
export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { isSignedIn } = useUser();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();


    // Prevent hydration mismatch
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Close drawer on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const totalPrice = getTotalPrice();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 z-40"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--color-bg-primary)] border-l border-[var(--color-border)] z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
                                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                                    Shopping Cart
                                </h2>
                                {isHydrated && items.length > 0 && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-[var(--color-primary)] text-white rounded-full">
                                        {items.reduce(
                                            (acc, item) => acc + item.quantity,
                                            0
                                        )}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {!isHydrated ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <ShoppingBag className="w-16 h-16 text-[var(--color-text-muted)] mb-4" />
                                    <p className="text-[var(--color-text-muted)]">
                                        Your cart is empty
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="mt-4 px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <CartItemRow key={item.id} item={item} />
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {isHydrated && items.length > 0 && (
                            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                                {/* Total */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[var(--color-text-muted)]">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-[var(--color-accent)]">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>


                                {/* Checkout Button */}
                                <button
                                    onClick={() => {
                                        if (!isSignedIn) {
                                            toast.error("Please sign in to checkout");
                                            router.push("/sign-in");
                                        } else {
                                            router.push("/checkout");
                                            onClose();
                                        }
                                    }}
                                    className="w-full block text-center py-4 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                >
                                    Proceed to Checkout
                                </button>


                                {/* Clear Cart */}
                                <button
                                    onClick={clearCart}
                                    className="w-full mt-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
