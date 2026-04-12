"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";

interface TCGCard {
  _id: string;
  name: string;
  game: string;
  price: number;
  image: string;
  imageUrl?: string;
  rarity: string;
  condition?: string;
  description?: string;
  inStock?: boolean;
  stockQuantity?: number;
  isFoil?: boolean;
  isFirstEdition?: boolean;
  isGraded?: boolean;
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

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();

  const rawProduct = useQuery(api.products.getProductById, { id: productId as any });

  console.log("DETAIL PRODUCT ID:", rawProduct?._id);
  console.log("DETAIL IMAGE ID:", rawProduct?.imageId);
  console.log("DETAIL IMAGE URL:", rawProduct?.imageUrl);
  const product = rawProduct as TCGCard | null | undefined;

  const productImage = product?.imageUrl || product?.image || "";
  const inStock = product?.inStock ?? true;
  const inWishlist = isInWishlist(product?._id?.toString() || "");

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: productImage,
      rarity: product.rarity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;

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

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Product not found!</h1>
      </div>
    );
  }

  const rarityKey = product.rarity.toLowerCase().replace(/ /g, "_");
  const rarityStyle = rarityConfig[rarityKey] || { label: product.rarity || "Common", bgColor: "bg-gray-600/20", textColor: "text-gray-300", borderColor: "border-gray-600/50" };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-yellow-400 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-700">/</li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-yellow-400 transition-colors">
                products
              </Link>
            </li>
            <li className="text-gray-700">/</li>
            <li>
              <Link
                href={`/products?game=${product.game?.toLowerCase()}`}
                className="text-gray-500 hover:text-yellow-400 transition-colors capitalize"
              >
                {product.game || "Products"}
              </Link>
            </li>
            <li className="text-gray-700">/</li>
            <li className="text-gray-300 truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="relative aspect-[3/4] md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0d0d12] border border-[#2a2a38]">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
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

                {/* Stock Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${inStock
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                  >
                    {inStock ? "IN STOCK" : "OUT OF STOCK"}
                  </span>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isFoil && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30">
                      FOIL
                    </span>
                  )}
                  {product.isFirstEdition && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border border-yellow-500/30">
                      1ST EDITION
                    </span>
                  )}
                  {product.isGraded && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                      GRADED
                    </span>
                  )}
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-3xl blur-3xl -z-10" />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
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

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  SAR{product.price.toFixed(2)}
                </div>
                {inStock && product.stockQuantity !== undefined && product.stockQuantity > 0 && (
                  <p className="text-gray-500 text-sm mt-1">
                    Only {product.stockQuantity} left in stock
                  </p>
                )}
              </div>

              {/* Stock Info */}
              <div className="mb-8 p-4 rounded-xl bg-[#16161e]/80 border border-[#2a2a38]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${inStock ? "bg-green-500 animate-pulse" : "bg-red-500"
                      }`}
                  />
                  <span className={inStock ? "text-green-400" : "text-red-400"}>
                    {inStock ? "Available for immediate dispatch" : "Currently unavailable"}
                  </span>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#12121a]/80 border border-[#2a2a38] mb-8">
                <div className="text-center p-3 rounded-lg bg-[#1a1a24]">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Game</p>
                  <p className="text-white font-semibold capitalize">{product.game || "TCG"}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-[#1a1a24]">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Rarity</p>
                  <p className="text-white font-semibold">{product.rarity || "N/A"}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-[#1a1a24]">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Condition</p>
                  <p className="text-white font-semibold">{product.condition || "N/A"}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-[#1a1a24]">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Availability</p>
                  <p className={`font-semibold ${inStock ? "text-green-400" : "text-red-400"}`}>
                    {inStock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 ${inStock
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {inStock ? "Add to Cart" : "Sold Out"}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`px-6 py-4 rounded-xl font-bold text-lg border-2 transition-all active:scale-95 ${inWishlist
                    ? "bg-red-500/20 text-red-400 border-red-500 hover:bg-red-500/30"
                    : "bg-transparent text-gray-300 border-[#2a2a38] hover:border-yellow-500/50 hover:text-yellow-400"
                    }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {product.description && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full" />
              Product Description
            </h2>
            <div className="bg-[#16161e]/60 rounded-xl border border-[#2a2a38] p-6">
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
