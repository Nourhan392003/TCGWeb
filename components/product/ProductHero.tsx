"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";

interface ProductHeroProps {
  product: {
    _id: string;
    name: string;
    game?: string;
    rarity?: string;
    condition?: string;
    price: number;
    inStock: boolean;
    stockQuantity?: number;
    imageUrl?: string;
    image?: string;
    isFoil?: boolean;
    isFirstEdition?: boolean;
    isGraded?: boolean;

  };
}

const rarityConfig: Record<string, { label: string; bgColor: string; textColor: string; borderColor: string }> = {
  common: { label: "Common", bgColor: "bg-gray-600/20", textColor: "text-gray-300", borderColor: "border-gray-600/50" },
  uncommon: { label: "Uncommon", bgColor: "bg-green-600/20", textColor: "text-green-300", borderColor: "border-green-600/50" },
  rare: { label: "Rare", bgColor: "bg-blue-600/20", textColor: "text-blue-300", borderColor: "border-blue-600/50" },
  "ultra rare": { label: "Ultra Rare", bgColor: "bg-purple-600/20", textColor: "text-purple-300", borderColor: "border-purple-600/50" },
  "secret rare": { label: "Secret Rare", bgColor: "bg-gradient-to-r from-yellow-600/20 to-orange-600/20", textColor: "text-yellow-300", borderColor: "border-yellow-600/50" },
  promo: { label: "Promo", bgColor: "bg-gray-200/20", textColor: "text-gray-200", borderColor: "border-gray-400/50" },
  "sealed product": { label: "Sealed Product", bgColor: "bg-rose-900/20", textColor: "text-rose-200", borderColor: "border-rose-700/50" },
};

const gameIcons: Record<string, string> = {
  pokemon: "⚡",
  yugioh: "🀄",
  onepiece: "🏴‍☠️",
  magic: "✨",
};

export default function ProductHero({ product }: ProductHeroProps) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();

  const productImage = product.imageUrl || product.image || "";

  const inWishlist = isInWishlist(product._id.toString());

  const handleAddToCart = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to add items to cart");
      router.push("/sign-in");
      return;
    }
    addItem({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: productImage,
      rarity: product.rarity || "",
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to manage wishlist");
      router.push("/sign-in");
      return;
    }
    if (inWishlist) {
      removeWishlistItem(product._id.toString());
      toast.success("Removed from wishlist");
    } else {
      addWishlistItem({
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: productImage,
        rarity: product.rarity,
      });
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const rarityKey = (product.rarity || "").toLowerCase().replace(/ /g, "_");
  const rarityStyle = rarityConfig[rarityKey] || rarityConfig.common;

  return (
    <section className="relative w-full">
      {/* Premium background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f18] via-[#12121f] to-[#0a0a12] -z-20" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(234,179,8,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(249,115,22,0.05) 0%, transparent 50%)' }} />

      {/* Breadcrumbs */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-3 text-base">
          <li>
            <Link href="/" className="text-gray-400 hover:text-yellow-400 transition-colors">
              Home
            </Link>
          </li>
          <li className="text-gray-600">/</li>
          <li>
            <Link href="/products" className="text-gray-400 hover:text-yellow-400 transition-colors">
              Products
            </Link>
          </li>
          <li className="text-gray-600">/</li>
          <li>
            <Link
              href={`/products?game=${product.game?.toLowerCase()}`}
              className="text-gray-400 hover:text-yellow-400 transition-colors capitalize"
            >
              {product.game || "Products"}
            </Link>
          </li>
          <li className="text-gray-600">/</li>
          <li className="text-gray-300 truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Image */}
        <div className="relative order-1 lg:order-1">
          {/* Larger aspect ratio container with inner shadow */}
          <div className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0d0d12] border border-[#2a2a38] shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            {productImage ? (
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-contain p-6 drop-shadow-[0_0_30px_rgba(251,191,36,0.1)]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            {/* Fallback placeholder */}
            <div
              className="hidden absolute inset-0 items-center justify-center bg-[#12121a]"
              style={{ display: productImage ? "none" : "flex" }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{gameIcons[product.game?.toLowerCase() || ""] || "🃏"}</div>
                <p className="text-gray-500 text-sm">No image available</p>
              </div>
            </div>

            {/* Larger, more prominent Stock Badge */}
            <div className="absolute top-5 right-5">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide animate-fade-in ${product.inStock
                  ? "bg-green-500/30 text-green-300 border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  : "bg-red-500/30 text-red-300 border-2 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  }`}
              >
                {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
              </span>
            </div>

            {/* Larger badges with better spacing */}
            <div className="absolute top-5 left-5 flex flex-col gap-3">
              {product.isFoil && (
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border-2 border-cyan-500/50 animate-fade-in">
                  FOIL
                </span>
              )}
              {product.isFirstEdition && (
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-500/30 to-amber-500/30 text-yellow-200 border-2 border-yellow-500/50 animate-fade-in">
                  1ST EDITION
                </span>
              )}
              {product.isGraded && (
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 border-2 border-purple-500/50 animate-fade-in">
                  GRADED
                </span>
              )}
            </div>
          </div>

          {/* Subtle decorative glow */}
          <div className="absolute -inset-6 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-amber-500/5 rounded-3xl blur-3xl -z-10" />
        </div>

        {/* Product Info */}
        <div className="flex flex-col order-2 lg:order-2">
          {/* Game & Rarity */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-gray-300 text-sm">
              <span>{gameIcons[product.game?.toLowerCase() || ""] || "🎴"}</span>
              <span className="capitalize">{product.game || "TCG"}</span>
            </span>
            {product.rarity && (
              <span
                className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${rarityStyle.bgColor} ${rarityStyle.textColor} border ${rarityStyle.borderColor}`}
              >
                {rarityStyle.label}
              </span>
            )}
          </div>

          {/* Cinematic Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight">
            {product.name}
          </h1>

          {/* Subtitle line */}
          {product.game && (
            <p className="text-gray-400 text-lg mb-4 flex items-center gap-2">
              <span className="text-yellow-500/60">{gameIcons[product.game.toLowerCase()]}</span>
              <span className="uppercase tracking-widest text-sm">{product.game} Trading Card Game</span>
            </p>
          )}

          {/* Condition */}
          {product.condition && (
            <p className="text-gray-400 text-base mb-6">
              Condition: <span className="text-white font-medium">{product.condition}</span>
            </p>
          )}

          {/* Price - subtle gold/orange gradient */}
          <div className="mb-8">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 bg-clip-text text-transparent">
              SAR{product.price.toFixed(2)}
            </div>
            <p className="text-gray-500 text-sm mt-2 font-medium">USD</p>
            {product.inStock && product.stockQuantity !== undefined && product.stockQuantity > 0 && (
              <p className="text-amber-400/80 text-sm mt-2">
                Only {product.stockQuantity} left in stock - order soon!
              </p>
            )}
          </div>

          {/* Prominent Stock Info with delivery info */}
          <div className="mb-8 p-5 rounded-xl bg-[#16161e]/90 border-2 border-[#2a2a38] shadow-lg">
            <div className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full ${product.inStock ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
              />
              <div className="flex flex-col">
                <span className={product.inStock ? "text-green-300 font-semibold" : "text-red-300 font-semibold"}>
                  {product.inStock ? "✓ Available for immediate dispatch" : "✗ Currently unavailable"}
                </span>
                {product.inStock && (
                  <span className="text-gray-500 text-sm mt-1">Ships today if ordered before 2PM EST</span>
                )}
              </div>
            </div>
          </div>

          {/* CTA Buttons - bigger with enhanced glow */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-3 px-10 py-5 rounded-xl font-bold text-xl transition-all active:scale-95 hover:scale-[1.02] ${product.inStock
                ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-yellow-500/30"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {product.inStock ? "Add to Cart" : "Sold Out"}
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`px-8 py-5 rounded-xl font-bold text-xl border-2 transition-all active:scale-95 hover:scale-[1.02] ${inWishlist
                ? "bg-red-500/20 text-red-400 border-red-500 hover:bg-red-500/30"
                : "bg-transparent text-gray-300 border-[#2a2a38] hover:border-yellow-500/50 hover:text-yellow-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                }`}
            >
              <Heart className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Quick Specs - 2x2 premium grid with better hover states */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-xl bg-[#12121a]/90 border border-[#2a2a38]">
            <div className="text-center p-4 rounded-lg bg-[#1a1a24] hover:bg-[#222230] transition-colors border border-[#2a2a38]">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Game</p>
              <p className="text-white font-bold text-lg capitalize">{product.game || "TCG"}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#1a1a24] hover:bg-[#222230] transition-colors border border-[#2a2a38]">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Rarity</p>
              <p className="text-white font-bold text-lg">{product.rarity || "N/A"}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#1a1a24] hover:bg-[#222230] transition-colors border border-[#2a2a38]">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Condition</p>
              <p className="text-white font-bold text-lg">{product.condition || "N/A"}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#1a1a24] hover:bg-[#222230] transition-colors border border-[#2a2a38]">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Availability</p>
              <p className={`font-bold text-lg ${product.inStock ? "text-green-400" : "text-red-400"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
