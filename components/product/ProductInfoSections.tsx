"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductInfoSectionsProps {
  product: {
    _id: string;
    name: string;
    game?: string;
    description?: string;
    rarity?: string;
    condition?: string;
    price: number;
    inStock: boolean;
    imageUrl?: string;
    image?: string;
    isFoil?: boolean;
  };
  relatedProducts?: Array<{
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
    image?: string;
    rarity?: string;
    inStock: boolean;
  }>;
  loadingRelated?: boolean;
}

const PLACEHOLDER_IMAGE = "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg";

function formatDescription(description?: string): string[] {
  if (!description) return [];
  return description.split("\n").filter((line) => line.trim());
}

function generateHighlights(product: ProductInfoSectionsProps["product"]): string[] {
  const highlights: string[] = [];
  const game = product.game?.toLowerCase() || "";

  if (product.condition?.toLowerCase().includes("sealed")) {
    highlights.push("Factory sealed - pristine condition");
    highlights.push("Original packaging intact");
    highlights.push("Authenticity verified");
  } else if (product.condition?.toLowerCase().includes("box") || product.name.toLowerCase().includes("box")) {
    highlights.push("Complete booster box");
    highlights.push("All packs sealed");
    highlights.push("Collector's item");
  }

  if (product.rarity?.toLowerCase().includes("secret") || product.rarity?.toLowerCase().includes("ultra")) {
    highlights.push("High-value collector's item");
    highlights.push("Limited edition release");
  }

  if (product.isFoil) {
    highlights.push("Foil finish");
  }

  if (game === "pokemon") {
    highlights.push("Official Pokémon TCG merchandise");
  } else if (game === "yugioh") {
    highlights.push("Official Yu-Gi-Oh! TCG product");
  } else if (game === "onepiece") {
    highlights.push("One Piece Card Game official product");
  } else if (game === "magic") {
    highlights.push("Magic: The Gathering official set");
  }

  if (highlights.length === 0) {
    highlights.push("Authentic trading card game product");
    highlights.push("Direct from authorized distributors");
    highlights.push("Carefully packed for delivery");
  }

  return highlights;
}

export default function ProductInfoSections({
  product,
  relatedProducts,
  loadingRelated,
}: ProductInfoSectionsProps) {
  const descriptionLines = formatDescription(product.description);
  const highlights = generateHighlights(product);

  return (
    <div className="space-y-12">
      {/* Description Section */}
      {descriptionLines.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full" />
            Product Description
          </h2>
          <div className="bg-[#16161e]/60 rounded-xl border border-[#2a2a38] p-6">
            <div className="prose prose-invert max-w-none">
              {descriptionLines.map((line, index) => (
                <p key={index} className="text-gray-300 leading-relaxed mb-3 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights / Contents Section */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full" />
          Product Highlights
        </h2>
        <div className="bg-[#16161e]/60 rounded-xl border border-[#2a2a38] p-6">
          <ul className="space-y-3">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Disclaimer */}
      <section>
        <div className="bg-[#12121a]/60 rounded-xl border border-[#2a2a38]/50 p-4">
          <p className="text-gray-500 text-xs leading-relaxed">
            <strong className="text-gray-400">Note:</strong> Images are for reference only.
            Actual product may vary slightly due to monitor settings or manufacturing differences.
            All products are physically inspected before shipping to ensure quality.
          </p>
        </div>
      </section>

      {/* Related Products Section */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full" />
          Related Products
        </h2>

        {loadingRelated ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#1a1a24] rounded-xl mb-3" />
                <div className="h-4 bg-[#1a1a24] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#1a1a24] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : relatedProducts && relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((item) => (
              <Link
                key={item._id}
                href={`/products/${item._id}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0d0d12] border border-[#2a2a38] group-hover:border-yellow-500/50 transition-all duration-300">
                  <img
                    src={item.imageUrl || item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-red-400 font-semibold text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-white font-medium text-sm truncate group-hover:text-yellow-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-sm">SAR{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#16161e]/40 rounded-xl border border-[#2a2a38] p-8 text-center">
            <p className="text-gray-500">No related products found.</p>
          </div>
        )}

        {relatedProducts && relatedProducts.length > 4 && (
          <div className="mt-4 text-center">
            <Link
              href={`/products?game=${product.game?.toLowerCase()}`}
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              View more from {product.game}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
