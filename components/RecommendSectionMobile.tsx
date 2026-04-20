'use client';

import { motion } from 'framer-motion';
import { formatPriceByLocale } from '@/utils/currency';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import { useAuthAction } from '@/hooks/useAuthAction';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedText } from '@/utils/localization';

interface Poster {
    id: string;
    name: string | { en: string; ar?: string };
    price: number;
    image: string;
}

interface RecommendSectionProps {
    featuredCards?: Poster[];
}

const posterData: Poster[] = [
    { id: '1', name: { en: 'Pirates Party 2026 Vol.1', ar: 'حفلة القراصنة ٢٠٢٦' }, price: 24.99, image: '/cards/card1.png' },
    { id: '2', name: { en: 'Recommended Decks', ar: 'مجموعات موصى بها' }, price: 19.99, image: '/slider/card2.png' },
    { id: '3', name: { en: "Quick Beginner's Guide", ar: 'دليل المبتدئين السريع' }, price: 15.99, image: '/cards/card3.png' },
    { id: '4', name: { en: 'Teaching App', ar: 'تطبيق التعليم' }, price: 22.99, image: '/cards/card4.png' },
    { id: '5', name: { en: 'Championship 26-27', ar: 'البطولة ٢٦-٢٧' }, price: 29.99, image: '/cards/card1.png' },
];

const mobilePosterPositions = [
    { top: '15%', left: '2%', rotate: -5 },
    { top: '35%', left: '22%', rotate: 2 },
    { top: '10%', left: '42%', rotate: -1 },
    { top: '25%', left: '60%', rotate: 4 },
    { top: '45%', left: '80%', rotate: -3 },
];

export default function RecommendSectionMobile({ featuredCards }: RecommendSectionProps) {
    const tActions = useTranslations('Actions');
    const tProducts = useTranslations('Products');
    const locale = useLocale();
    const { checkAuth } = useAuthAction();
    const router = useRouter();
    const addItemToCart = useCartStore((state) => state.addItem);

    const cards = featuredCards?.length ? featuredCards : posterData;

    const handleAddToCart = (e: React.MouseEvent, card: Poster) => {
        e.preventDefault();
        e.stopPropagation();

        const localizedName = getLocalizedText(card.name, locale);

        checkAuth(() => {
            addItemToCart({
                id: card.id,
                name: localizedName,
                price: card.price,
                quantity: 1,
                image: card.image,
                rarity: 'Rare',
            });
            toast.success(tActions('addedToCart', { name: localizedName }));
        });
    };

    const handleProductClick = (e: React.MouseEvent, cardId: string) => {
        e.preventDefault();
        checkAuth(() => {
            router.push(`/products/${cardId}`);
        }, undefined, `/products/${cardId}`);
    };

    return (
        <section className="relative w-full overflow-hidden bg-[#0a0a0f] py-8">
            <div className="w-full overflow-x-auto pb-6 scrollbar-hide">
                <div
                    className="relative min-w-[1300px] aspect-[21/8] border-y-[6px] border-[#1b120a] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url("/wood-bg.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 15%, rgba(0,0,0,0.3) 15.1%)',
                            backgroundSize: '100% 100%'
                        }}
                    />

                    <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#222] via-[#111] to-[#000] border-b border-white/5 flex justify-around items-center px-4 z-30 shadow-md">
                        {[...Array(20)].map((_, i) => (
                            <div key={`tm-${i}`} className="w-3 h-3 rounded-full bg-gradient-to-br from-[#c4a65d] via-[#8b6508] to-[#453204] border border-black/40 shadow-md" />
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#222] via-[#111] to-[#000] border-t border-white/5 flex justify-around items-center px-4 z-30 shadow-md">
                        {[...Array(20)].map((_, i) => (
                            <div key={`bm-${i}`} className="w-3 h-3 rounded-full bg-gradient-to-br from-[#c4a65d] via-[#8b6508] to-[#453204] border border-black/40 shadow-md" />
                        ))}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                        <h2
                            className="text-[12rem] font-black text-black/20 tracking-[0.2em] uppercase whitespace-nowrap"
                            style={{
                                fontFamily: 'Impact, sans-serif',
                                transform: 'scaleY(1.1) rotate(-2deg)',
                            }}
                        >
                            {tProducts('listingTitle')}
                        </h2>
                    </div>

                    <div className="relative z-20 w-full h-full px-[2%]">
                        {cards.slice(0, 5).map((card, index) => {
                            const pos = mobilePosterPositions[index % mobilePosterPositions.length];
                            const localizedName = getLocalizedText(card.name, locale);

                            return (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, scale: 0.9, rotate: pos.rotate + 5 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: pos.rotate }}
                                    viewport={{ once: true }}
                                    style={{
                                        top: pos.top,
                                        left: pos.left,
                                        backgroundImage: 'url("/wanted-bg.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                    className="absolute w-[16%] aspect-[1/1.4] flex flex-col p-3 shadow-[5px_10px_20px_rgba(0,0,0,0.6)] border border-[#5c3a21]/50"
                                >
                                    <div className="w-full text-center mb-1">
                                        <h3 className="text-[1.8rem] font-black text-[#2e1a0b] tracking-wider leading-none" style={{ fontFamily: 'Impact, sans-serif', transform: 'scaleY(1.2)' }}>
                                            WANTED
                                        </h3>
                                    </div>

                                    <Link
                                        href={`/products/${card.id}`}
                                        onClick={(e) => handleProductClick(e, card.id)}
                                        className="block relative aspect-[4/3] overflow-hidden border border-[#5c3a21]/20 mb-3 bg-[#f5e6d3]"
                                    >
                                        <img src={card.image} alt={localizedName} className="absolute inset-0 w-full h-full object-cover" />
                                    </Link>

                                    <div className="flex flex-col items-center text-center flex-grow">
                                        <span className="text-[0.5rem] font-black uppercase tracking-[0.2em] text-[#2e1a0b] opacity-80 mb-0.5">
                                            DEAD OR ALIVE
                                        </span>
                                        <p className="text-[0.8rem] font-black leading-tight text-[#2e1a0b] uppercase line-clamp-2" style={{ fontFamily: 'Impact, sans-serif' }}>
                                            {localizedName}
                                        </p>

                                        <div className="mt-auto w-full flex items-center justify-between border-t border-[#5c3a21]/20 pt-2 pb-1">
                                            <span className="text-[1.1rem] font-black text-[#2e1a0b]" style={{ fontFamily: 'Impact, sans-serif' }}>
                                                {formatPriceByLocale(card.price, locale)}
                                            </span>
                                            <button
                                                onClick={(e) => handleAddToCart(e, card)}
                                                className="bg-[#2e1a0b] text-[#f4e4c1] px-3 py-1 text-[0.6rem] font-extrabold uppercase tracking-wider rounded-sm"
                                            >
                                                {tActions('claim')}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#111] opacity-60" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-2 md:hidden overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <motion.div
                        animate={{ x: [-5, 5, -5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-amber-500/80"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                        {locale === 'ar' ? "اسحب للاستكشاف" : "Scroll to Explore"}
                    </span>
                </div>
            </div>
        </section>
    );
}