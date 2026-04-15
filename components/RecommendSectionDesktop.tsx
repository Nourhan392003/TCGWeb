'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/currency';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import toast from 'react-hot-toast';

interface Poster {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: string;
}

interface RecommendSectionProps {
  featuredCards?: Poster[];
}

const posterData: Poster[] = [
  {
    id: '1',
    name: 'Luffy - Straw Hat Pirate',
    price: 24.99,
    image: '/cards/card1.png',
    rarity: 'Rare',
  },
  {
    id: '2',
    name: 'Zoro - Three Sword Style',
    price: 19.99,
    image: '/cards/card2.png',
    rarity: 'Rare',
  },
  {
    id: '3',
    name: 'Nami - Navigator',
    price: 15.99,
    image: '/cards/card3.png',
    rarity: 'Uncommon',
  },
  {
    id: '4',
    name: 'Sanji - Black Leg Style',
    price: 22.99,
    image: '/cards/card4.png',
    rarity: 'Rare',
  },
];

const posterPositions = [
  { top: '8%', left: '5%', rotate: -3 },
  { top: '12%', left: '28%', rotate: 2 },
  { top: '6%', left: '51%', rotate: -1 },
  { top: '10%', left: '74%', rotate: 3 },
];

export default function RecommendSection({ featuredCards }: RecommendSectionProps) {
  const addItemToCart = useCartStore((state) => state.addItem);
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();

  const cards = featuredCards?.length ? featuredCards : posterData;

  const handleAddToCart = (e: React.MouseEvent, card: Poster) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart({
      id: card.id,
      name: card.name,
      price: card.price,
      quantity: 1,
      image: card.image,
      rarity: card.rarity,
    });
    toast.success(`${card.name} added to cart!`);
  };


  return (
    <section className="relative z-10 w-full min-h-screen flex justify-center items-center py-[clamp(3rem,8vw,6rem)] overflow-hidden">
      <div
        className="relative w-[clamp(320px,95vw,1400px)] aspect-[16/10] shadow-[0_clamp(20px,5vw,60px)_clamp(40px,10vw,100px)_rgba(0,0,0,0.6)] border-[clamp(4px,1.2vw,12px)] border-[#1b120a]"
        style={{
          transform: 'rotate(-3deg)',
          backgroundImage: 'url("/wood-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        <div className="absolute top-0 left-0 w-full h-[clamp(30px,5vw,50px)] bg-gradient-to-b from-[#2a2a2a] via-[#111] to-[#000] border-b-[clamp(2px,0.5vw,4px)] border-black/90 flex justify-around items-center z-10 shadow-[0_clamp(5px,1.5vw,15px)_clamp(10px,3vw,25px)_rgba(0,0,0,0.5)]">
          {[...Array(20)].map((_, i) => (
            <div
              key={`top-${i}`}
              className="w-[clamp(10px,2vw,20px)] h-[clamp(10px,2vw,20px)] rounded-full bg-gradient-to-br from-[#d4af37] to-[#8b6508] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4)] border-[clamp(1px,0.3vw,2px)] border-black/80"
            />
          ))}
        </div>

        <div
          className="relative z-20 w-full h-full flex flex-col items-center justify-center px-[clamp(1rem,3vw,4rem)] py-[clamp(2rem,5vw,4rem)]"
          style={{ transform: 'rotate(3deg)' }}
        >
          <h2
            className="text-[clamp(3rem,10vw,7rem)] font-black text-[#f4e4c1] tracking-[0.15em] uppercase"
            style={{
              fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
              textShadow: `
                clamp(2px,0.6vw,5px) clamp(2px,0.6vw,5px) 0px #3e2723,
                clamp(3px,0.8vw,6px) clamp(3px,0.8vw,6px) 0px #000,
                0px clamp(5px,1.5vw,15px) clamp(10px,2.5vw,25px) rgba(0,0,0,0.8)
              `,
            }}
          >
            RECOMMEND
          </h2>

          <div className="relative w-full h-[clamp(300px,50vw,600px)] mt-[clamp(1rem,3vw,2rem)]">
            {cards.slice(0, 4).map((card, index) => {
              const pos = posterPositions[index];
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.8, rotate: Number(pos.rotate) + 10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: Number(pos.rotate), y: 0 }}
                  whileHover={{ scale: 1.03, rotate: 0, zIndex: 40 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20, delay: index * 0.1 }}
                  className="absolute group flex flex-col items-center pt-[clamp(0.5rem,1.5vw,1rem)] pb-[clamp(0.3rem,1vw,0.5rem)] px-[clamp(0.3rem,1vw,0.5rem)] shadow-[0_clamp(10px,2.5vw,25px)_clamp(20px,5vw,50px)_rgba(0,0,0,0.7)] cursor-pointer"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    width: 'clamp(120px, 22%, 240px)',
                    maxWidth: '24%',
                    backgroundImage: 'url("/wanted-bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '2px solid #5c3a21',
                    borderRadius: '2px',
                  }}
                >
                  <div className="absolute top-[clamp(2px,0.5vw,4px)] left-1/2 -translate-x-1/2 w-[clamp(4px,1vw,6px)] h-[clamp(4px,1vw,6px)] rounded-full bg-[#111] border border-black shadow-sm z-30" />

                  <div className="w-full text-center mb-[clamp(0.2rem,0.5vw,0.5rem)]">
                    <h3
                      className="text-[clamp(1.5rem,4vw,3rem)] font-black text-[#2e1a0b] tracking-wider leading-none"
                      style={{ fontFamily: 'Impact, sans-serif', transform: 'scaleY(1.3)' }}
                    >
                      WANTED
                    </h3>
                  </div>

                  <Link
                    href={`/products/${card.id}`}
                    className="w-full relative aspect-[4/3] flex items-center justify-center overflow-hidden mb-[clamp(0.2rem,0.5vw,0.5rem)] border-[2px] border-[#e8decd] shadow-inner"
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="w-full text-center flex flex-col items-center px-[clamp(2px,0.5vw,4px)] flex-grow">
                    <h4
                      className="text-[clamp(0.6rem,1.5vw,1rem)] font-bold text-[#2e1a0b] tracking-widest"
                      style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    >
                      DEAD OR ALIVE
                    </h4>
                    <Link href={`/products/${card.id}`} className="block w-full mb-[clamp(0.2rem,0.5vw,0.5rem)]">
                      <p className="text-[clamp(0.65rem,1.8vw,1rem)] text-[#2e1a0b] font-bold leading-snug line-clamp-2 hover:text-black">
                        {card.name}
                      </p>
                    </Link>
                    <div className="mt-auto w-full flex justify-between items-end border-t-[2px] border-[#5c3a21]/30 pt-[clamp(0.2rem,0.5vw,0.4rem)]">
                      <p
                        className="text-[clamp(1rem,2.5vw,2rem)] font-black text-[#2e1a0b] tracking-tight"
                        style={{ fontFamily: 'Impact, sans-serif' }}
                      >
                        {formatPrice(card.price)}
                      </p>
                      <button
                        onClick={(e) => handleAddToCart(e, card)}
                        className="bg-[#2e1a0b] hover:bg-black text-[#f4e4c1] px-[clamp(0.3rem,1vw,0.5rem)] py-[clamp(0.2rem,0.5vw,0.3rem)] font-bold uppercase text-[clamp(0.5rem,1.2vw,0.7rem)] tracking-widest transition-colors"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[clamp(30px,5vw,50px)] bg-gradient-to-b from-[#2a2a2a] via-[#111] to-[#000] border-t-[clamp(2px,0.5vw,4px)] border-black/90 flex justify-around items-center z-10 shadow-[0_-clamp(5px,1.5vw,15px)_clamp(10px,3vw,25px)_rgba(0,0,0,0.5)]">
          {[...Array(20)].map((_, i) => (
            <div
              key={`bottom-${i}`}
              className="w-[clamp(10px,2vw,20px)] h-[clamp(10px,2vw,20px)] rounded-full bg-gradient-to-br from-[#d4af37] to-[#8b6508] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4)] border-[clamp(1px,0.3vw,2px)] border-black/80"
            />
          ))}
        </div>
      </div>
    </section>
  );
}