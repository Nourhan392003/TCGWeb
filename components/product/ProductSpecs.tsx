"use client";

import { formatPrice } from "@/utils/currency";

interface ProductSpecsProps {
  product: {
    game?: string;
    rarity?: string;
    condition?: string;
    price: number;
    inStock: boolean;
    stockQuantity?: number;
    isFoil?: boolean;
    isFirstEdition?: boolean;
    isGraded?: boolean;
  };
}

const rarityConfig: Record<string, { label: string; color: string }> = {
  common: { label: "Common", color: "text-gray-300" },
  uncommon: { label: "Uncommon", color: "text-green-300" },
  rare: { label: "Rare", color: "text-blue-300" },
  "ultra rare": { label: "Ultra Rare", color: "text-purple-300" },
  "secret rare": { label: "Secret Rare", color: "text-yellow-300" },
  promo: { label: "Promo", color: "text-gray-200" },
  "sealed product": { label: "Sealed Product", color: "text-rose-200" },
};

export default function ProductSpecs({ product }: ProductSpecsProps) {
  const specs = [
    {
      label: "Game",
      value: product.game || "TCG",
      icon: "🎴",
    },
    {
      label: "Rarity",
      value: product.rarity || "Not Specified",
      icon: "⭐",
      color: rarityConfig[(product.rarity || "").toLowerCase().replace(/ /g, "_")]?.color || "text-white",
    },
    {
      label: "Condition",
      value: product.condition || "Not Specified",
      icon: "📦",
    },
    {
      label: "Availability",
      value: product.inStock ? "In Stock" : "Out of Stock",
      icon: "📍",
      color: product.inStock ? "text-green-400" : "text-red-400",
      badge: product.inStock,
    },
    {
      label: "Price",
      value: formatPrice(product.price),
      icon: "💰",
      highlight: true,
    },
  ];

  const additionalFeatures = [
    ...(product.isFoil ? ["Foil"] : []),
    ...(product.isFirstEdition ? ["1st Edition"] : []),
    ...(product.isGraded ? ["Graded"] : []),
  ];

  return (
    <section className="w-full">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full" />
        Product Details
      </h2>

      <div className="bg-[#16161e]/80 rounded-xl border border-[#2a2a38] overflow-hidden">
        <div className="divide-y divide-[#2a2a38]">
          {specs.map((spec, index) => (
            <div
              key={spec.label}
              className="flex items-center justify-between p-4 hover:bg-[#1a1a24]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{spec.icon}</span>
                <span className="text-gray-400">{spec.label}</span>
              </div>
              <span
                className={`font-semibold ${spec.highlight
                  ? "text-xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                  : spec.color || "text-white"
                  }`}
              >
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        {additionalFeatures.length > 0 && (
          <div className="p-4 border-t border-[#2a2a38] bg-[#12121a]/50">
            <p className="text-gray-400 text-sm mb-2">Special Attributes:</p>
            <div className="flex flex-wrap gap-2">
              {additionalFeatures.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
