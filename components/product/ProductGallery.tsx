"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedContent } from "@/utils/localization";

interface ProductGalleryProps {
  product: {
    _id: string;
    name: string | { en: string; ar?: string };
    imageUrl?: string;
    image?: string;
  };
}

const PLACEHOLDER_IMAGE = "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg";

export default function ProductGallery({ product }: ProductGalleryProps) {
  const t = useTranslations('ProductGallery');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const images = [product.imageUrl || product.image].filter((img): img is string => !!img);
  const localizedName = getLocalizedContent(product.name, locale);

  const validImages = images.filter((img): img is string => !!img);
  
  if (validImages.length === 0) {
    return null;
  }

  return (
    <section className="w-full ltr:text-left rtl:text-right">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full" />
        {t('title')}
      </h2>
      
      {/* Main Image */}
      <div className="relative aspect-[3/4] md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0d0d12] border border-white/5 mb-4">
        <img
          src={validImages[selectedIndex]}
          alt={`${localizedName} - View ${selectedIndex + 1}`}
          className="w-full h-full object-contain p-6 transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedIndex === index
                  ? "border-amber-500 shadow-[0_0_15px_rgba(245,165,36,0.2)]"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`${localizedName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
