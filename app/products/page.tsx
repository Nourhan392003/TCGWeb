"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Search, Heart, ShoppingCart, X, Filter, ChevronDown, ChevronUp, Check } from "lucide-react";
import { formatPrice } from "@/utils/currency";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";

type FilterSection = {
    id: string;
    title: string;
    isOpen: boolean;
};
const normalizeValue = (value?: string) =>
    (value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

export default function ProductsPage() {
    const products = useQuery(api.products.getAllProducts);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [showMoreTypes, setShowMoreTypes] = useState(false);

    const [availableInStock, setAvailableInStock] = useState<boolean | null>(null);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [minPriceInput, setMinPriceInput] = useState("0");
    const [maxPriceInput, setMaxPriceInput] = useState("5000");


    const [filterSections, setFilterSections] = useState<FilterSection[]>([
        { id: "availability", title: "Availability", isOpen: true },
        { id: "brand", title: "Brand", isOpen: true },
        { id: "type", title: "Product Type", isOpen: true },
        { id: "price", title: "Price Range", isOpen: true },
    ]);

    const addItemToCart = useCartStore((state) => state.addItem);
    const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();

    const toggleSection = (id: string) => {
        setFilterSections(sections =>
            sections.map(s => s.id === id ? { ...s, isOpen: !s.isOpen } : s)
        );
    };

    const brands = [
        { value: "yu_gi_oh", label: "Yu-Gi-Oh!" },
        { value: "pokemon", label: "Pokémon" },
        { value: "one_piece", label: "One Piece" },
        { value: "magic", label: "Magic" },
    ];
    const productTypes = [
        { value: "booster_boxes", label: "Booster Boxes" },
        { value: "card_sleeves_small", label: "Card Sleeves - Small" },
        { value: "constructed_decks", label: "Constructed Decks" },
        { value: "deck_boxes", label: "Deck Boxes" },
        { value: "playmats", label: "Playmats" },
        { value: "single_cards", label: "Single Cards" },
        { value: "accessories", label: "Accessories" },
    ];

    const getProductCounts = () => {
        if (!products) return { inStock: 0, outOfStock: 0, brands: {}, types: {} };

        const counts = {
            inStock: 0,
            outOfStock: 0,
            brands: {} as Record<string, number>,
            types: {} as Record<string, number>,
        };

        products.forEach((product: any) => {
            if (product.inStock) counts.inStock++;
            else counts.outOfStock++;

            const brand = product.game?.toLowerCase() || "other";
            const type = product.type?.toLowerCase().replace(/\s+/g, "_") || "single_cards";
            counts.types[type] = (counts.types[type] || 0) + 1;
        });

        return counts;
    };

    const productCounts = useMemo(() => getProductCounts(), [products]);

    const handleBrandToggle = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    const handleTypeToggle = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handlePriceApply = () => {
        setPriceRange([parseFloat(minPriceInput) || 0, parseFloat(maxPriceInput) || 500]);
    };

    const filteredProducts = useMemo(() => {
        if (!products) return [];

        return products.filter((product: any) => {
            const searchMatch = searchQuery === "" ||
                product.name?.toLowerCase().includes(searchQuery.toLowerCase());

            const stockMatch = availableInStock === null ||
                product.inStock === availableInStock;
            const brandMatch =
                selectedBrands.length === 0 ||
                selectedBrands.includes(normalizeValue(product.game));

            const typeMatch =
                selectedTypes.length === 0 ||
                selectedTypes.includes(normalizeValue(product.type) || "single_cards");

            const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
            return searchMatch && stockMatch && brandMatch && typeMatch && priceMatch;
        });
    }, [products, searchQuery, availableInStock, selectedBrands, selectedTypes, priceRange]);

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        addItemToCart({
            id: product._id.toString(),
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.imageUrl || product.image || "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg",
            rarity: product.rarity || "Common",
        });
        toast.success(`${product.name} added to cart!`);
    };

    const handleWishlistToggle = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        const stringId = product._id.toString();
        const inWishlist = isInWishlist(stringId);

        if (inWishlist) {
            removeWishlistItem(stringId);
            toast.error(`${product.name} removed from wishlist`);
        } else {
            addWishlistItem({
                id: stringId,
                name: product.name,
                price: product.price,
                image: product.imageUrl || product.image,
                rarity: product.rarity
            });
            toast.success(`${product.name} added to wishlist!`);
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setAvailableInStock(null);
        setSelectedBrands([]);
        setSelectedTypes([]);
        setPriceRange([0, 500]);
        setMinPriceInput("0");
        setMaxPriceInput("500");
    };

    const hasActiveFilters =
        availableInStock !== null ||
        selectedBrands.length > 0 ||
        selectedTypes.length > 0 ||
        priceRange[0] > 0 ||
        priceRange[1] < 5000;
    if (products === undefined) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 animate-spin" />
                    <p className="text-gray-400 text-sm sm:text-lg">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    <aside className={`lg:w-72 flex-shrink-0 ${isFiltersOpen ? 'block' : 'hidden'} lg:block`}>
                        <div className="bg-[#12121a] rounded-xl border border-gray-800 p-3 sm:p-4 sticky top-4">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                    <span className="hidden sm:inline">Filters</span>
                                    <span className="sm:hidden">Filter</span>
                                </h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs sm:text-sm text-red-400 hover:text-red-300"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <label className="text-xs sm:text-sm text-gray-400 mb-2 block">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-[#1a1a24] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-3 sm:mb-4 border-b border-gray-800 pb-3 sm:pb-4">
                                <button
                                    onClick={() => toggleSection("availability")}
                                    className="flex items-center justify-between w-full text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3"
                                >
                                    <span>Availability</span>
                                    {filterSections.find(s => s.id === "availability")?.isOpen ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>

                                {filterSections.find(s => s.id === "availability")?.isOpen && (
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    onClick={() => setAvailableInStock(availableInStock === true ? null : true)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${availableInStock === true
                                                        ? 'bg-blue-500 border-blue-500'
                                                        : 'border-gray-600 group-hover:border-gray-500'
                                                        }`}
                                                >
                                                    {availableInStock === true && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className="text-xs sm:text-sm text-gray-300">In stock</span>
                                            </div>
                                            <span className="text-xs text-gray-500">({productCounts.inStock})</span>
                                        </label>

                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    onClick={() => setAvailableInStock(availableInStock === false ? null : false)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${availableInStock === false
                                                        ? 'bg-blue-500 border-blue-500'
                                                        : 'border-gray-600 group-hover:border-gray-500'
                                                        }`}
                                                >
                                                    {availableInStock === false && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className="text-xs sm:text-sm text-gray-300">Out of stock</span>
                                            </div>
                                            <span className="text-xs text-gray-500">({productCounts.outOfStock})</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="mb-3 sm:mb-4 border-b border-gray-800 pb-3 sm:pb-4">
                                <button
                                    onClick={() => toggleSection("brand")}
                                    className="flex items-center justify-between w-full text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3"
                                >
                                    <span>Brand</span>
                                    {filterSections.find(s => s.id === "brand")?.isOpen ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>

                                {filterSections.find(s => s.id === "brand")?.isOpen && (
                                    <div className="space-y-2">
                                        {brands.map((brand) => {
                                            const count = productCounts.brands[brand.value] || 0;
                                            return (
                                                <label key={brand.value} className="flex items-center justify-between cursor-pointer group">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            onClick={() => handleBrandToggle(brand.value)}
                                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand.value)
                                                                ? 'bg-blue-500 border-blue-500'
                                                                : 'border-gray-600 group-hover:border-gray-500'
                                                                }`}
                                                        >
                                                            {selectedBrands.includes(brand.value) && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className="text-xs sm:text-sm text-gray-300">{brand.label}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">({count})</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3 sm:mb-4 border-b border-gray-800 pb-3 sm:pb-4">
                                <button
                                    onClick={() => toggleSection("type")}
                                    className="flex items-center justify-between w-full text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3"
                                >
                                    <span>Product Type</span>
                                    {filterSections.find(s => s.id === "type")?.isOpen ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>

                                {filterSections.find(s => s.id === "type")?.isOpen && (
                                    <div className="space-y-2">
                                        {(showMoreTypes ? productTypes : productTypes.slice(0, 5)).map((type) => {
                                            const count = productCounts.types[type.value] || 0;
                                            return (
                                                <label key={type.value} className="flex items-center justify-between cursor-pointer group">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            onClick={() => handleTypeToggle(type.value)}
                                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type.value)
                                                                ? 'bg-blue-500 border-blue-500'
                                                                : 'border-gray-600 group-hover:border-gray-500'
                                                                }`}
                                                        >
                                                            {selectedTypes.includes(type.value) && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className="text-xs sm:text-sm text-gray-300">{type.label}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">({count})</span>
                                                </label>
                                            );
                                        })}

                                        {productTypes.length > 5 && (
                                            <button
                                                onClick={() => setShowMoreTypes(!showMoreTypes)}
                                                className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 mt-2"
                                            >
                                                {showMoreTypes ? "Show Less" : "Show More"}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mb-0">
                                <button
                                    onClick={() => toggleSection("price")}
                                    className="flex items-center justify-between w-full text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3"
                                >
                                    <span>Price Range</span>
                                    {filterSections.find(s => s.id === "price")?.isOpen ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>

                                {filterSections.find(s => s.id === "price")?.isOpen && (
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500 mb-1 block">From</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">£</span>
                                                    <input
                                                        type="number"
                                                        value={minPriceInput}
                                                        onChange={(e) => setMinPriceInput(e.target.value)}
                                                        onBlur={handlePriceApply}
                                                        className="w-full pl-6 sm:pl-7 pr-2 py-1.5 sm:py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-gray-500 mt-4">-</span>
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500 mb-1 block">To</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">£</span>
                                                    <input
                                                        type="number"
                                                        value={maxPriceInput}
                                                        onChange={(e) => setMaxPriceInput(e.target.value)}
                                                        onBlur={handlePriceApply}
                                                        className="w-full pl-6 sm:pl-7 pr-2 py-1.5 sm:py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-0 sm:px-1">
                                            <input
                                                type="range"
                                                min="0"
                                                max="5000"
                                                step="50"
                                                value={priceRange[1]}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    setPriceRange([0, 5000]);
                                                    setMinPriceInput("0");
                                                    setMaxPriceInput("5000");
                                                }}
                                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                            />
                                            <div className="flex justify-between mt-1 sm:mt-2 text-xs text-gray-400">
                                                <span>{formatPrice(priceRange[0])}</span>
                                                <span>{formatPrice(priceRange[1])}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">All Products</h1>
                                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                    {filteredProducts.length} products available
                                </p>
                            </div>
                            <button
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                className="lg:hidden p-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white"
                            >
                                {isFiltersOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                            </button>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 sm:16 px-4">
                                <p className="text-gray-400 text-base sm:text-lg mb-2">No products found</p>
                                <p className="text-gray-500 text-xs sm:text-sm">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                {filteredProducts.map((product: any) => {
                                    const inWishlist = isInWishlist(product._id.toString());
                                    return (
                                        <Link
                                            key={product._id}
                                            href={`/products/${product._id}`}
                                            className="group bg-[#12121a] rounded-xl border border-gray-800 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                                        >
                                            <div className="aspect-[3/4] relative overflow-hidden bg-[#1a1a24]">
                                                {product.imageUrl || product.image ? (
                                                    <img
                                                        src={product.imageUrl || product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs sm:text-sm">
                                                        No Image
                                                    </div>
                                                )}

                                                <button
                                                    onClick={(e) => handleWishlistToggle(e, product)}
                                                    className="absolute top-2 right-2 z-10 p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md border border-gray-700 hover:border-red-500 transition-colors"
                                                >
                                                    <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-white"}`} />
                                                </button>

                                                {product.rarity && (product.rarity === 'Ultra Rare' || product.rarity === 'Secret Rare') && (
                                                    <div className="absolute top-2 left-2 z-10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-purple-500/80 backdrop-blur-md text-[10px] sm:text-xs font-medium text-white border border-purple-400">
                                                        {product.rarity}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-2.5 sm:p-4">
                                                <h3 className="text-white font-semibold text-xs sm:text-sm truncate mb-1 sm:mb-2">
                                                    {product.name}
                                                </h3>

                                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                                    <span className="text-sm sm:text-lg font-bold text-blue-400">
                                                        {formatPrice(product.price)}
                                                    </span>

                                                    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${product.inStock
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {product.inStock ? 'In Stock' : 'Out'}
                                                    </span>
                                                </div>

                                                {product.inStock ? (
                                                    <button
                                                        onClick={(e) => handleAddToCart(e, product)}
                                                        className="w-full py-2 sm:py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                                                    >
                                                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        Add
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="w-full py-2 sm:py-2.5 bg-gray-700 text-gray-400 font-semibold text-xs sm:text-sm rounded-lg cursor-not-allowed"
                                                    >
                                                        Out of Stock
                                                    </button>
                                                )}
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
