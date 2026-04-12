"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import {
    CreditCard,
    ShieldCheck,
    Lock,
    ChevronLeft,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatPrice } from "@/utils/currency";

interface CheckoutFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
}

const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
        common: "bg-gray-500",
        uncommon: "bg-green-500",
        rare: "bg-blue-500",
        super_rare: "bg-purple-500",
        ultra_rare: "bg-yellow-500",
        secret_rare: "bg-gradient-to-r from-pink-500 to-purple-500",
        mythic: "bg-red-500"
    };
    return colors[rarity?.toLowerCase()] || "bg-gray-500";
};

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const router = useRouter();
    const createOrder = useMutation(api.products.createOrder); const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");
    const [formData, setFormData] = useState<CheckoutFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalPrice = getTotalPrice();
    const shipping = 0; // Free shipping
    const grandTotal = totalPrice + shipping;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.phone ||
            !formData.address ||
            !formData.city ||
            !formData.zipCode
        ) {
            toast.error("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        try {
            const orderId = await createOrder({
                userId: formData.email, // مؤقتاً بنحط الإيميل كـ userId لحد ما نربط بـ Clerk id
                totalAmount: grandTotal,
                status: "pending",
                shippingAddress: {
                    fullName: `${formData.firstName} ${formData.lastName}`,
                    address: formData.address,
                    city: formData.city,
                    phone: formData.phone,
                    postalCode: formData.zipCode,
                },
                items: items.map((item) => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            });

            setOrderNumber(orderId);
            clearCart();
            setIsSuccess(true);
            toast.success("Order placed successfully!");
        } catch (error) {
            console.error("Order error:", error);
            toast.error("Failed to place order. Please check console.");
        } finally {
            setIsLoading(false);
        }
    };
    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 bg-[#1a1a24] rounded-full"></div>
                    <div className="mt-4 h-4 w-32 bg-[#1a1a24] rounded"></div>
                </div>
            </div>
        );
    }

    // Success State
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-[#12121a]/80 backdrop-blur-xl border border-[#2a2a38] rounded-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#f0f0f5] mb-2">Order Confirmed!</h1>
                        <p className="text-[#a0a0b0] mb-6">
                            Thank you for your purchase. We'll send you a confirmation email shortly.
                        </p>
                        <div className="bg-[#1a1a24] rounded-lg p-4 mb-6">
                            <p className="text-sm text-[#6a6a7a] mb-1">Order Number</p>
                            <p className="text-lg font-mono font-semibold text-[#ffd700]">{orderNumber}</p>
                        </div>
                        <Link
                            href="/products"
                            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" /> Continue Shopping
                        </Link>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Header */}
            <div className="border-b border-[#2a2a38] bg-[#12121a]/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="p-2 bg-gradient-to-r from-[#eab308] to-[#ca8a04] rounded-lg group-hover:scale-105 transition-transform">
                                <CreditCard className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-xl font-bold text-[#f0f0f5]">TCG Vault</span>
                        </Link>
                        <div className="flex items-center gap-2 text-[#4a4a5a]">
                            <Lock className="w-4 h-4" />
                            <span className="text-sm">Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Link */}
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-[#a0a0b0] hover:text-[#f0f0f5] transition-colors mb-6"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Cart</span>
                </Link>

                <h1 className="text-3xl font-bold text-[#f0f0f5] mb-8">Checkout</h1>

                {items.length === 0 ? (
                    <div className="text-center py-16 bg-[#12121a]/50 backdrop-blur-xl rounded-2xl border border-[#2a2a38]">
                        <CreditCard className="w-16 h-16 text-[#4a4a5a] mx-auto mb-4" />
                        <p className="text-[#a0a0b0] mb-4">Your cart is empty</p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-[#eab308] to-[#ca8a04] text-black font-medium rounded-lg hover:from-[#facc15] hover:to-[#eab308] transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Billing & Shipping Form */}
                        <div className="order-2 lg:order-1">
                            <form onSubmit={handlePlaceOrder} className="space-y-6">
                                {/* Billing & Shipping Details */}
                                <div className="bg-[#12121a]/80 backdrop-blur-xl border border-[#2a2a38] rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <ShieldCheck className="w-5 h-5 text-[#eab308]" />
                                        <h2 className="text-xl font-semibold text-[#f0f0f5]">Billing & Shipping</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#a0a0b0] mb-2">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#a0a0b0] mb-2">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all"
                                                placeholder="Doe"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-[#a0a0b0] mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-[#a0a0b0] mb-2">
                                                Phone <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all"
                                                placeholder="+1234567890"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-[#a0a0b0] mb-2">
                                                Shipping Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all"
                                                placeholder="123 Main Street, Apt 4"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#a0a0b0] mb-2">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all"
                                                placeholder="New York"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#a0a0b0] mb-2">
                                                Zip Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all"
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-[#12121a]/80 backdrop-blur-xl border border-[#2a2a38] rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <CreditCard className="w-5 h-5 text-[#eab308]" />
                                        <h2 className="text-xl font-semibold text-[#f0f0f5]">Payment Method</h2>
                                    </div>

                                    {/* Mock Selected Credit Card */}
                                    <div className="bg-gradient-to-r from-[#1a1a24] to-[#22222e] border-2 border-[#eab308] rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-8 bg-gradient-to-r from-[#1a1a24] to-[#2a2a38] rounded-md flex items-center justify-center">
                                                    <div className="w-6 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-sm"></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-[#f0f0f5]">Visa ending in 4242</p>
                                                    <p className="text-xs text-[#6a6a7a]">Expires 12/26</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#eab308]" />
                                                <span className="text-xs text-[#eab308]">Selected</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-[#4a4a5a]">
                                            <Lock className="w-3 h-3" />
                                            <span>Your payment info is secure and encrypted</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-[#eab308] via-[#facc15] to-[#eab308] text-black font-bold text-lg rounded-xl shadow-lg hover:shadow-[#eab308]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5" />
                                            <span>Place Order - {formatPrice(grandTotal)}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="order-1 lg:order-2">
                            <div className="bg-[#12121a]/80 backdrop-blur-xl border border-[#2a2a38] rounded-2xl p-6 sticky top-24">
                                <h2 className="text-xl font-semibold text-[#f0f0f5] mb-6">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#2a2a38] scrollbar-track-transparent">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 p-3 bg-[#1a1a24] rounded-xl border border-[#2a2a38]/50"
                                        >
                                            <div className="w-16 h-16 bg-[#0a0a0f] rounded-lg overflow-hidden flex-shrink-0">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#4a4a5a]">
                                                        <CreditCard className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-[#f0f0f5] truncate">{item.name}</h4>
                                                <span className={`inline-block px-2 py-0.5 text-xs text-white rounded mt-1 ${getRarityColor(item.rarity)}`}>
                                                    {item.rarity?.replace("_", " ")}
                                                </span>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-[#6a6a7a]">Qty: {item.quantity}</span>
                                                    <span className="text-sm font-semibold text-[#eab308]">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Summary */}
                                <div className="border-t border-[#2a2a38] pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#6a6a7a]">Subtotal</span>
                                        <span className="text-[#f0f0f5]">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#6a6a7a]">Shipping</span>
                                        <span className="text-green-500 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-[#2a2a38]">
                                        <span className="text-lg font-semibold text-[#f0f0f5]">Total</span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-[#eab308] to-[#facc15] bg-clip-text text-transparent">
                                            {formatPrice(grandTotal)}
                                        </span>
                                    </div>
                                </div>

                                {/* Security Badge */}
                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#4a4a5a]">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>SSL Encrypted Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
