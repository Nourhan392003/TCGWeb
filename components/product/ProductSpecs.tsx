"use client";

import { formatPriceByLocale } from "@/utils/currency";
import { useTranslations, useLocale } from "next-intl";

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

const rarityConfig: Record<string, { color: string }> = {
  common: { color: "text-gray-300" },
  uncommon: { color: "text-green-300" },
  rare: { color: "text-blue-300" },
  "ultra_rare": { color: "text-purple-300" },
  "secret_rare": { color: "text-yellow-300" },
};

export default function ProductSpecs({ product }: ProductSpecsProps) {
  const t = useTranslations('ProductSpecs');
  const locale = useLocale();

  const specs = [
    {
      label: t('game'),
      value: product.game || "TCG",
      icon: "🎴",
    },
    {
      label: t('rarity'),
      value: product.rarity || t('notSpecified'),
      icon: "⭐",
      color: rarityConfig[(product.rarity || "").toLowerCase().replace(/ /g, "_")]?.color || "text-white",
    },
    {
      label: t('condition'),
      value: product.condition || t('notSpecified'),
      icon: "📦",
    },
    {
      label: t('availability'),
      value: product.inStock ? t('inStock') : t('outOfStock'),
      icon: "📍",
      color: product.inStock ? "text-green-400" : "text-red-400",
      badge: product.inStock,
    },
    {
      label: t('price'),
      value: formatPriceByLocale(product.price, locale),
      icon: "💰",
      highlight: true,
    },
  ];

  const additionalFeatures = [
    ...(product.isFoil ? [t('foil')] : []),
    ...(product.isFirstEdition ? [t('firstEdition')] : []),
    ...(product.isGraded ? [t('graded')] : []),
  ];

  return (
    <section className="w-full ltr:text-left rtl:text-right">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full" />
        {t('title')}
      </h2>

      <div className="bg-[#16161e]/80 rounded-xl border border-white/5 overflow-hidden">
        <div className="divide-y divide-white/5">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{spec.icon}</span>
                <span className="text-gray-400">{spec.label}</span>
              </div>
              <span
                className={`font-semibold ${spec.highlight
                  ? "text-xl text-amber-500"
                  : spec.color || "text-white"
                  }`}
              >
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        {additionalFeatures.length > 0 && (
          <div className="p-4 border-t border-white/5 bg-black/20">
            <p className="text-gray-400 text-sm mb-2">{t('specialAttributes')}</p>
            <div className="flex flex-wrap gap-2">
              {additionalFeatures.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20"
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
