'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/currency';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

const posterData = [
    { id: '1', name: 'Luffy - Straw Hat Pirate', price: 24.99, image: '/cards/card1.png' },
    { id: '2', name: 'Zoro - Three Sword Style', price: 19.99, image: '/cards/card2.png' },
    { id: '3', name: 'Nami - Navigator', price: 15.99, image: '/cards/card3.png' },
    { id: '4', name: 'Sanji - Black Leg Style', price: 22.99, image: '/cards/card4.png' },
];

export default function RecommendSectionMobile() {
    const addItemToCart = useCartStore((state) => state.addItem);

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
        <section className="relative overflow-hidden bg-[#08060d] px-3 py-6">
            <div
                className="mx-auto w-full max-w-[390px] overflow-hidden border-[8px] border-[#1b120a] shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
                style={{
                    backgroundImage: 'url("/wood-bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="flex items-center justify-center bg-[#1a1714] px-2 py-2">
                    <h2
                        className="text-center text-[clamp(1.8rem,8vw,2.8rem)] font-black uppercase leading-none tracking-[0.12em] text-[#f4e4c1]"
                        style={{
                            fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                            textShadow: '2px 2px 0 #3e2723, 4px 4px 0 rgba(0,0,0,0.7)',
                        }}
                    >
                        RECOMMEND
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3">
                    {posterData.slice(0, 4).map((card) => (
                        <motion.div
                            key={card.id}
                            whileTap={{ scale: 0.98 }}
                            className="overflow-hidden border-2 border-[#5c3a21] bg-[#e6cfaa] shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                        >
                            <div className="bg-[#d8ba7f] px-2 py-1 text-center text-[0.75rem] font-black uppercase text-[#2d160c]">
                                WANTED
                            </div>

                            <Link href={`/products/${card.id}`} className="block">
                                <div className="relative aspect-[4/3] overflow-hidden border-y border-[#e8decd] bg-white">
                                    <Image src={card.image} alt={card.name} fill className="object-cover" />
                                </div>
                            </Link>

                            <div className="px-2 py-2 text-center">
                                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#2e1a0b]">
                                    DEAD OR ALIVE
                                </p>
                                <p className="mt-1 line-clamp-2 text-[0.75rem] font-bold leading-tight text-[#2e1a0b]">
                                    {card.name}
                                </p>

                                <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#5c3a21]/30 pt-2">
                                    <span className="text-[0.9rem] font-black text-[#2e1a0b]">
                                        {formatPrice(card.price)}
                                    </span>
                                    <button
                                        onClick={(e) => handleAddToCart(e, card)}
                                        className="rounded-sm bg-[#2e1a0b] px-2 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-[#f4e4c1]"
                                    >
                                        Claim
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}