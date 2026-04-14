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

            {/* 3️⃣ قسم المنتجات المميزة (Featured Cards) */}
            {/* 🌟 RECOMMEND / WANTED POSTERS STYLE 🌟 */}
            <section className="relative z-10 py-32 bg-[#e8decd] overflow-hidden flex justify-center">

                <div className="relative w-[120vw] -ml-[10vw] min-h-[900px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] border-[8px] border-[#1b120a]"
                    style={{
                        transform: "rotate(-4deg)",
                        backgroundImage: 'url("/wood-bg.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/30 pointer-events-none" />

                    {/* شريط المسامير العلوي */}
                    <div className="absolute top-0 left-0 w-full h-[50px] bg-gradient-to-b from-[#2a2a2a] via-[#111] to-[#000] border-b-[4px] border-black/90 flex justify-around items-center z-10 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                        {[...Array(30)].map((_, i) => (
                            <div key={`top-${i}`} className="w-5 h-5 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8b6508] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4)] border-2 border-black/80"></div>
                        ))}
                    </div>

                    <div className="relative z-20 w-full h-full flex flex-col items-center pt-32 pb-24 px-4 sm:px-10"
                        style={{ transform: "rotate(4deg)" }}
                    >
                        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
                            <div className="mb-24">
                                <h2 className="text-6xl md:text-8xl font-black text-[#f4e4c1] tracking-widest uppercase"
                                    style={{
                                        fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                                        textShadow: '4px 4px 0px #3e2723, 6px 6px 0px #000, 0px 10px 20px rgba(0,0,0,0.8)'
                                    }}
                                >
                                    RECOMMEND
                                </h2>
                            </div>

                            {featuredCards === undefined ? (
                                <div className="flex justify-center items-center h-40">
                                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : featuredCards.length === 0 ? (
                                <div className="text-center text-white py-10 bg-black/60 rounded-xl px-10">
                                    <p>No bounties available.</p>
                                </div>
                            ) : (
                                <div className="flex flex-wrap justify-center lg:flex-nowrap gap-6 md:gap-8 lg:gap-12 w-full px-4 items-center">
                                    {featuredCards?.map((card, index) => {
                                        const staggerClass = index % 2 === 0
                                            ? 'lg:-translate-y-12 md:-translate-y-6'
                                            : 'lg:translate-y-16 md:translate-y-8 mt-10 lg:mt-0';

                                        const baseRotate = index % 2 === 0 ? -3 : 4;

                                        return (
                                            <motion.div
                                                key={card._id.toString()}
                                                initial={{ opacity: 0, scale: 0.9, rotate: baseRotate + 10, y: 50 }}
                                                whileInView={{ opacity: 1, scale: 1, rotate: baseRotate, y: 0 }}
                                                whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
                                                viewport={{ once: true, margin: "-50px" }}
                                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.15 }}
                                                className={`group relative flex flex-col items-center pt-6 pb-4 px-4 shadow-[0_20px_40px_rgba(0,0,0,0.7)] cursor-pointer w-full sm:w-[45%] md:w-[45%] lg:w-[24%] flex-shrink-0 ${staggerClass}`}
                                                style={{
                                                    backgroundImage: 'url("/wanted-bg.jpg")',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    border: '2px solid #5c3a21',
                                                    borderRadius: '3px'
                                                }}
                                            >
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#111] border border-black shadow-sm z-30"></div>
                                                <div className="w-full text-center mb-3 mt-1">
                                                    <h3 className="text-[2.8rem] xl:text-[3.2rem] font-black text-[#2e1a0b] tracking-wider leading-none"
                                                        style={{ fontFamily: 'Impact, sans-serif', transform: 'scaleY(1.3)' }}
                                                    >
                                                        WANTED
                                                    </h3>
                                                </div>
                                                <Link href={`/products/${card._id}`} className="w-full relative aspect-[4/3] flex items-center justify-center overflow-hidden mb-4 border-[3px] border-[#e8decd] shadow-inner mt-2">                                                    <img src={card.imageUrl || card.image || "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg"} alt={card.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                </Link>
                                                <div className="w-full text-center flex flex-col items-center px-1 flex-grow">
                                                    <h4 className="text-xl font-bold text-[#2e1a0b] tracking-widest mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>DEAD OR ALIVE</h4>
                                                    <Link href={`/products/${card._id}`} className="block w-full mb-4">                                                        <p className="text-base text-[#2e1a0b] font-bold leading-snug line-clamp-3 hover:text-black">{card.name}</p>
                                                    </Link>
                                                    <div className="mt-auto w-full flex justify-between items-end border-t-2 border-[#5c3a21]/30 pt-3">
                                                        <p className="text-3xl font-black text-[#2e1a0b] tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
                                                            {formatPrice(card.price)}
                                                        </p>
                                                        <button onClick={(e) => { e.preventDefault(); handleAddToCart(e, card); }} className="bg-[#2e1a0b] hover:bg-black text-[#f4e4c1] px-4 py-2 font-bold uppercase text-[11px] tracking-widest transition-colors">
                                                            Claim
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* شريط المسامير السفلي */}
                    <div className="absolute bottom-0 left-0 w-full h-[50px] bg-gradient-to-b from-[#2a2a2a] via-[#111] to-[#000] border-t-[4px] border-black/90 flex justify-around items-center z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                        {[...Array(30)].map((_, i) => (
                            <div key={`bottom-${i}`} className="w-5 h-5 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8b6508] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4)] border-2 border-black/80"></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4️⃣ قسم الفيديوهات الجديد اللي فيه الخريطة ولوفي بيجري (اللي عملناه في الكومبوننت) */}
            <VideosSection />

        </div>
    );
}