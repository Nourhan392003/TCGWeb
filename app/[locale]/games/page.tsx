'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Sparkles, Clock, Package } from "lucide-react";

const games = [
    {
        id: "pokemon",
        name: "Pokémon",
        gameParam: "Pokemon",
        description: "Collect and battle with your favorite Pokémon. Discover rare cards and build the ultimate deck.",
        releaseYear: 1996,
        cardCount: "14,000+ Cards",
        bannerImage: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=2069&auto=format&fit=crop",
        themeColor: "amber-500",
        bgHover: "hover:shadow-amber-500/20"
    },
    {
        id: "yugioh",
        name: "Yu-Gi-Oh!",
        gameParam: "Yugioh",
        description: "Enter the duel arena with powerful monsters, spells, and traps. It's time to duel!",
        releaseYear: 1999,
        cardCount: "10,000+ Cards",
        bannerImage: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?q=80&w=2070&auto=format&fit=crop",
        themeColor: "purple-500",
        bgHover: "hover:shadow-purple-500/20"
    },
    {
        id: "preorder",
        name: "Pre-Orders",
        gameParam: "Preorder",
        description: "Be the first to get upcoming releases. Reserve your packs before they hit the shelves!",
        releaseYear: null,
        cardCount: "Reserve Now",
        bannerImage: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1000&auto=format&fit=crop",
        themeColor: "emerald-500",
        bgHover: "hover:shadow-emerald-500/30",
        isPreorder: true
    },
    {
        id: "one-piece",
        name: "One Piece Card Game",
        gameParam: "Onepiece",
        description: "Set sail with Luffy and the Straw Hat Crew in this exciting new trading card game.",
        releaseYear: 2022,
        cardCount: "2,000+ Cards",
        bannerImage: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=1974&auto=format&fit=crop",
        themeColor: "red-500",
        bgHover: "hover:shadow-red-500/20"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
                        Explore TCG Universes
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Dive into the world's most popular Trading Card Games. Choose your universe and start building your ultimate collection.
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {games.map((game) => (
                        <motion.div key={game.id} variants={itemVariants}>
                            <Link href={`/products?game=${game.gameParam}`}>
                                <div className={`relative h-[300px] rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-500 hover:-translate-y-2 ${game.bgHover} hover:shadow-2xl ${game.isPreorder ? 'border-emerald-500/60' : 'border-white/10'}`}>
                                    {/* Animated glow border for Pre-Orders */}
                                    {game.isPreorder && (
                                        <div className="absolute -inset-[2px] rounded-2xl z-0 pointer-events-none">
                                            <div className="absolute inset-0 rounded-2xl animate-preorder-glow-border" />
                                        </div>
                                    )}

                                    {/* Background Image */}
                                    <div
                                        className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ${game.isPreorder ? 'z-[1]' : ''}`}
                                        style={{ backgroundImage: `url(${game.bannerImage})` }}
                                    />

                                    {/* Dark Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 group-hover:opacity-80 ${game.isPreorder ? 'z-[2]' : ''}`} />

                                    {/* Shimmer overlay for Pre-Orders */}
                                    {game.isPreorder && (
                                        <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
                                            <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(16,185,129,0.08)_45%,rgba(16,185,129,0.15)_50%,rgba(16,185,129,0.08)_55%,transparent_60%)] animate-shimmer" />
                                        </div>
                                    )}

                                    {/* Pre-order Badge */}
                                    {game.isPreorder && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                                                </span>
                                                Pre-order
                                            </span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className={`absolute inset-0 p-8 flex flex-col justify-end ${game.isPreorder ? 'z-[4]' : ''}`}>
                                        <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                {game.isPreorder ? (
                                                    <Package className="text-emerald-400 w-8 h-8 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                                                ) : (
                                                    <Gamepad2 className={`text-${game.themeColor} w-8 h-8`} />
                                                )}
                                                <h2 className="text-3xl font-bold text-white tracking-wide">
                                                    {game.name}
                                                </h2>
                                            </div>

                                            <p className="text-gray-300 mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                {game.description}
                                            </p>

                                            <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
                                                <span className="flex items-center gap-2">
                                                    {game.isPreorder ? (
                                                        <Clock className="w-4 h-4 text-emerald-400" />
                                                    ) : (
                                                        <Sparkles className="w-4 h-4" />
                                                    )}
                                                    {game.isPreorder ? "Upcoming Releases" : `Est. ${game.releaseYear}`}
                                                </span>
                                                <span className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md ${game.isPreorder ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold' : 'bg-white/10'}`}>
                                                    {game.cardCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <style>{`
                @keyframes preorder-glow-border {
                    0%, 100% {
                        box-shadow: 0 0 15px rgba(16, 185, 129, 0.3), 0 0 30px rgba(16, 185, 129, 0.1), inset 0 0 15px rgba(16, 185, 129, 0.05);
                        border: 2px solid rgba(16, 185, 129, 0.5);
                        border-radius: 1rem;
                    }
                    50% {
                        box-shadow: 0 0 25px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.2), inset 0 0 25px rgba(16, 185, 129, 0.1);
                        border: 2px solid rgba(16, 185, 129, 0.9);
                        border-radius: 1rem;
                    }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-150%); }
                    100% { transform: translateX(150%); }
                }
                .animate-preorder-glow-border {
                    animation: preorder-glow-border 2.5s ease-in-out infinite;
                }
                .animate-shimmer > div {
                    animation: shimmer 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
