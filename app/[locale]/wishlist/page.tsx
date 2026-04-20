"use client";

import { useState, useEffect } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import TCGCardItem from "@/components/ui/TCGCardItem";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedText } from "@/utils/localization";

export default function WishlistPage() {
    const t = useTranslations('Wishlist');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const wishlistStore = useWishlistStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 bg-amber-500/20 rounded-full border border-amber-500/30"></div>
                    <div className="mt-4 h-4 w-32 bg-white/5 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Header */}
            <div className="border-b border-white/5 bg-[#12121a]/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg shadow-lg shadow-amber-500/10">
                            <Heart className="w-5 h-5 text-black fill-black" />
                        </div>
                        <h1 className="text-xl font-bold text-white">{t('title')}</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 ltr:text-left rtl:text-right">
                {wishlistStore.items.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-24 h-24 bg-[#12121a] rounded-full flex items-center justify-center mb-6 border border-white/5">
                            <Heart className="w-12 h-12 text-gray-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{t('empty')}</h2>
                        <p className="text-gray-500 mb-8 text-center max-w-md">
                            {t('emptyDesc')}
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
                        >
                            {t('explore')}
                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 border-b border-white/5 pb-6">
                            <h2 className="text-3xl font-black text-white">{t('myWishlist')}</h2>
                            <p className="text-gray-500 mt-2">
                                {t('saved', { count: wishlistStore.items.length })}
                            </p>
                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistStore.items.map((item) => (
                                <TCGCardItem
                                    key={item.id}
                                    id={item.id}
                                    name={getLocalizedText(item.name, locale)}
                                    image={item.image || ""}
                                    price={item.price}
                                    rarity={item.rarity || ""}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
