'use client';

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Gamepad2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

const TCG_CATEGORIES = [
    {
        id: "pokemon",
        slug: "pokemon",
        nameKey: "pokemon",
        description: "Collect and battle with your favorite Pokémon. Discover rare cards and build the ultimate deck.",
        releaseYear: 1996,
        bannerImage: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=2069&auto=format&fit=crop",
        themeColor: "amber-500",
        bgHover: "hover:shadow-amber-500/20"
    },
    {
        id: "one-piece",
        slug: "one-piece",
        nameKey: "onePiece",
        description: "Set sail with Luffy and the Straw Hat Crew in this exciting new trading card game.",
        releaseYear: 2022,
        bannerImage: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=1974&auto=format&fit=crop",
        themeColor: "red-500",
        bgHover: "hover:shadow-red-500/20"
    },
    {
        id: "yugioh",
        slug: "yugioh",
        nameKey: "yugioh",
        description: "Enter the duel arena with powerful monsters, spells, and traps. It's time to duel!",
        releaseYear: 1999,
        bannerImage: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?q=80&w=2070&auto=format&fit=crop",
        themeColor: "purple-500",
        bgHover: "hover:shadow-purple-500/20"
    },
    {
        id: "dragon-ball",
        slug: "dragon-ball",
        nameKey: "dragonBall",
        description: "Unleash the power of the Saiyans. Fast-paced battles with iconic characters from the Dragon Ball universe.",
        releaseYear: 2017,
        bannerImage: "https://images.unsplash.com/photo-1534333230407-be741e733a69?q=80&w=2070&auto=format&fit=crop",
        themeColor: "orange-500",
        bgHover: "hover:shadow-orange-500/20"
    },
    {
        id: "naruto",
        slug: "naruto",
        nameKey: "naruto",
        description: "Master the way of the ninja. Strategic gameplay featuring the legendary shinobi of the Hidden Leaf.",
        releaseYear: 2002,
        bannerImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2070&auto=format&fit=crop",
        themeColor: "blue-500",
        bgHover: "hover:shadow-blue-500/20"
    },
    {
        id: "union-arena",
        slug: "union-arena",
        nameKey: "unionArena",
        description: "The ultimate crossover. Characters from multiple anime series battle it out in a single arena.",
        releaseYear: 2023,
        bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
        themeColor: "cyan-500",
        bgHover: "hover:shadow-cyan-500/20"
    },
    {
        id: "riftbound",
        slug: "riftbound",
        nameKey: "riftbound",
        description: "Enter a dark fantasy world of magic and strategy. Defend your realm in this immersive TCG experience.",
        releaseYear: 2024,
        bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2070&auto=format&fit=crop",
        themeColor: "fuchsia-500",
        bgHover: "hover:shadow-fuchsia-500/20"
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

export default function TCGPage() {
    const t = useTranslations('TCG');

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
                        {t('title')}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        {t('subtitle')}
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {TCG_CATEGORIES.map((game) => (
                        <motion.div key={game.id} variants={itemVariants}>
                            <Link href={`/products?game=${game.slug}`}>
                                <div className={`relative h-[300px] rounded-2xl overflow-hidden group cursor-pointer border border-white/10 transition-all duration-500 hover:-translate-y-2 ${game.bgHover} hover:shadow-2xl`}>
                                    
                                    {/* Background Image */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${game.bannerImage})` }}
                                    />

                                    {/* Dark Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

                                    {/* Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Gamepad2 className={`text-${game.themeColor} w-8 h-8`} />
                                                <h2 className="text-3xl font-bold text-white tracking-wide">
                                                    {t(game.nameKey)}
                                                </h2>
                                            </div>

                                            <p className="text-gray-300 mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                {game.description}
                                            </p>

                                            <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
                                                <span className="flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4" />
                                                    Est. {game.releaseYear}
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
        </div>
    );
}
