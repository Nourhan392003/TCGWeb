"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useRouter, Link } from "@/i18n/navigation";
import { useAuthAction } from "@/hooks/useAuthAction";
import toast from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import { formatPriceByLocale } from "@/utils/currency";
import { getLocalizedContent } from "@/utils/localization";

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
 * Individual Cart Item Component
 */
function CartItemRow({ item }: { item: CartItem }) {
    const { updateQuantity, removeItem } = useCartStore();
    const locale = useLocale();
    const localizedName = getLocalizedContent(item.name, locale);

    return (
        <div className="flex gap-4 p-4 bg-[#1a1a24] rounded-lg border border-white/10">
            {/* Item Image */}
            <div className="w-20 h-20 flex-shrink-0 bg-black/20 rounded-md overflow-hidden">
                <img
                    src={item.image}
                    alt={localizedName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-medium text-white truncate">
                        {localizedName}
                    </h4>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-medium text-white rounded mt-1 ${getRarityColor(
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
                            className="p-1.5 bg-white/5 rounded-md hover:bg-amber-500 hover:text-black transition-colors"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-white">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1.5 bg-white/5 rounded-md hover:bg-amber-500 hover:text-black transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-bold text-amber-400">
                        {formatPriceByLocale(item.price * item.quantity, locale)}
                    </span>
                </div>
            </div>
        </div>
    );
}

/**
 * Cart Drawer Component
 */
export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const t = useTranslations('Cart');
    const tActions = useTranslations('Actions');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const { checkAuth } = useAuthAction();
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
                        className="fixed inset-0 bg-black/60 z-[60]"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: isRTL ? "-100%" : "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: isRTL ? "-100%" : "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`fixed ${isRTL ? 'left-0' : 'right-0'} top-0 h-full w-full max-w-md bg-[#0a0a0f] border-l border-white/10 z-[70] flex flex-col`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-amber-400" />
                                <h2 className="text-lg font-semibold text-white">
                                    {t('title')}
                                </h2>
                                {isHydrated && items.length > 0 && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-amber-500 text-black rounded-full">
                                        {items.reduce(
                                            (acc, item) => acc + item.quantity,
                                            0
                                        )}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {!isHydrated ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                                    <p className="text-gray-400 font-medium">
                                        {t('empty')}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {t('emptyDesc')}
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="mt-6 px-6 py-2 text-sm font-bold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 rounded-full transition-all"
                                    >
                                        {t('continueShopping')}
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
                            <div className="p-6 border-t border-white/10 bg-black/40">
                                {/* Total */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-gray-400 font-medium">
                                        {t('total')}
                                    </span>
                                    <span className="text-2xl font-bold text-amber-400">
                                        {formatPriceByLocale(totalPrice, locale)}
                                    </span>
                                </div>


                                {/* Checkout Button */}
                                <button
                                    onClick={() => {
                                        checkAuth(() => {
                                            router.push("/checkout");
                                            onClose();
                                        }, undefined, "/checkout");
                                    }}
                                    className="w-full block text-center py-4 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold uppercase tracking-widest rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    {tActions('checkout')}
                                </button>


                                {/* Clear Cart */}
                                <button
                                    onClick={clearCart}
                                    className="w-full mt-4 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest font-bold"
                                >
                                    {t('clearCart')}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
