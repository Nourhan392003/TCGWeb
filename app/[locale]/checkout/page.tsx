"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { api } from "@/convex/_generated/api";
import { useRouter } from "@/i18n/navigation";
import {
    CreditCard,
    ShieldCheck,
    Lock,
    ChevronLeft,
    CheckCircle2
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { formatPriceByLocale } from "@/utils/currency";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedText } from "@/utils/localization";

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
    const t = useTranslations('Checkout');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const { items, getTotalPrice, clearCart } = useCartStore();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
    const shipping = 0;
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
            toast.error(t('fillRequired'));
            setIsLoading(false);
            return;
        }

        try {
            const orderReference = `tcg-${Date.now()}`;

            const response = await fetch("/api/paymob/create-intention", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    locale,
                    orderReference,
                    customer: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        zipCode: formData.zipCode,
                    },
                    items: items.map((item) => ({
                        id: item.id,
                        name:
                            typeof item.name === "string"
                                ? item.name
                                : (item.name as any)?.en || (item.name as any)?.ar || "",
                        price: item.price,
                        quantity: item.quantity,
                    })),
                }),
            });

            const text = await response.text();
            console.log("create-intention raw response:", text);

            let data: any = null;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(`Server returned non-JSON response: ${text.slice(0, 200)}`);
            }
            if (!response.ok || !data?.checkoutUrl) {
                throw new Error(data?.error || "Failed to initialize payment");
            }

            window.location.href = data.checkoutUrl;
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to initialize payment"
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-[#1a1a24] rounded-full"></div>
                    <div className="mt-4 h-3 sm:h-4 w-24 sm:w-32 bg-[#1a1a24] rounded"></div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <div className="border-b border-[#2a2a38] bg-[#12121a]/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#eab308] to-[#ca8a04] rounded-lg group-hover:scale-105 transition-transform">
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                            </div>
                            <span className="text-base sm:text-xl font-bold text-[#f0f0f5]">TCG Vault</span>
                        </Link>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[#4a4a5a]">
                            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm">{t('secure')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 ltr:text-left rtl:text-right">
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-1.5 sm:gap-2 text-[#a0a0b0] hover:text-[#f0f0f5] transition-colors mb-4 sm:mb-6 text-sm"
                >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:rotate-180" />
                    <span>{t('back')}</span>
                </Link>

                <h1 className="text-xl sm:text-2xl sm:text-3xl font-bold text-[#f0f0f5] mb-6 sm:mb-8">{t('title')}</h1>

                {items.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 bg-[#12121a]/50 backdrop-blur-xl rounded-2xl border border-[#2a2a38] px-4">
                        <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-[#4a4a5a] mx-auto mb-3 sm:mb-4" />
                        <p className="text-[#a0a0b0] mb-3 sm:mb-4 text-sm sm:text-base">{t('empty')}</p>
                        <Link
                            href="/"
                            className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#eab308] to-[#ca8a04] text-black font-medium text-sm sm:text-base rounded-lg hover:from-[#facc15] hover:to-[#eab308] transition-all"
                        >
                            {t('continueShopping')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        <div className="order-2 lg:order-1">
                            <form onSubmit={handlePlaceOrder} className="space-y-4 sm:space-y-6">
                                <div className="bg-[#12121a]/80 backdrop-blur-xl border border-[#2a2a38] rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#eab308]" />
                                        <h2 className="text-base sm:text-xl font-semibold text-[#f0f0f5]">{t('billingShipping')}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-[#a0a0b0] mb-1.5 sm:mb-2">
                                                {t('firstName')} <span className="text-red-500">{t('required')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all text-sm"
                                                placeholder={isRTL ? "أحمد" : "John"}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-[#a0a0b0] mb-1.5 sm:mb-2">
                                                {t('lastName')} <span className="text-red-500">{t('required')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all text-sm"
                                                placeholder={isRTL ? "محمد" : "Doe"}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs sm:text-sm font-medium text-[#a0a0b0] mb-1.5 sm:mb-2">
                                                {t('email')} <span className="text-red-500">{t('required')}</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all text-sm"
                                                placeholder="example@mail.com"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs sm:text-sm font-medium text-[#a0a0b0] mb-1.5 sm:mb-2">
                                                {t('phone')} <span className="text-red-500">{t('required')}</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all text-sm"
                                                placeholder="+1234567890"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs sm:text-sm font-medium text-[#a0a0b0] mb-1.5 sm:mb-2">
                                                {t('address')} <span className="text-red-500">{t('required')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all text-sm"
                                                placeholder={isRTL ? "شارع الملك فيصل، الحي الأول" : "123 Main Street, Apt 4"}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-[#a0a0b0] mb-1.5 sm:mb-2">
                                                {t('city')} <span className="text-red-500">{t('required')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all text-sm"
                                                placeholder={isRTL ? "القاهرة" : "New York"}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-[#a0a0b0] mb-1.5 sm:mb-2">
                                                {t('zipCode')} <span className="text-red-500">{t('required')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-[#f0f0f5] placeholder-[#4a4a5a] focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/50 outline-none transition-all text-sm"
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs sm:text-sm text-[#6a6a7a] text-center">
                                    سيتم اختيار طريقة الدفع في صفحة Paymob الآمنة
                                </p>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-[#eab308] via-[#facc15] to-[#eab308] text-black font-bold text-sm sm:text-lg rounded-xl shadow-lg hover:shadow-[#eab308]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            <span className="text-sm sm:text-base">{t('processing')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm sm:text-base">{t('placeOrder', { amount: formatPriceByLocale(grandTotal, locale) })}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="bg-[#12121a]/80 backdrop-blur-xl border border-[#2a2a38] rounded-xl sm:rounded-2xl p-4 sm:p-6 sticky top-20">
                                <h2 className="text-base sm:text-xl font-semibold text-[#f0f0f5] mb-4 sm:mb-6">{t('orderSummary')}</h2>

                                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#2a2a38] scrollbar-track-transparent">
                                    {items.map((item) => {
                                        const localizedName = getLocalizedText(item.name, locale);
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex gap-2.5 sm:gap-4 p-2.5 sm:p-3 bg-[#1a1a24] rounded-lg sm:rounded-xl border border-[#2a2a38]/50"
                                            >
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0a0a0f] rounded-md sm:rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={localizedName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#4a4a5a]">
                                                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs sm:text-sm font-medium text-[#f0f0f5] truncate">{localizedName}</h4>
                                                    <span className={`inline-block px-1.5 py-0.5 text-[10px] sm:text-xs text-white rounded mt-1 ${getRarityColor(item.rarity)}`}>
                                                        {item.rarity?.replace("_", " ")}
                                                    </span>
                                                    <div className="flex justify-between items-center mt-1.5 sm:mt-2">
                                                        <span className="text-[10px] sm:text-xs text-[#6a6a7a]">{t('qty', { count: item.quantity })}</span>
                                                        <span className="text-xs sm:text-sm font-semibold text-[#eab308]">
                                                            {formatPriceByLocale(item.price * item.quantity, locale)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="border-t border-[#2a2a38] pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-[#6a6a7a]">{t('subtotal')}</span>
                                        <span className="text-[#f0f0f5]">{formatPriceByLocale(totalPrice, locale)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-[#6a6a7a]">{t('shipping')}</span>
                                        <span className="text-green-500 font-medium">{t('free')}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 sm:pt-3 border-t border-[#2a2a38]">
                                        <span className="text-sm sm:text-base font-semibold text-[#f0f0f5]">{t('total')}</span>
                                        <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#eab308] to-[#facc15] bg-clip-text text-transparent">
                                            {formatPriceByLocale(grandTotal, locale)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-6 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[#4a4a5a]">
                                    <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{t('ssl')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
