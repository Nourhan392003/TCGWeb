'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { Link } from '@/i18n/navigation';

import { useLocale, useTranslations } from 'next-intl';
/* ═══════════════════════════════ CONSTANTS & DATA ═══════════════════════════════ */

const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide
const PROGRESS_UPDATE = 50; // Update progress bar every 50ms

const SLIDES_CONFIG = [

    {
        id: 1,
        bgColor: "from-[#4a2e05] via-[#7a4d0a] to-black",
        glowColor: "rgba(251, 191, 36, 0.12)", // Amber glow
        characterImg: "/slider/Onepiecechar.png",
        floatingPackImg: "/slider/OnepieceCard.png",
    },
    {
        id: 2,
        bgColor: "from-[#071827] via-[#35104f] to-blue", glowColor: "rgba(160, 141, 219, 0.12)", // Purple glow
        characterImg: "/slider/pokemonchar.png",
        floatingPackImg: "/slider/pokemoncard.png",
    },
    {
        id: 3,
        bgColor: "from-[#140902] via-[#a85a0a] to-[#0a0a0a]",
        glowColor: "rgba(255, 215, 0, 0.2)", // Energetic Gold glow
        characterImg: "/slider/narutochr.png",
        floatingPackImg: "/slider/narutocard.png",
    },
    {
        id: 4,
        bgColor: "from-[#1e0a2b] via-[#3d1259] to-black",
        glowColor: "rgba(139, 92, 246, 0.15)", // Violet glow
        characterImg: "/slider/riftboundtchar.png",
        floatingPackImg: "/slider/riftBoundcard.png",
    },

];

/* ═══════════════════════════════ ANIMATION VARIANTS ═══════════════════════════════ */

const textStagger = {
    enter: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const textItem = {
    enter: { opacity: 0, y: 40, filter: 'blur(6px)' },
    center: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
        opacity: 0,
        y: -20,
        filter: 'blur(3px)',
        transition: { duration: 0.25 },
    },
};

/* ═══════════════════════════════ COMPONENT ═══════════════════════════════ */
export default function HeroSlider() {
    const t = useTranslations('Hero');
    const tActions = useTranslations('Actions');
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<NodeJS.Timeout | null>(null);

    const SLIDES = SLIDES_CONFIG.map((s, i) => {
        let dateStr = "";
        if (isRTL) {
            dateStr =
                i === 0 ? "٣ أبريل، ٢٠٢٦" :
                    i === 1 ? "٢٢ يناير، ٢٠٢٦" :
                        i === 2 ? "١٣ مارس، ٢٠٢٦" :
                            "٨ مايو، ٢٠٢٦";
        } else {
            dateStr =
                i === 0 ? "APR. 3, 2026" :
                    i === 1 ? "JAN. 22, 2026" :
                        i === 2 ? "MAR. 13, 2026" :
                            "MAY. 8, 2026";
        }
        return {
            ...s,
            title: t(`title${i + 1}`),
            subtitle: t(`subtitle${i + 1}`),
            description: t(`desc${i + 1}`),
            date: t(`available`, { date: dateStr })
        };
    });

    const slide = SLIDES[current];

    const goTo = useCallback((index: number) => {
        setCurrent((index + SLIDES.length) % SLIDES.length);
        setProgress(0);
    }, [SLIDES.length]);

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    /* ── Autoplay timer ── */
    useEffect(() => {
        if (isPaused) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (progressRef.current) clearInterval(progressRef.current);
            return;
        }

        setProgress(0);

        progressRef.current = setInterval(() => {
            setProgress((p) => Math.min(p + (PROGRESS_UPDATE / AUTOPLAY_INTERVAL) * 100, 100));
        }, PROGRESS_UPDATE);

        timerRef.current = setInterval(next, AUTOPLAY_INTERVAL);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (progressRef.current) clearInterval(progressRef.current);
        };
    }, [current, isPaused, next]);

    /* ── Keyboard nav ── */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === ' ') {
                e.preventDefault();
                setIsPaused((p) => !p);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [next, prev]);

    return (
        <section className="relative w-full h-[70vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] min-h-[400px] sm:min-h-[500px] md:min-h-[500px] lg:min-h-[700px] overflow-hidden select-none">

            {/* ══════════════ BACKGROUND ══════════════ */}
            <AnimatePresence mode="sync">
                <motion.div
                    key={`bg-${slide.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className={`absolute inset-0 z-0 bg-gradient-to-br ${slide.bgColor}`}
                />
            </AnimatePresence>

            {/* ══════════════ TEXTURE OVERLAY ══════════════ */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        opacity: 0.04,
                        backgroundImage: `
                            repeating-linear-gradient(
                                120deg,
                                transparent,
                                transparent 98px,
                                rgba(255,255,255,0.15) 98px,
                                rgba(255,255,255,0.15) 100px
                            )
                        `,
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        opacity: 0.06,
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,_rgba(255,200,50,0.12),_transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_55%,_rgba(0,0,0,0.25),_transparent)]" />
            </div>

            {/* ══════════════ VIGNETTE & GLOW ══════════════ */}
            <div className="absolute inset-0 z-[2] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,_transparent_30%,_transparent_65%,_rgba(0,0,0,0.55)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_0%,_transparent_30%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(0,0,0,0.2)_0%,_transparent_15%)]" />

                {/* Dynamic Cinematic Glow */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`glow-${slide.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at ${isRTL ? '30% 50%' : '70% 50%'}, ${slide.glowColor}, transparent 50%)`,
                        }}
                    />
                </AnimatePresence>
            </div>

            {/* ══════════════ PARTICLES ══════════════ */}
            <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
                {[...Array(14)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 rounded-full bg-white/30"
                        style={{
                            left: `${6 + (i * 7) % 88}%`,
                            top: `${10 + (i * 13) % 75}%`,
                        }}
                        animate={{
                            y: [0, -50 - i * 8, 0],
                            x: [0, (i % 2 === 0 ? 15 : -15), 0],
                            opacity: [0.1, 0.5, 0.1],
                            scale: [0.5, 1.3, 0.5],
                        }}
                        transition={{
                            duration: 4 + i * 0.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.25,
                        }}
                    />
                ))}
            </div>

            {/* ══════════════ FLOATING CARD ══════════════ */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={`pack-${slide.id}`}
                    src={slide.floatingPackImg}
                    alt="Card"
                    className={`absolute top-[18%] sm:top-[12%] ${isRTL ? 'left-[8%] sm:left-[18%] md:left-[40%]' : 'right-[8%] sm:right-[18%] md:right-[40%]'} w-16 sm:w-24 md:w-48 lg:w-64 rounded-xl shadow-2xl z-[8] pointer-events-none block opacity-90`}
                    animate={{ y: [-8, 8, -8], opacity: 1, rotate: isRTL ? 15 : -15 }}
                    transition={{
                        opacity: { duration: 0.5 },
                        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                    }}
                />
            </AnimatePresence>

            {/* ══════════════ MASSIVE CHARACTER ══════════════ */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={`char-${slide.id}`}
                    src={slide.characterImg}
                    alt="Character"
                    className={`absolute bottom-0 ${isRTL ? 'left-[-8%] sm:left-0 md:left-0' : 'right-[-8%] sm:right-0 md:right-0'} w-[58%] sm:w-[52%] md:w-[70%] lg:w-[50%] max-h-[38vh] sm:max-h-[48vh] md:max-h-[60vh] object-contain object-bottom drop-shadow-2xl z-10 pointer-events-none block opacity-90 sm:opacity-100`}
                    initial={{ x: isRTL ? -80 : 80, opacity: 0, scaleX: isRTL ? -1 : 1 }}
                    animate={{ x: 0, opacity: 1, y: [0, -8, 0], scaleX: isRTL ? -1 : 1 }}
                    exit={{ x: isRTL ? -80 : 80, opacity: 0, transition: { duration: 0.35 } }}
                    transition={{
                        x: { type: 'spring', stiffness: 90, damping: 18 },
                        opacity: { duration: 0.45 },
                        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                        scaleX: { duration: 0 } // Immediate flip
                    }}
                />
            </AnimatePresence>

            {/* ══════════════ TEXT & CTA ══════════════ */}
            <div className={`absolute inset-0 z-[20] flex items-start md:items-center px-4 sm:px-8 md:px-10 lg:px-16 pt-12 sm:pt-16 md:pt-0 w-full md:w-1/2 ${isRTL ? 'ltr:left-auto rtl:right-0' : 'ltr:left-0 rtl:right-auto'}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`text-${slide.id}`}
                        className="w-full max-w-[68%] sm:max-w-[60%] md:max-w-xl"
                        variants={textStagger}
                        initial="enter"
                        animate="center"
                        exit="exit"
                    >
                        <motion.div variants={textItem} className="mb-3 sm:mb-6">
                            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white/90 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase">
                                {slide.subtitle}
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={textItem}
                            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[6.5rem] font-black leading-[0.85] tracking-tighter mb-3 sm:mb-6 max-w-[15ch] ltr:text-left rtl:text-right" style={{
                                fontFamily: 'var(--font-heading), "Outfit", sans-serif',
                                color: '#fff',
                                textShadow: '0 4px 12px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)',
                            }}
                        >
                            {slide.title}
                        </motion.h1>

                        <motion.p
                            variants={textItem}
                            className="text-sm sm:text-base text-white/70 leading-relaxed max-w-xs sm:max-w-md mb-4 sm:mb-8 hidden sm:block"
                        >
                            {slide.description}
                        </motion.p>

                        <motion.div variants={textItem} className="mb-6 sm:mb-10">
                            <span
                                className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-[0.15em] uppercase"
                                style={{
                                    color: '#ffd700',
                                    textShadow: '0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.3)',
                                }}
                            >
                                {slide.date}
                            </span>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ══════════════ MOBILE-ONLY CTA BUTTON ══════════════ */}
            <div className="absolute bottom-24 left-6 rtl:left-auto rtl:right-6 z-[999] block sm:hidden">
                <Link
                    href="/products"
                    className="inline-block bg-yellow-500 text-black font-bold text-sm rounded-full px-6 py-3 shadow-xl"
                >
                    {tActions('shopNow')}
                </Link>
            </div>

            {/* ══════════════ SLIDE INDICATORS + PLAY/PAUSE ══════════════ */}
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-10 rtl:left-auto rtl:right-4 sm:rtl:right-10 z-[25] flex items-center gap-3 sm:gap-4">
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPaused((p) => !p)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    {isPaused ? <Play className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" /> : <Pause className="w-3 h-3 sm:w-4 sm:h-4" />}
                </motion.button>

                <div className="flex items-center gap-1.5 sm:gap-2.5">
                    {SLIDES.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => goTo(i)}
                            className="group relative flex items-center"
                        >
                            <div
                                className={`h-1.5 rounded-full bg-white/20 overflow-hidden transition-all duration-300 ${i === current ? 'w-10 sm:w-[72px]' : 'w-5'}`}
                            >
                                {i === current && (
                                    <motion.div
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${progress}%` }}
                                        transition={{ duration: 0.05 }}
                                    />
                                )}
                                {i !== current && i < current && (
                                    <div className="h-full w-full bg-white/50 rounded-full" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <span className="text-white/50 text-[10px] sm:text-xs font-bold tracking-widest ml-1 sm:ml-2 hidden sm:inline">
                    {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                </span>
            </div>

            {/* ══════════════ NAV ARROWS ══════════════ */}
            <button
                onClick={prev}
                className="absolute left-2 sm:left-4 md:left-8 rtl:left-auto rtl:right-2 sm:rtl:right-4 md:rtl:right-8 top-1/2 -translate-y-1/2 z-[25] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/25 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/40 transition-all hidden md:flex"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={next}
                className="absolute right-2 sm:right-4 md:right-8 rtl:right-auto rtl:left-2 sm:rtl:left-4 md:rtl:left-8 top-1/2 -translate-y-1/2 z-[25] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/25 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/40 transition-all hidden md:flex"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* ══════════════ DIAGONAL DIVIDER ══════════════ */}
            <div className="absolute bottom-0 left-0 right-0 z-[30] pointer-events-none">
                <svg
                    viewBox="0 0 1440 80"
                    className={`w-full h-auto block ${isRTL ? 'scale-x-[-1]' : ''}`}
                    preserveAspectRatio="none"
                >
                    <polygon fill="#06060c" points="0,80 1440,20 1440,80" />
                    <polygon fill="rgba(255,255,255,0.03)" points="0,80 1440,35 1440,80" />
                </svg>
            </div>
        </section >
    );
}