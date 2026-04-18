"use client";

import { useRouter, Link } from "@/i18n/navigation";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";
import { useAuthAction } from "@/hooks/useAuthAction";
import { useTranslations, useLocale } from "next-intl";
import { formatPriceByLocale } from "@/utils/currency";
import { getLocalizedContent } from "@/utils/localization";

interface ProductHeroProps {
  product: {
    _id: string;
    name: string | { en: string; ar?: string };
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

const rarityConfig: Record<string, { labelKey: string; bgColor: string; textColor: string; borderColor: string }> = {
  common: { labelKey: "common", bgColor: "bg-gray-600/20", textColor: "text-gray-300", borderColor: "border-gray-600/50" },
  uncommon: { labelKey: "uncommon", bgColor: "bg-green-600/20", textColor: "text-green-300", borderColor: "border-green-600/50" },
  rare: { labelKey: "rare", bgColor: "bg-blue-600/20", textColor: "text-blue-300", borderColor: "border-blue-600/50" },
  "ultra_rare": { labelKey: "ultra_rare", bgColor: "bg-purple-600/20", textColor: "text-purple-300", borderColor: "border-purple-600/50" },
  "secret_rare": { labelKey: "secret_rare", bgColor: "bg-gradient-to-r from-yellow-600/20 to-orange-600/20", textColor: "text-yellow-300", borderColor: "border-yellow-600/50" },
};

const gameIcons: Record<string, string> = {
  pokemon: "⚡",
  yugioh: "🀄",
  onepiece: "🏴‍☠️",
  magic: "✨",
};

export default function ProductHero({ product }: ProductHeroProps) {
  const t = useTranslations('ProductHero');
  const tActions = useTranslations('Actions');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const { checkAuth } = useAuthAction();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();

  const localizedName = getLocalizedContent(product.name, locale);
  const productImage = product.imageUrl || product.image || "";
  const inWishlist = isInWishlist(product._id.toString());

  const handleAddToCart = () => {
    checkAuth(() => {
      addItem({
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: 1,
        image: productImage,
        rarity: product.rarity || "",
      });
      toast.success(tActions('addedToCart', { name: localizedName }));
    });
  };

  const handleWishlistToggle = () => {
    checkAuth(() => {
      if (inWishlist) {
        removeWishlistItem(product._id.toString());
        toast.success(tActions('removedFromWishlist', { name: localizedName }));
      } else {
        addWishlistItem({
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: productImage,
          rarity: product.rarity,
        });
        toast.success(tActions('addedToWishlist', { name: localizedName }));
      }
    });
  };

  const rarityKey = (product.rarity || "").toLowerCase().replace(/ /g, "_");
  const rarityStyle = rarityConfig[rarityKey] || rarityConfig.common;

  return (
    <section className="relative w-full py-8">
      {/* Premium background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f18] via-[#12121f] to-[#0a0a12] -z-20" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(234,179,8,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(249,115,22,0.05) 0%, transparent 50%)' }} />

      {/* Breadcrumbs */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-3 text-sm sm:text-base">
          <li>
            <Link href="/" className="text-gray-400 hover:text-amber-500 transition-colors">
              {t('home')}
            </Link>
          </li>
          <li className="text-gray-600 rtl:rotate-180">/</li>
          <li>
            <Link href="/products" className="text-gray-400 hover:text-amber-500 transition-colors">
              {t('products')}
            </Link>
          </li>
          <li className="text-gray-600 rtl:rotate-180">/</li>
          <li>
            <span
              className="text-gray-300 truncate max-w-[150px] sm:max-w-[200px]"
            >
              {localizedName}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image */}
        <div className="relative">
          <div className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0d0d12] border border-[#2a2a38] shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            {productImage ? (
              <img
                src={productImage}
                alt={localizedName}
                className="w-full h-full object-contain p-6 drop-shadow-[0_0_30px_rgba(251,191,36,0.1)]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#12121a]">
                <div className="text-center">
                  <div className="text-6xl mb-4">{gameIcons[product.game?.toLowerCase() || ""] || "🃏"}</div>
                  <p className="text-gray-500 text-sm">{t('noImage')}</p>
                </div>
              </div>
            )}

            {/* Stock Badge */}
            <div className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'}`}>
              <span
                className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-wide ${product.inStock
                  ? "bg-green-500/30 text-green-300 border border-green-500/50"
                  : "bg-red-500/30 text-red-300 border border-red-500/50"
                  }`}
              >
                {product.inStock ? t('inStock') : t('outOfStock')}
              </span>
            </div>

            {/* Feature Badges */}
            <div className={`absolute top-5 ${isRTL ? 'right-5' : 'left-5'} flex flex-col gap-3`}>
              {product.isFoil && (
                <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                  {t('foil')}
                </span>
              )}
              {product.isFirstEdition && (
                <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-500/30">
                  {t('firstEdition')}
                </span>
              )}
              {product.isGraded && (
                <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                  {t('graded')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col ltr:text-left rtl:text-right">
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
                {product.rarity}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
            {localizedName}
          </h1>

          {product.game && (
            <p className="text-gray-400 text-base mb-4 flex items-center gap-2">
              <span className="text-amber-500/60">{gameIcons[product.game.toLowerCase()]}</span>
              <span className="uppercase tracking-widest text-xs">{product.game} {t('tcg')}</span>
            </p>
          )}

          {product.condition && (
            <p className="text-gray-400 text-sm sm:text-base mb-6">
              {t('condition')}: <span className="text-white font-medium">{product.condition}</span>
            </p>
          )}

          {/* Price */}
          <div className="mb-8">
            <div className="text-4xl md:text-6xl font-black text-amber-500">
              {formatPriceByLocale(product.price, locale)}
            </div>
            {product.inStock && product.stockQuantity !== undefined && product.stockQuantity > 0 && (
              <p className="text-amber-400/80 text-xs sm:text-sm mt-2">
                {t('onlyLeft', { count: product.stockQuantity })}
              </p>
            )}
          </div>

          {/* Stock & Delivery Info */}
          <div className="mb-8 p-5 rounded-xl bg-[#16161e]/90 border border-[#2a2a38]">
            <div className="flex items-center gap-4">
              <div
                className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
              />
              <div className="flex flex-col">
                <span className={product.inStock ? "text-green-300 text-sm font-semibold" : "text-red-300 text-sm font-semibold"}>
                  {product.inStock ? t('dispatch') : t('unavailable')}
                </span>
                {product.inStock && (
                  <span className="text-gray-500 text-xs mt-1">{t('shipsToday')}</span>
                )}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 ${product.inStock
                ? "bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/10"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {product.inStock ? t('addToCart') : t('soldOut')}
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`px-6 py-4 rounded-xl transition-all active:scale-95 ${inWishlist
                ? "bg-red-500/10 text-red-500 border-2 border-red-500/30"
                : "bg-white/5 text-white border-2 border-white/10 hover:border-amber-500/50 hover:text-amber-500"
                }`}
            >
              <Heart className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-xl bg-black/40 border border-white/5">
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{t('game')}</p>
              <p className="text-white font-bold text-sm capitalize">{product.game || "TCG"}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{t('rarity')}</p>
              <p className="text-white font-bold text-sm">{product.rarity || "N/A"}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{t('condition')}</p>
              <p className="text-white font-bold text-sm">{product.condition || "N/A"}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{t('availability')}</p>
              <p className={`font-bold text-sm ${product.inStock ? "text-green-400" : "text-red-400"}`}>
                {product.inStock ? t('inStock') : t('outOfStock')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
