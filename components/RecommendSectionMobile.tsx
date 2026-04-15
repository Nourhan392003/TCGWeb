'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/currency';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

interface Poster {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface RecommendSectionProps {
    featuredCards?: Poster[];
}

const posterData: Poster[] = [
    { id: '1', name: 'Pirates Party 2026 Vol.1', price: 24.99, image: '/cards/card1.png' },
    { id: '2', name: 'Recommended Decks', price: 19.99, image: '/cards/card2.png' },
    { id: '3', name: "Quick Beginner's Guide", price: 15.99, image: '/cards/card3.png' },
    { id: '4', name: 'Teaching App', price: 22.99, image: '/cards/card4.png' },
    { id: '5', name: 'Championship 26-27', price: 29.99, image: '/cards/card1.png' },
];

export default function RecommendSectionMobile({ featuredCards }: RecommendSectionProps) {
    const addItemToCart = useCartStore((state) => state.addItem);

    const cards = featuredCards?.length ? featuredCards : posterData;

    const handleAddToCart = (e: React.MouseEvent, card: any) => {
        e.preventDefault();
        e.stopPropagation();
        addItemToCart({
            id: card.id,
            name: card.name,
            price: card.price,
            quantity: 1,
            image: card.image,
            rarity: 'Rare',
        });
        toast.success(`${card.name} added to cart!`);
    };

    return (
        <section className="relative w-full overflow-hidden bg-[#0a0a0f] py-10 px-4">
            {/* Wooden Panel Background */}
            <div
                className="relative mx-auto w-full max-w-[500px] min-h-[600px] border-[6px] border-[#1b120a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url("/wood-bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Individual Planks Effect */}
                <div 
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 15%, rgba(0,0,0,0.3) 15.1%)',
                        backgroundSize: '100% 100%'
                    }} 
                />

                {/* Top/Bottom Metal Strips */}
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#222] to-[#000] border-b border-white/5 flex justify-around items-center px-4 z-10">
                    {[...Array(8)].map((_, i) => (
                        <div key={`tm-${i}`} className="w-3 h-3 rounded-full bg-gradient-to-br from-[#c4a65d] to-[#453204] border border-black/40 shadow-md" />
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#222] to-[#000] border-t border-white/5 flex justify-around items-center px-4 z-10">
                    {[...Array(8)].map((_, i) => (
                        <div key={`bm-${i}`} className="w-3 h-3 rounded-full bg-gradient-to-br from-[#c4a65d] to-[#453204] border border-black/40 shadow-md" />
                    ))}
                </div>

                {/* Mobile Title */}
                <div className="pt-12 pb-6 text-center">
                    <h2
                        className="text-[3.2rem] font-black uppercase leading-none tracking-widest text-black/20"
                        style={{
                            fontFamily: 'Impact, sans-serif',
                            transform: 'scaleY(1.1) rotate(-1deg)',
                        }}
                    >
                        RECOMMEND
                    </h2>
                </div>

                {/* Staggered Vertical Posters */}
                <div className="flex flex-col items-center gap-10 px-6 pb-16">
                    {cards.slice(0, 5).map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            style={{
                                rotate: index % 2 === 0 ? -2 : 2,
                                backgroundImage: 'url("/wanted-bg.jpg")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            className="relative w-full max-w-[280px] aspect-[1/1.4] flex flex-col p-4 shadow-[5px_10px_20px_rgba(0,0,0,0.6)] border border-[#5c3a21]/50"
                        >
                            {/* WANTED Header */}
                            <div className="w-full text-center mb-2">
                                <h3 className="text-[2rem] font-black text-[#2e1a0b] tracking-wider leading-none" style={{ fontFamily: 'Impact, sans-serif', transform: 'scaleY(1.2)' }}>
                                    WANTED
                                </h3>
                            </div>

                            {/* Image */}
                            <Link href={`/products/${card.id}`} className="block relative aspect-[4/3] overflow-hidden border border-[#5c3a21]/20 mb-4 bg-[#f5e6d3]">
                                <Image src={card.image} alt={card.name} fill className="object-cover" />
                            </Link>

                            {/* Info */}
                            <div className="flex flex-col items-center text-center flex-grow">
                                <span className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#2e1a0b] opacity-80 mb-1">
                                    DEAD OR ALIVE
                                </span>
                                <p className="text-[0.9rem] font-black leading-tight text-[#2e1a0b] uppercase line-clamp-2 mb-2" style={{ fontFamily: 'Impact, sans-serif' }}>
                                    {card.name}
                                </p>

                                <div className="mt-auto w-full flex items-center justify-between border-t border-[#5c3a21]/20 pt-3">
                                    <span className="text-[1.2rem] font-black text-[#2e1a0b]" style={{ fontFamily: 'Impact, sans-serif' }}>
                                        {formatPrice(card.price)}
                                    </span>
                                    <button
                                        onClick={(e) => handleAddToCart(e, card)}
                                        className="bg-[#2e1a0b] text-[#f4e4c1] px-4 py-1 text-[0.7rem] font-bold uppercase tracking-wider rounded-sm shadow-sm"
                                    >
                                        Claim
                                    </button>
                                </div>
                            </div>
                            
                            {/* Pin Head */}
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#111] opacity-80" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}