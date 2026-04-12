
"use client";
import { useState, useMemo } from "react";
import { Search, Filter, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


// الواجهة الخاصة بالكروت
interface TCGCard {
    _id: string;
    name: string;
    game: string;
    price: number;
    image: string;
    rarity: string;
    inStock: boolean;
    description?: string;
    condition?: string;
    isFoil?: boolean;
    isFirstEdition?: boolean;
    isGraded?: boolean;
    stockQuantity?: number;
    createdAt?: number;
}

const rarityConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
    common: { label: "Common", bgColor: "bg-gray-600", textColor: "text-gray-300" },
    uncommon: { label: "Uncommon", bgColor: "bg-green-600", textColor: "text-green-300" },
    rare: { label: "Rare", bgColor: "bg-blue-600", textColor: "text-blue-300" },
    "ultra rare": { label: "Ultra Rare", bgColor: "bg-purple-600", textColor: "text-purple-300" },
    "secret rare": { label: "Secret Rare", bgColor: "bg-gradient-to-r from-yellow-600 to-orange-600", textColor: "text-yellow-300" },
    promo: { label: "Promo", bgColor: "bg-gray-200", textColor: "text-gray-900" },
    "sealed product": { label: "Sealed Product", bgColor: "bg-rose-900", textColor: "text-rose-100" },
};

const gameTypes = ["All", "pokemon", "yugioh", "onepiece", "magic"];
const rarities = ["All", "ultra rare", "secret rare"];
export const dynamic = "force-dynamic";
function ShopContent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGame, setSelectedGame] = useState("All");
    const [selectedRarity, setSelectedRarity] = useState("All");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const searchParams = useSearchParams();
    const urlGameFilter = searchParams.get("game");

    const addItem = useCartStore((state) => state.addItem);

    // سحب كل الكروت من قاعدة البيانات
    const products = useQuery(api.products.getAllCards);
    const [availability, setAvailability] = useState("All");
    const gameParamToType: Record<string, string> = {
        "pokemon": "pokemon",
        "Pokemon": "pokemon",
        "yugioh": "yugioh",
        "Yugioh": "yugioh",
        "magic": "magic",
        "Magic": "magic",
        "onepiece": "onepiece",
        "Onepiece": "onepiece",
    };

    const effectiveGameFilter = urlGameFilter ? (gameParamToType[urlGameFilter] || "All") : "All";

    // فلترة الكروت
    const filteredCards = useMemo(() => {
        if (!products || products.length === 0) return [];

        return products.filter((card: any) => {
            const cardName = card?.name || "";
            const matchesSearch = cardName.toLowerCase().includes(searchTerm.toLowerCase());

            // ✨ التعديل هنا: شلنا المسافات من اسم اللعبة عشان تتطابق مع الفلتر ✨
            const cardGame = (card?.game || "").toLowerCase().replace(/\s+/g, "");
            const gameFilter = effectiveGameFilter !== "All" ? effectiveGameFilter : selectedGame;
            const gameFilterLower = gameFilter.toLowerCase().replace(/\s+/g, "");
            const matchesGame = gameFilter === "All" || cardGame === gameFilterLower;

            const cardRarity = card?.rarity?.toLowerCase().replace(/ /g, '_') || "";
            const selectedRarityLower = selectedRarity.toLowerCase().replace(/ /g, '_');
            const matchesRarity = selectedRarity === "All" || cardRarity === selectedRarityLower;

            const cardPrice = card?.price ?? 0;
            const matchesPrice = cardPrice >= priceRange[0] && cardPrice <= priceRange[1];
            const matchesAvailability =
                availability === "All" ||
                (availability === "inStock" && card?.inStock === true) ||
                (availability === "outOfStock" && card?.inStock === false);
            return matchesSearch && matchesGame && matchesRarity && matchesPrice && matchesAvailability;
        });
    }, [searchTerm, selectedGame, selectedRarity, priceRange, products, effectiveGameFilter]);

    if (products === undefined) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleAddToCart = (e: React.MouseEvent, card: any) => {
        e.preventDefault();
        e.stopPropagation();

        addItem({
            id: card._id.toString(),
            name: card.name,
            price: card.price,
            quantity: 1,
            image: card.imageUrl || card.image,
            rarity: card.rarity,
        });
        toast.success(`${card.name} added to cart!`);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedGame("All");
        setSelectedRarity("All");
        setAvailability("All");
        setPriceRange([0, 10000]);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#2a2a38]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            Shop Cards
                        </h1>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a24] border border-[#2a2a38] hover:border-[#3a3a4a] transition-colors"
                        >
                            <Filter className="w-5 h-5" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className={`lg:w-72 flex-shrink-0 ${isFilterOpen ? "block" : "hidden lg:block"}`}>
                        <div className="sticky top-24 bg-[#12121a]/80 backdrop-blur-lg rounded-2xl border border-[#2a2a38] p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-white">Filters</h2>
                                <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Clear All
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search cards..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#3a3a4a] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Game Type</label>
                                <div className="space-y-2">
                                    {gameTypes.map((game) => (
                                        <button
                                            key={game}
                                            onClick={() => setSelectedGame(game)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selectedGame === game
                                                ? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/50 text-yellow-400"
                                                : "bg-[#1a1a24] border border-[#2a2a38] text-gray-300 hover:border-[#3a3a4a]"
                                                }`}
                                        >
                                            {game}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rarity</label>
                                <div className="space-y-2">
                                    {rarities.map((rarity) => (
                                        <button
                                            key={rarity}
                                            onClick={() => setSelectedRarity(rarity)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selectedRarity === rarity
                                                ? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/50 text-yellow-400"
                                                : "bg-[#1a1a24] border border-[#2a2a38] text-gray-300 hover:border-[#3a3a4a]"
                                                }`}
                                        >
                                            {rarity}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-white transition-colors">
                                        <input
                                            type="radio"
                                            name="availability"
                                            checked={availability === "All"}
                                            onChange={() => setAvailability("All")}
                                            className="w-4 h-4 accent-yellow-500"
                                        />
                                        <span>All</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-white transition-colors">
                                        <input
                                            type="radio"
                                            name="availability"
                                            checked={availability === "inStock"}
                                            onChange={() => setAvailability("inStock")}
                                            className="w-4 h-4 accent-yellow-500"
                                        />
                                        <span>In Stock</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-white transition-colors">
                                        <input
                                            type="radio"
                                            name="availability"
                                            checked={availability === "outOfStock"}
                                            onChange={() => setAvailability("outOfStock")}
                                            className="w-4 h-4 accent-yellow-500"
                                        />
                                        <span>Out of Stock</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                                <div className="flex gap-2 text-xs">
                                    <span>{priceRange[0]} SAR</span>
                                    <span>-</span>
                                    <span>{priceRange[1]} SAR</span>                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        {filteredCards.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 mb-4 rounded-full bg-[#1a1a24] flex items-center justify-center">
                                    <X className="w-10 h-10 text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No cards found matching your search</h3>
                                <p className="text-gray-400 mb-4">Try adjusting your filters or search term</p>
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-medium hover:from-yellow-500 hover:to-orange-500 transition-all"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredCards.map((card: any, index: number) => {
                                    const cardName = card?.name || "Unknown Card";
                                    const cardGame = card?.game || "unknown";
                                    const cardRarity = card?.rarity || "common";
                                    const cardImage = card?.imageUrl || card?.image || "";
                                    const cardPrice = card?.price ?? 0;
                                    const cardInStock = card?.inStock ?? false;
                                    const cardCondition = card?.condition || "";
                                    const cardId = card?._id?.toString() || `card-${index}`;

                                    const rarityKey = cardRarity.toLowerCase().replace(/ /g, "_");
                                    const config = rarityConfig[rarityKey] || { label: cardRarity || "Common", bgColor: "bg-gray-600", textColor: "text-gray-300" };

                                    return (
                                        <Link href={`/products/${cardId}`} key={cardId}>                                            <div className="group relative bg-[#16161e] rounded-xl border border-[#2a2a38] overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] h-full flex flex-col cursor-pointer">
                                            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden">
                                                <img
                                                    src={cardImage}
                                                    alt={cardName}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg";
                                                    }}
                                                />

                                                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}>
                                                    {config.label}
                                                </div>

                                                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${cardInStock ? "bg-green-600/80 text-green-100" : "bg-red-600/80 text-red-100"}`}>
                                                    {cardInStock ? "In Stock" : "Out of stock"}
                                                </div>
                                            </div>

                                            <div className="p-4 flex flex-col flex-grow justify-between">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1 capitalize">{cardGame}</p>
                                                    <h3 className="font-semibold text-white mb-2 line-clamp-2">
                                                        {cardName}
                                                    </h3>
                                                    {cardCondition && (
                                                        <p className="text-xs bg-gray-800/50 px-2 py-1 rounded-full mb-2">
                                                            {cardCondition}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-auto">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-xl font-bold text-white">
                                                            SAR{cardPrice.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleAddToCart(e, card)}
                                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold py-2 rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all active:scale-95 z-10 relative"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}