"use client";

import { useState, useEffect } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import TCGCardItem from "@/components/ui/TCGCardItem";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
    const wishlistStore = useWishlistStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Header */}
            <div className="border-b border-[#2a2a38] bg-[#12121a]/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg">
                            <Heart className="w-5 h-5 text-white fill-white" />
                        </div>
                        <span className="text-xl font-bold text-[#f0f0f5]">Wishlist</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {wishlistStore.items.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-24 h-24 bg-[#12121a] rounded-full flex items-center justify-center mb-6 border border-[#2a2a38]">
                            <Heart className="w-12 h-12 text-[#4a4a5a]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#f0f0f5] mb-2">Your wishlist is empty</h2>
                        <p className="text-[#6a6a7a] mb-8 text-center max-w-md">
                            Start adding cards you love to your wishlist. They'll appear here so you can easily find them later.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#eab308] to-[#ca8a04] text-black font-semibold rounded-xl hover:from-[#facc15] hover:to-[#eab308] transition-all duration-200"
                        >
                            Explore Cards
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#f0f0f5]">My Collection Wishlist</h1>
                            <p className="text-[#6a6a7a] mt-2">
                                {wishlistStore.items.length} {wishlistStore.items.length === 1 ? 'card' : 'cards'} saved
                            </p>
                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {wishlistStore.items.map((item) => (
                                <TCGCardItem
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
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
