"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Link } from "@/i18n/navigation";
import { Loader2, Search, Heart, ShoppingCart, X, Filter, ChevronDown, ChevronUp, Check } from "lucide-react";
import { formatPriceByLocale } from "@/utils/currency";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthAction } from "@/hooks/useAuthAction";
import toast from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";

type FilterSection = {
    id: string;
    titleKey: string;
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

const getLocalizedName = (name: any, locale: string) => {
    if (!name) return "";
    if (typeof name === "string") return name;
    return name[locale] || name.en || "";
};

export default function ProductsClient() {
    const t = useTranslations('Products');
    const tActions = useTranslations('Actions');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const { checkAuth } = useAuthAction();
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
        { id: "availability", titleKey: "availability", isOpen: true },
        { id: "brand", titleKey: "brand", isOpen: true },
        { id: "type", titleKey: "productType", isOpen: true },
        { id: "price", titleKey: "priceRange", isOpen: true },
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
        { value: "booster_boxes", labelKey: "booster_boxes" },
        { value: "card_sleeves_small", labelKey: "card_sleeves_small" },
        { value: "constructed_decks", labelKey: "constructed_decks" },
        { value: "deck_boxes", labelKey: "deck_boxes" },
        { value: "playmats", labelKey: "playmats" },
        { value: "single_cards", labelKey: "single_cards" },
        { value: "accessories", labelKey: "accessories" },
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

            const brand = normalizeValue(product.game);
            const type = normalizeValue(product.type || "single_cards");
            counts.brands[brand] = (counts.brands[brand] || 0) + 1;
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
        setPriceRange([parseFloat(minPriceInput) || 0, parseFloat(maxPriceInput) || 5000]);
    };

    const filteredProducts = useMemo(() => {
        if (!products) return [];

        return products.filter((product: any) => {
            const nameObj = product.name;
            const searchStr = searchQuery.toLowerCase();

            const searchMatch = searchQuery === "" ||
                (typeof nameObj === "string"
                    ? nameObj.toLowerCase().includes(searchStr)
                    : (nameObj.en.toLowerCase().includes(searchStr) ||
                        (nameObj.ar?.toLowerCase().includes(searchStr)))
                );

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
    }, [products, searchQuery, availableInStock, selectedBrands, selectedTypes, priceRange, locale]);

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        checkAuth(() => {
            const localizedName = getLocalizedName(product.name, locale);
            addItemToCart({
                id: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.imageUrl || product.image || "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg",
                rarity: product.rarity || "Common",
            });
            toast.success(tActions('addedToCart', { name: localizedName }));
        });
    };

    const handleWishlistToggle = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        checkAuth(() => {
            const stringId = product._id.toString();
            const inWishlist = isInWishlist(stringId);
            const localizedName = getLocalizedName(product.name, locale);

            if (inWishlist) {
                removeWishlistItem(stringId);
                toast.error(tActions('removedFromWishlist', { name: localizedName }));
            } else {
                addWishlistItem({
                    id: stringId,
                    name: product.name,
                    price: product.price,
                    image: product.imageUrl || product.image,
                    rarity: product.rarity
                });
                toast.success(tActions('addedToWishlist', { name: localizedName }));
            }
        });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setAvailableInStock(null);
        setSelectedBrands([]);
        setSelectedTypes([]);
        setPriceRange([0, 5000]);
        setMinPriceInput("0");
        setMaxPriceInput("5000");
    };

    const hasActiveFilters =
        searchQuery !== "" ||
        availableInStock !== null ||
        selectedBrands.length > 0 ||
        selectedTypes.length > 0 ||
        priceRange[0] > 0 ||
        priceRange[1] < 5000;

    if (products === undefined) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-spin" />
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
                                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                                    <span>{t('filters')}</span>
                                </h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs sm:text-sm text-red-400 hover:text-red-300"
                                    >
                                        {t('clear')}
                                    </button>
                                )}
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <label className="text-xs sm:text-sm text-gray-400 mb-2 block ltr:text-left rtl:text-right">{t('searchPlaceholder').split('...')[0]}</label>
                                <div className="relative">
                                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500`} />
                                    <input
                                        type="text"
                                        placeholder={t('searchPlaceholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} sm:pr-4 py-2 sm:py-2.5 bg-[#1a1a24] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 ltr:text-left rtl:text-right`}
                                    />
                                </div>
                            </div>

                            <div className="mb-3 sm:mb-4 border-b border-gray-800 pb-3 sm:pb-4">
                                <button
                                    onClick={() => toggleSection("availability")}
                                    className="flex items-center justify-between w-full text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3"
                                >
                                    <span>{t('availability')}</span>
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
                                                        ? 'bg-amber-500 border-amber-500'
                                                        : 'border-gray-600 group-hover:border-gray-500'
                                                        }`}
                                                >
                                                    {availableInStock === true && <Check className="w-3 h-3 text-black" />}
                                                </div>
                                                <span className="text-xs sm:text-sm text-gray-300">{t('inStock')}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">({productCounts.inStock})</span>
                                        </label>

                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    onClick={() => setAvailableInStock(availableInStock === false ? null : false)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${availableInStock === false
                                                        ? 'bg-amber-500 border-amber-500'
                                                        : 'border-gray-600 group-hover:border-gray-500'
                                                        }`}
                                                >
                                                    {availableInStock === false && <Check className="w-3 h-3 text-black" />}
                                                </div>
                                                <span className="text-xs sm:text-sm text-gray-300">{t('outOfStock')}</span>
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
                                    <span>{t('brand')}</span>
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
                                                                ? 'bg-amber-500 border-amber-500'
                                                                : 'border-gray-600 group-hover:border-gray-500'
                                                                }`}
                                                        >
                                                            {selectedBrands.includes(brand.value) && <Check className="w-3 h-3 text-black" />}
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
                                    <span>{t('productType')}</span>
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
                                                                ? 'bg-amber-500 border-amber-500'
                                                                : 'border-gray-600 group-hover:border-gray-500'
                                                                }`}
                                                        >
                                                            {selectedTypes.includes(type.value) && <Check className="w-3 h-3 text-black" />}
                                                        </div>
                                                        <span className="text-xs sm:text-sm text-gray-300">{type.value.replace(/_/g, ' ')}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">({count})</span>
                                                </label>
                                            );
                                        })}

                                        {productTypes.length > 5 && (
                                            <button
                                                onClick={() => setShowMoreTypes(!showMoreTypes)}
                                                className="text-xs sm:text-sm text-amber-500 hover:text-amber-400 mt-2"
                                            >
                                                {showMoreTypes ? t('showLess') : t('showMore')}
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
                                    <span>{t('priceRange')}</span>
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
                                                <label className="text-xs text-gray-500 mb-1 block ltr:text-left rtl:text-right">{t('from')}</label>
                                                <div className="relative">
                                                    <span className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 text-gray-500 text-[10px]`}>{isRTL ? 'ر.س' : 'SAR'}</span>
                                                    <input
                                                        type="number"
                                                        value={minPriceInput}
                                                        onChange={(e) => setMinPriceInput(e.target.value)}
                                                        onBlur={handlePriceApply}
                                                        className={`w-full ${isRTL ? 'pr-8 pl-1' : 'pl-8 pr-1'} py-1.5 sm:py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500`}
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-gray-500 mt-4">-</span>
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500 mb-1 block ltr:text-left rtl:text-right">{t('to')}</label>
                                                <div className="relative">
                                                    <span className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 text-gray-500 text-[10px]`}>{isRTL ? 'ر.س' : 'SAR'}</span>
                                                    <input
                                                        type="number"
                                                        value={maxPriceInput}
                                                        onChange={(e) => setMaxPriceInput(e.target.value)}
                                                        onBlur={handlePriceApply}
                                                        className={`w-full ${isRTL ? 'pr-8 pl-1' : 'pl-8 pr-1'} py-1.5 sm:py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500`}
                                                        placeholder="5000"
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
                                                    setPriceRange([0, val]);
                                                    setMaxPriceInput(val.toString());
                                                }}
                                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                            />
                                            <div className="flex justify-between mt-1 sm:mt-2 text-[10px] text-gray-400">
                                                <span>{formatPriceByLocale(priceRange[0], locale)}</span>
                                                <span>{formatPriceByLocale(priceRange[1], locale)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div className="ltr:text-left rtl:text-right">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{t('allProducts')}</h1>
                                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                    {t('availableCount', { count: filteredProducts.length })}
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
                                <p className="text-gray-400 text-base sm:text-lg mb-2">{t('noProducts')}</p>
                                <p className="text-gray-500 text-xs sm:text-sm">{t('tryAdjusting')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                {filteredProducts.map((product: any) => {
                                    const inWishlist = isInWishlist(product._id.toString());
                                    const localizedName = getLocalizedName(product.name, locale);
                                    return (
                                        <Link
                                            key={product._id}
                                            href={`/products/${product._id}`}
                                            className="group bg-[#12121a] rounded-xl border border-gray-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                                        >
                                            <div className="aspect-[3/4] relative overflow-hidden bg-[#1a1a24]">
                                                {product.imageUrl || product.image ? (
                                                    <img
                                                        src={product.imageUrl || product.image}
                                                        alt={localizedName}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs sm:text-sm">
                                                        No Image
                                                    </div>
                                                )}

                                                <button
                                                    onClick={(e) => handleWishlistToggle(e, product)}
                                                    className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} z-10 p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md border border-gray-700 hover:border-red-500 transition-colors`}
                                                >
                                                    <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-white"}`} />
                                                </button>

                                                {product.rarity && (product.rarity === 'Ultra Rare' || product.rarity === 'Secret Rare') && (
                                                    <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} z-10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-purple-500/80 backdrop-blur-md text-[10px] sm:text-xs font-medium text-white border border-purple-400`}>
                                                        {product.rarity}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-2.5 sm:p-4 ltr:text-left rtl:text-right">
                                                <h3 className="text-white font-semibold text-xs sm:text-sm truncate mb-1 sm:mb-2">
                                                    {localizedName}
                                                </h3>

                                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                                    <span className="text-sm sm:text-lg font-bold text-amber-500">
                                                        {formatPriceByLocale(product.price, locale)}
                                                    </span>

                                                    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${product.inStock
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {product.inStock ? t('inStock') : t('out')}
                                                    </span>
                                                </div>

                                                {product.inStock ? (
                                                    <button
                                                        onClick={(e) => handleAddToCart(e, product)}
                                                        className="w-full py-2 sm:py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                                                    >
                                                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        {t('add')}
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="w-full py-2 sm:py-2.5 bg-gray-700 text-gray-400 font-semibold text-xs sm:text-sm rounded-lg cursor-not-allowed"
                                                    >
                                                        {t('outOfStock')}
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
