"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useAuthAction } from "@/hooks/useAuthAction";
import { useTranslations, useLocale } from "next-intl";
import { formatPriceByLocale } from "@/utils/currency";
import { getLocalizedText } from "@/utils/localization";

interface ProductInfoSectionsProps {
  product: {
    _id: string;
    name: string | { en: string; ar?: string };
    game?: string;
    description?: string | { en: string; ar?: string };
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
    name: string | { en: string; ar?: string };
    price: number;
    imageUrl?: string;
    image?: string;
    rarity?: string;
    inStock: boolean;
  }>;
  loadingRelated?: boolean;
}

const PLACEHOLDER_IMAGE = "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg";

function formatDescription(description?: string | { en: string; ar?: string }, locale?: string): string[] {
  if (!description) return [];
  const text = typeof description === "string"
    ? description
    : (description[locale as "en" | "ar"] || description.en || "");

  return text.split("\n").filter((line) => line.trim());
}

/**
 * Generates translated highlights based on product data
 */
function generateHighlights(product: ProductInfoSectionsProps["product"], t: any, locale: string): string[] {
   const highlights: string[] = [];
   const game = product.game?.toLowerCase() || "";
   // getLocalizedContent always returns a string, safe for toLowerCase
   const name = getLocalizedText(product.name, locale).toLowerCase();

   if ((product.condition || "").toLowerCase().includes("sealed")) {
     highlights.push(t('h1'));
     highlights.push(t('h2'));
     highlights.push(t('h3'));
   } else if ((product.condition || "").toLowerCase().includes("box") || name.includes("box")) {
     highlights.push(t('h4'));
     highlights.push(t('h5'));
     highlights.push(t('h6'));
   }

   if ((product.rarity || "").toLowerCase().includes("secret") || (product.rarity || "").toLowerCase().includes("ultra")) {
     highlights.push(t('h7'));
     highlights.push(t('h8'));
   }

   if (product.rarity && typeof product.rarity === 'string') {
     const rarityLower = product.rarity.toLowerCase();
     if (rarityLower.includes("secret") || rarityLower.includes("ultra")) {
       highlights.push(t('h7'));
       highlights.push(t('h8'));
     }
   }

   if (product.isFoil) {
     highlights.push(t('h9'));
   }

   if (game === "pokemon") {
     highlights.push(t('h10'));
   } else if (game === "yugioh") {
     highlights.push(t('h11'));
   } else if (game === "onepiece") {
     highlights.push(t('h12'));
   } else if (game === "magic") {
     highlights.push(t('h13'));
   }

   if (highlights.length === 0) {
     highlights.push(t('h14'));
     highlights.push(t('h15'));
     highlights.push(t('h16'));
   }

   return highlights;
}

export default function ProductInfoSections({
  product,
  relatedProducts,
  loadingRelated,
}: ProductInfoSectionsProps) {
  const t = useTranslations('ProductInfo');
  const locale = useLocale();
  const { checkAuth } = useAuthAction();
  const router = useRouter();

  const descriptionLines = formatDescription(product.description, locale);
  const highlights = generateHighlights(product, t, locale);

  return (
    <div className="space-y-12 py-8 ltr:text-left rtl:text-right">
      {/* Description Section */}
      {descriptionLines.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full" />
            {t('description')}
          </h2>
          <div className="bg-[#16161e]/60 rounded-xl border border-white/5 p-6">
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
          <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full" />
          {t('highlights')}
        </h2>
        <div className="bg-[#16161e]/60 rounded-xl border border-white/5 p-6">
          <ul className="space-y-3">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Disclaimer */}
      <section>
        <div className="bg-white/5 rounded-xl border border-white/5 p-4">
          <p className="text-gray-500 text-xs leading-relaxed">
            <strong className="text-gray-400">{t('note')}:</strong> {t('disclaimer')}
          </p>
        </div>
      </section>

      {/* Related Products Section */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full" />
          {t('relatedProducts')}
        </h2>

        {loadingRelated ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-white/5 rounded-xl mb-3" />
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : relatedProducts && relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((item) => {
               const localizedItemName = getLocalizedText(item.name, locale);
              return (
                <div
                  key={item._id}
                  onClick={() => checkAuth(() => router.push(`/products/${item._id}`), undefined, `/products/${item._id}`)}
                  className="group block cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0d0d12] border border-white/5 group-hover:border-amber-500/30 transition-all duration-300">
                    <img
                      src={item.imageUrl || item.image || PLACEHOLDER_IMAGE}
                      alt={localizedItemName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-red-400 font-semibold text-sm">{t('outOfStock')}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="text-white font-medium text-sm truncate group-hover:text-amber-500 transition-colors">
                      {localizedItemName}
                    </h3>
                    <p className="text-amber-500 text-sm font-bold">
                      {formatPriceByLocale(item.price, locale)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl border border-white/5 p-8 text-center">
            <p className="text-gray-500">{t('noRelated')}</p>
          </div>
        )}

        {relatedProducts && relatedProducts.length > 4 && (
          <div className="mt-6 text-center">
            <Link
              href={`/products?game=${product.game?.toLowerCase()}`}
              className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold transition-colors"
            >
              {t('viewMore', { game: product.game ?? '' })}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
