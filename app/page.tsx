'use client'
import dynamic from "next/dynamic";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";
import { ShoppingCart, Heart } from "lucide-react";
const HeroSlider = dynamic(() => import("@/components/HeroSlider"), {
    ssr: false,
});

const FloatingCardsCTA = dynamic(() => import("@/components/FloatingCardsCTA"), {
    ssr: false,
});

const VideoSection = dynamic(() => import("@/components/VideoSection"), {
    ssr: false,
});

const RecommendSection = dynamic(() => import("@/components/RecommendSection"), {
    ssr: false,
});

const VideosSection = dynamic(() => import("@/components/VideosSection"), {
    ssr: false,
});

import { formatPrice } from "@/utils/currency";
export default function Home() {
    const featuredCards = useQuery(api.products.getFeaturedCards);
    const addItemToCart = useCartStore((state) => state.addItem);
    const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();

    const handleAddToCart = (e: React.MouseEvent, card: any) => {
        e.preventDefault();
        e.stopPropagation();
        addItemToCart({
            id: card._id.toString(),
            name: card.name,
            price: card.price,
            quantity: 1,
            image: card.imageUrl || card.image || "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg",
            rarity: card.rarity || "Common",
        });
        toast.success(`${card.name} added to cart!`);
    };

    const toggleWishlist = (e: React.MouseEvent, card: any) => {
        e.preventDefault();
        e.stopPropagation();
        const cardId = card._id.toString();
        if (isInWishlist(cardId)) {
            removeWishlistItem(cardId);
            toast.error(`${card.name} removed from wishlist`);
        } else {
            addWishlistItem({
                id: cardId,
                name: card.name,
                price: card.price,
                image: card.imageUrl || card.image || "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg",
                rarity: card.rarity || "Common",
            });
            toast.success(`${card.name} added to wishlist!`);
        }
    };


    return (
        <div className="min-h-screen bg-[#06060c] text-white selection:bg-amber-500/30 overflow-x-hidden">

            {/* 1️⃣ السلايدر الأساسي */}
            <HeroSlider />

            {/* 2️⃣ الكروت المتطايرة (الـ CTA) */}
            <FloatingCardsCTA />

            {/* 3️⃣ RECOMMEND / WANTED POSTERS SECTION */}
            <RecommendSection featuredCards={featuredCards?.map(card => ({
                id: card._id.toString(),
                name: card.name,
                price: card.price,
                image: card.imageUrl || card.image || "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg",
                rarity: card.rarity || "Common",
            }))} />

            {/* 4️⃣ قسم الفيديوهات الجديد اللي فيه الخريطة ولوفي بيجري (اللي عملناه في الكومبوننت) */}
            <VideosSection />

        </div>
    );
}