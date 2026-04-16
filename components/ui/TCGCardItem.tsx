"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

import { useAuthAction } from "@/hooks/useAuthAction";
import { useRouter } from "next/navigation";

interface TCGCardItemProps {
    id: string | number;
    image: string;
    name: string;
    price: number;
    rarity: string;
}

export default function TCGCardItem({ id, image, name, price, rarity }: TCGCardItemProps) {
    const stringId = id.toString();
    const { checkAuth } = useAuthAction();
    const router = useRouter();

    // دوال المفضلة
    const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();

    // دالة السلة
    const addItemToCart = useCartStore((state) => state.addItem);

    // هل العنصر في المفضلة؟
    const inWishlist = isInWishlist(stringId);

    // إضافة/إزالة المفضلة
    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();

        checkAuth(() => {
            if (inWishlist) {
                removeWishlistItem(stringId);
                toast.error(`${name} removed from wishlist`);
            } else {
                addWishlistItem({
                    id: stringId,
                    name,
                    price,
                    image,
                    rarity
                });
                toast.success(`${name} added to wishlist! 💖`);
            }
        });
    };

    // إضافة للسلة
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();

        checkAuth(() => {
            addItemToCart({
                id: stringId,
                name,
                price,
                quantity: 1,
                image,
                rarity
            });
            toast.success(`${name} added to cart! 🛒`);
        });
    };

    // معالجة الضغط على البطاقة (مهم للموبايل)
    const handleCardClick = (e: React.MouseEvent) => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) {
            e.preventDefault();
            checkAuth(() => {
                router.push(`/products/${stringId}`);
            }, undefined, `/products/${stringId}`);
        }
    };

    return (
        <Link href={`/products/${stringId}`} onClick={handleCardClick}>
            <div className="group relative rounded-xl bg-[#16161e] border border-[#2a2a38] p-4 transition-all duration-300 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] cursor-pointer h-full flex flex-col">

                {/* Rarity Badge */}
                <div className="absolute top-6 left-6 z-10">
                    <div className="px-2.5 py-0.5 rounded-full border bg-black/50 backdrop-blur-md text-xs font-semibold capitalize border-purple-500 text-purple-400">
                        {rarity ? rarity.replace(/_/g, ' ') : 'Common'}
                    </div>
                </div>

                {/* Wishlist Heart Button */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/50 backdrop-blur-md border border-[#2a2a38] hover:border-red-500 transition-colors"
                >
                    <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>

                {/* Card Image */}
                <div className="relative aspect-[2.5/3.5] w-full overflow-hidden rounded-lg mb-4">
                    <Image
                        src={image || "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg"} // صورة افتراضية لو مفيش صورة
                        alt={name || "Card Image"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Card Info */}
                <div className="flex flex-col flex-grow justify-between mt-2">
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                        {name}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-yellow-500">
                            SAR{price ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                        </span>

                        <button
                            onClick={handleAddToCart}
                            className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors z-10"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}