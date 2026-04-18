'use client'

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HeroSlider from "@/components/HeroSlider";
import FloatingCardsCTA from "@/components/FloatingCardsCTA";
import RecommendSection from "@/components/RecommendSection";
import VideosSection from "@/components/VideosSection";

export default function HomeClient() {
    const featuredCards = useQuery(api.products.getFeaturedCards);

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
