'use client';

import { motion } from 'framer-motion';
import { formatPriceByLocale } from '@/utils/currency';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import { useAuthAction } from '@/hooks/useAuthAction';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedText } from '@/utils/localization';
import { useFlyToCart } from '@/hooks/useFlyToCart';

interface Poster {
  id: string;
  name: string | { en: string; ar?: string };
  price: number;
  image: string;
  stockQuantity?: number;
  inStock?: boolean;
}

interface RecommendSectionProps {
  featuredCards?: Poster[];
}

const posterData: Poster[] = [
  {
    id: '1',
    name: { en: 'Pirates Party 2026 Vol.1', ar: 'حفلة القراصنة ٢٠٢٦' },
    price: 24.99,
    image: '/cards/card1.png',

  },
  {
    id: '2',
    name: { en: 'Recommended Decks', ar: 'مجموعات موصى بها' },
    price: 19.99,
    image: '/cards/card3.png',

  },
  {
    id: '3',
    name: { en: "Quick Beginner's Guide", ar: 'دليل المبتدئين السريع' },
    price: 15.99,
    image: '/cards/card3.png',

  },
  {
    id: '4',
    name: { en: 'Teaching App', ar: 'تطبيق التعليم' },
    price: 22.99,
    image: '/cards/card4.png',

  },
  {
    id: '5',
    name: { en: 'Championship 26-27', ar: 'البطولة ٢٦-٢٧' },
    price: 29.99,
    image: '/cards/card1.png',
  },
];

const posterPositions = [
  { top: '15%', left: '5%', rotate: -5 },
  { top: '38%', left: '32%', rotate: 0 },
  { top: '12%', left: '52%', rotate: -1 },
  { top: '5%', left: '72%', rotate: 5 },
  { top: '48%', left: '70%', rotate: -3 },
];

export default function RecommendSectionDesktop({ featuredCards }: RecommendSectionProps) {
  const tActions = useTranslations('Actions');
  const tProducts = useTranslations('Products');
  const locale = useLocale();
  const { checkAuth } = useAuthAction();
  const router = useRouter();
  const { flyToCart } = useFlyToCart();
  const addItemToCart = useCartStore((state) => state.addItem);

  const cards = featuredCards?.length ? featuredCards : posterData;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, card: Poster) => {
    e.preventDefault();
    e.stopPropagation();

    const targetElement = e.currentTarget;
    const localizedName = getLocalizedText(card.name, locale);

    checkAuth(() => {
      flyToCart(targetElement, card.image);
      addItemToCart({
        id: card.id,
        name: localizedName,
        price: card.price,
        quantity: 1,
        image: card.image,
        stockQuantity: card.stockQuantity,
      });
      toast.success(tActions('addedToCart', { name: localizedName }));
    });
  };

  const isRealProductId = (id: string) => id.includes(":");

  const handleProductClick = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isRealProductId(cardId)) return;

    checkAuth(() => {
      router.push(`/products/${cardId}`);
    }, undefined, `/products/${cardId}`);
  };
  return (
    <section className="relative w-full py-[clamp(4rem,10vw,8rem)] overflow-hidden bg-[#0a0a0f]">
      <div
        className="relative mx-auto w-full max-w-[1700px] aspect-[21/8] flex items-center justify-center shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url("/wood-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.4), 0 40px 100px rgba(0,0,0,0.8)',
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 15%, rgba(0,0,0,0.4) 15.1%)',
            backgroundSize: '100% 100%',
          }}
        />

        <div className="absolute top-0 left-0 w-full h-[clamp(20px,4vw,50px)] bg-gradient-to-b from-[#222] via-[#111] to-[#000] border-b-2 border-white/5 flex justify-around items-center px-[2vw] z-30 shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
          {[...Array(25)].map((_, i) => (
            <div
              key={`t-rivet-${i}`}
              className="w-[clamp(10px,1.5vw,18px)] h-[clamp(10px,1.5vw,18px)] rounded-full bg-gradient-to-br from-[#c4a65d] via-[#8b6508] to-[#453204] border border-black/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),2px_2px_4px_rgba(0,0,0,0.6)]"
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[clamp(20px,4vw,50px)] bg-gradient-to-b from-[#000] via-[#111] to-[#222] border-t-2 border-white/5 flex justify-around items-center px-[2vw] z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
          {[...Array(25)].map((_, i) => (
            <div
              key={`b-rivet-${i}`}
              className="w-[clamp(10px,1.5vw,18px)] h-[clamp(10px,1.5vw,18px)] rounded-full bg-gradient-to-br from-[#c4a65d] via-[#8b6508] to-[#453204] border border-black/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),2px_2px_4px_rgba(0,0,0,0.6)]"
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <h2
            className="text-[clamp(5rem,18vw,16rem)] font-black text-black/25 tracking-[0.2em] uppercase whitespace-nowrap"
            style={{
              fontFamily: 'Impact, sans-serif',
              transform: 'scaleY(1.1) rotate(-1deg)',
              textShadow: '2px 2px 0px rgba(255,255,255,0.05)',
            }}
          >
            {tProducts('listingTitle')}
          </h2>
        </div>

        <div className="relative z-20 w-[94%] h-[85%] mx-auto">
          {cards.slice(0, 5).map((card, index) => {
            const pos = posterPositions[index % posterPositions.length];
            const localizedName = getLocalizedText(card.name, locale);

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, rotate: pos.rotate + 10 }}
                whileInView={{ opacity: 1, y: 0, rotate: pos.rotate }}
                whileHover={{ scale: 1.06, rotate: 0, zIndex: 50, transition: { duration: 0.2 } }}
                viewport={{ once: true }}
                onClick={(e) => handleProductClick(e, card.id)}
                className="absolute w-[18%] min-w-[130px] max-w-[280px] aspect-[1/1.4] flex flex-col p-[1.5%] shadow-[5px_15px_40px_rgba(0,0,0,0.7)] cursor-pointer overflow-hidden border-[#5c3a21] border" style={{
                  top: pos.top,
                  left: locale === 'ar' ? 'auto' : pos.left,
                  right: locale === 'ar' ? pos.left : 'auto',
                  backgroundImage: 'url("/wanted-bg.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 border-[clamp(2px,0.5vw,4px)] border-[#5c3a21]/20 pointer-events-none" />

                <div className="w-full text-center mt-[2%] mb-[4%]">
                  <h3
                    className="text-[clamp(1.2rem,3.5vw,2.8rem)] font-black text-[#2e1a0b] tracking-wider leading-none"
                    style={{ fontFamily: 'Impact, sans-serif', transform: 'scaleY(1.3)' }}
                  >
                    WANTED
                  </h3>
                </div>

                <div className="relative w-full aspect-[4/3] overflow-hidden border-[clamp(1px,0.25vw,3px)] border-[#5c3a21]/30 bg-[#f5e6d3] shadow-inner mb-[10%]">
                  <img
                    src={card.image}
                    alt={localizedName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
                </div>

                <div className="w-full text-center flex flex-col items-center flex-grow px-[2%]">
                  <span className="text-[clamp(0.4rem,1.1vw,0.8rem)] font-bold text-[#2e1a0b] tracking-[0.2em] uppercase opacity-75 mb-[2%]">
                    DEAD OR ALIVE
                  </span>

                  <p
                    className="w-full text-[clamp(0.6rem,1.4vw,1rem)] text-[#2e1a0b] font-black leading-tight line-clamp-2 uppercase"
                    style={{ fontFamily: 'Impact, sans-serif' }}
                  >
                    {localizedName}
                  </p>

                  <div className="mt-auto w-full flex justify-between items-center border-t border-[#5c3a21]/20 pt-[4%] pb-[2%]">
                    <span
                      className="text-[clamp(0.8rem,1.8vw,1.5rem)] font-black text-[#2e1a0b]"
                      style={{ fontFamily: 'Impact, sans-serif' }}
                    >
                      {formatPriceByLocale(card.price, locale)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, card)}
                      disabled={card.inStock === false}
                      className={`px-[clamp(6px,1.2vw,12px)] py-[clamp(2px,0.5vw,6px)] rounded-sm text-[clamp(0.5rem,1vw,0.75rem)] font-black uppercase tracking-wider shadow-sm transition-colors ${card.inStock !== false ? "bg-[#2e1a0b] hover:bg-black text-[#f4e4c1]" : "bg-[#2e1a0b]/50 text-[#f4e4c1]/50 cursor-not-allowed"}`}
                    >
                      {card.inStock !== false ? tActions('claim') : tActions('soldOut')}
                    </button>
                  </div>
                </div>

                <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[clamp(4px,1vw,8px)] h-[clamp(4px,1vw,8px)] rounded-full bg-[#111] shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.3)]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}