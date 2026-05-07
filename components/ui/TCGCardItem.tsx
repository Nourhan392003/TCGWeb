"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { ShoppingCart, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { useAuthAction } from "@/hooks/useAuthAction";
import { useTranslations, useLocale } from "next-intl";
import { formatPriceByLocale } from "@/utils/currency";
import { getLocalizedText } from "@/utils/localization";
import { useFlyToCart } from "@/hooks/useFlyToCart";

interface TCGCardItemProps {
    id: string | number;
    image: string;
    name: string | { en: string; ar?: string };
    price: number;
    rarity: string;
}

export default function TCGCardItem({
    id,
    image,
    name,
    price,
    rarity,
}: TCGCardItemProps) {
    const stringId = id.toString();
    const { checkAuth } = useAuthAction();
    const router = useRouter();
    const locale = useLocale();
    const tActions = useTranslations("Actions");
    const { flyToCart } = useFlyToCart();

    const localizedName = getLocalizedText(name, locale);

    const {
        addItem: addWishlistItem,
        removeItem: removeWishlistItem,
        isInWishlist,
    } = useWishlistStore();

    const addItemToCart = useCartStore((state) => state.addItem);

    const inWishlist = isInWishlist(stringId);

    const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        checkAuth(() => {
            if (inWishlist) {
                removeWishlistItem(stringId);
                toast.error(tActions("removedFromWishlist", { name: localizedName }));
            } else {
                addWishlistItem({
                    id: stringId,
                    name: localizedName,
                    price,
                    image,
                    rarity,
                });
                toast.success(tActions("addedToWishlist", { name: localizedName }));
            }
        });
    };

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const targetElement = e.currentTarget;

        checkAuth(() => {
            flyToCart(targetElement, image);
            addItemToCart({
                id: stringId,
                name: localizedName,
                price,
                quantity: 1,
                image,
                rarity,
            });
            toast.success(tActions("addedToCart", { name: localizedName }));
        });
    };

    const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (isMobile) {
            e.preventDefault();
            checkAuth(() => {
                router.push(`/products/${stringId}`);
            }, undefined, `/products/${stringId}`);
        }
    };

    return (
        <div
            data-product-card
            className="group relative rounded-xl bg-[#16161e] border border-[#2a2a38] p-4 transition-all duration-300 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] h-full flex flex-col"
        >
            <Link
                href={`/products/${stringId}`}
                onClick={handleCardClick}
                className="absolute inset-0 z-0"
                aria-label={localizedName}
            />

            <div className="absolute top-6 left-6 rtl:left-auto rtl:right-6 z-10">
                <div className="px-2.5 py-0.5 rounded-full border bg-black/50 backdrop-blur-md text-xs font-semibold capitalize border-purple-500 text-purple-400">
                    {rarity ? rarity.replace(/_/g, " ") : "Common"}
                </div>
            </div>

            <button
                type="button"
                onClick={handleWishlist}
                className="absolute top-6 right-6 rtl:right-auto rtl:left-6 z-10 p-2 rounded-full bg-black/50 backdrop-blur-md border border-[#2a2a38] hover:border-red-500 transition-colors"
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
                <Heart
                    className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                />
            </button>

            <div className="relative aspect-[2.5/3.5] w-full overflow-hidden rounded-lg mb-4 pointer-events-none">
                <Image
                    src={image || "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg"}
                    alt={localizedName || "Card Image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="flex flex-col flex-grow justify-between mt-2 relative z-10">
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 ltr:text-left rtl:text-right">
                    {localizedName}
                </h3>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-yellow-500">
                        {formatPriceByLocale(price, locale)}
                    </span>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="relative z-10 p-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors"
                        aria-label={`Add ${localizedName} to cart`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}