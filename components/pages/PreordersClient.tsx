"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Link } from "@/i18n/navigation";
import { Loader2, Heart, ShoppingCart, Clock } from "lucide-react";
import { formatPriceByLocale } from "@/utils/currency";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthAction } from "@/hooks/useAuthAction";
import toast from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedText } from "@/utils/localization";

export default function PreordersClient() {
    const t = useTranslations('Products');
    const tNav = useTranslations('Navbar');
    const tActions = useTranslations('Actions');
    const tPre = useTranslations('Preorders');
    const tGen = useTranslations('General');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const { checkAuth } = useAuthAction();
    const products = useQuery(api.products.getPreorderProducts);

    const addItemToCart = useCartStore((state) => state.addItem);
    const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        checkAuth(() => {
            const localizedName = getLocalizedText(product.name, locale);
            addItemToCart({
                id: product._id.toString(),
                name: localizedName,
                price: product.price,
                quantity: 1,
                image: product.imageUrl || product.image || "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg",
                rarity: product.rarity || "Common",
            });
            toast.success(tActions('addedToCart', { name: localizedName }));
        });
    };

    const handleWishlistToggle = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        checkAuth(() => {
            const stringId = product._id.toString();
            const inWishlist = isInWishlist(stringId);
            const localizedName = getLocalizedText(product.name, locale);

            if (inWishlist) {
                removeWishlistItem(stringId);
                toast.error(tActions('removedFromWishlist', { name: localizedName }));
            } else {
                addWishlistItem({
                    id: stringId,
                    name: localizedName,
                    price: product.price,
                    image: product.imageUrl || product.image,
                    rarity: product.rarity
                });
                toast.success(tActions('addedToWishlist', { name: localizedName }));
            }
        });
    };

    if (products === undefined) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-spin" />
                    <p className="text-gray-400 text-sm sm:text-lg">{tPre('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
                <div className="text-center mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                        <span>{tPre('title')}</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                        {tPre('subtitle')}
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Clock className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-base sm:text-lg mb-2">{tPre('noOrders')}</p>
                        <p className="text-gray-500 text-xs sm:text-sm">{tPre('checkBack')}</p>
                        <Link href="/products" className="mt-8 px-6 py-2.5 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm">
                            {tPre('browse')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {products.map((product: any) => {
                            const inWishlist = isInWishlist(product._id.toString());
                            const localizedName = getLocalizedText(product.name, locale);
                            return (
                                <Link
                                    key={product._id}
                                    href={`/products/${product._id}`}
                                    className="group bg-[#12121a] rounded-xl border border-gray-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                                >
                                    <div className="aspect-[3/4] relative overflow-hidden bg-[#1a1a24]">
                                        {product.imageUrl || product.image ? (
                                            <img
                                                src={product.imageUrl || product.image}
                                                alt={localizedName}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs sm:text-sm">
                                                {tGen('noImage')}
                                            </div>
                                        )}

                                        <button
                                            onClick={(e) => handleWishlistToggle(e, product)}
                                            className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} z-10 p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md border border-gray-700 hover:border-red-500 transition-colors`}
                                        >
                                            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-white"}`} />
                                        </button>

                                        <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} z-10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-amber-500/80 backdrop-blur-md text-[10px] sm:text-xs font-medium text-black border border-amber-400`}>
                                            {tPre('badge')}
                                        </div>
                                    </div>

                                    <div className="p-2.5 sm:p-4 ltr:text-left rtl:text-right">
                                        <h3 className="text-white font-semibold text-xs sm:text-sm truncate mb-1 sm:mb-2">
                                            {localizedName}
                                        </h3>

                                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                                            <span className="text-sm sm:text-lg font-bold text-amber-500">
                                                {formatPriceByLocale(product.price, locale)}
                                            </span>
                                            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                {tPre('comingSoon')}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="w-full py-2 sm:py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                                        >
                                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {t('add')}
                                        </button>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
