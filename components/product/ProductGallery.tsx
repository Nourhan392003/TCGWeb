"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: (string | undefined)[];
  productName: string;
}

const PLACEHOLDER_IMAGE = "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg";

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const validImages = images.filter((img): img is string => !!img);
  
  if (validImages.length === 0) {
    return null;
  }

  if (validImages.length === 1) {
    return (
      <section className="w-full">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full" />
          Product Gallery
        </h2>
        <div className="relative aspect-[3/4] md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0d0d12] border border-[#2a2a38]">
          <img
            src={validImages[0]}
            alt={`${productName} - View`}
            className="w-full h-full object-contain p-6"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full" />
        Product Gallery
      </h2>
      
      {/* Main Image */}
      <div className="relative aspect-[3/4] md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0d0d12] border border-[#2a2a38] mb-4">
        <img
          src={validImages[selectedIndex]}
          alt={`${productName} - View ${selectedIndex + 1}`}
          className="w-full h-full object-contain p-6 transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {validImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedIndex === index
                ? "border-yellow-500 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
