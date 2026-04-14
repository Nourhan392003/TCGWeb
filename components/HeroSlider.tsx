'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import Link from 'next/link';
/* ═══════════════════════════════ CONSTANTS & DATA ═══════════════════════════════ */

const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide
const PROGRESS_UPDATE = 50; // Update progress bar every 50ms

const SLIDES = [
    {
        id: 1,
        title: "CARRYING ON HIS WILL",
        subtitle: "3 Brothers to celebrate 3 Years!",
        description: "New powers keep joining the OPCG. Don't miss the special anniversary products.",
        date: "AVAILABLE NOV. 7, 2025",
        bgColor: "from-red-800 to-black",
        characterImg: "/slider/charImage.png",
        floatingPackImg: "/slider/card1.png",
    },
    {
        id: 2,
        title: "NEW EXPANSION AWAKENS",
        subtitle: "The Pirate King's Journey",
        description: "Discover powerful new leaders, devastating events, and legendary characters.",
        date: "AVAILABLE JAN. 22, 2026",
        bgColor: "from-emerald-900 to-black",
        characterImg: "/slider/charImage2.png",
        floatingPackImg: "/slider/card2.png",
    },
    {
        id: 3,
        title: "GEAR 5 UNLEASHED",
        subtitle: "The Warrior of Liberation",
        description: "Experience the peak of power with the new ultimate rare collection. Pre-order your booster boxes now.",
        date: "AVAILABLE MAR. 15, 2026",
        bgColor: "from-blue-900 to-black",
        characterImg: "/slider/luffy-gea.png",
        floatingPackImg: "/slider/OP-05.png",
    },
    {
        id: 4,
        title: "EMPERORS OF THE SEA",
        subtitle: "Clash of the Titans",
        description: "Dominate the meta with cards featuring the most feared pirates in the New World.",
        date: "AVAILABLE MAY. 10, 2026",
        bgColor: "from-purple-900 to-black",
        characterImg: "/slider/charImage4.png",
        floatingPackImg: "/slider/card1.png",
    }
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
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    // Correct Typescript references for intervals
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<NodeJS.Timeout | null>(null);

    const slide = SLIDES[current];

    const goTo = useCallback((index: number) => {
        setCurrent((index + SLIDES.length) % SLIDES.length);
        setProgress(0);
    }, []);

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

            {/* ══════════════ VIGNETTE ══════════════ */}
            <div className="absolute inset-0 z-[2] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,_transparent_30%,_transparent_65%,_rgba(0,0,0,0.55)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_0%,_transparent_30%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(0,0,0,0.2)_0%,_transparent_15%)]" />
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

            {/* ══════════════ FLOATING CARD (z-0, BEHIND CHARACTER) ══════════════ */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={`pack-${slide.id}`}
                    src={slide.floatingPackImg}
                    alt="Card"

                    className="absolute top-[18%] sm:top-[12%] right-[8%] sm:right-[18%] md:right-[40%] w-16 sm:w-24 md:w-48 lg:w-64 rounded-xl shadow-2xl z-[8] pointer-events-none block opacity-90" animate={{ y: [-8, 8, -8], opacity: 1, rotate: -15 }}
                    transition={{
                        opacity: { duration: 0.5 },
                        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                    }}
                />
            </AnimatePresence>

            {/* ══════════════ MASSIVE CHARACTER (z-10, RIGHT, BOTTOM-ANCHORED) ══════════════ */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={`char-${slide.id}`}
                    src={slide.characterImg}
                    alt="Character"
                    className="absolute bottom-0 right-[-8%] sm:right-0 md:right-0 w-[58%] sm:w-[52%] md:w-[70%] lg:w-[50%] max-h-[38vh] sm:max-h-[48vh] md:max-h-[60vh] object-contain object-bottom drop-shadow-2xl z-10 pointer-events-none block opacity-90 sm:opacity-100"
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, y: [0, -8, 0] }}
                    exit={{ x: 80, opacity: 0, transition: { duration: 0.35 } }}
                    transition={{
                        x: { type: 'spring', stiffness: 90, damping: 18 },
                        opacity: { duration: 0.45 },
                        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                    }}
                />
            </AnimatePresence>

            {/* ══════════════ LEFT SIDE — TEXT & CTA ══════════════ */}
            <div className="absolute inset-0 z-[20] flex items-start md:items-center px-4 sm:px-8 md:px-10 lg:px-16 pt-20 sm:pt-24 md:pt-0 w-full md:w-1/2">                <AnimatePresence mode="wait">
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
                        className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[7.5rem] font-black leading-[0.9] tracking-tight mb-3 sm:mb-6 max-w-[11ch]" style={{
                            fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                            color: '#fff',
                            WebkitTextStroke: '3px rgba(0,0,0,0.5)',
                            paintOrder: 'stroke fill',
                            textShadow: '4px 4px 0 rgba(0,0,0,0.35), 0 0 40px rgba(0,0,0,0.2), 0 0 80px rgba(0,0,0,0.1)',
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
            <div className="absolute bottom-24 left-6 z-[999] block sm:hidden">
                <Link
                    href="/products"
                    className="inline-block bg-yellow-500 text-black font-bold text-sm rounded-full px-6 py-3 shadow-xl"
                >
                    Shop Now
                </Link>
            </div>
            {/* ══════════════ SLIDE INDICATORS + PLAY/PAUSE (BOTTOM LEFT) ══════════════ */}
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-10 z-[25] flex items-center gap-3 sm:gap-4">
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPaused((p) => !p)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label={isPaused ? 'Play' : 'Pause'}
                >
                    {isPaused ? <Play className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" /> : <Pause className="w-3 h-3 sm:w-4 sm:h-4" />}
                </motion.button>

                <div className="flex items-center gap-1.5 sm:gap-2.5">
                    {SLIDES.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => goTo(i)}
                            className="group relative flex items-center"
                            aria-label={`Go to slide ${i + 1}`}
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
                className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-[25] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/25 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/40 transition-all hidden md:flex"
                aria-label="Previous slide"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={next}
                className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-[25] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/25 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/40 transition-all hidden md:flex"
                aria-label="Next slide"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* ══════════════ DIAGONAL DIVIDER (BOTTOM) ══════════════ */}
            <div className="absolute bottom-0 left-0 right-0 z-[30] pointer-events-none">
                <svg
                    viewBox="0 0 1440 80"
                    className="w-full h-auto block"
                    preserveAspectRatio="none"
                >
                    <polygon fill="#06060c" points="0,80 1440,20 1440,80" />
                    <polygon fill="rgba(255,255,255,0.03)" points="0,80 1440,35 1440,80" />
                </svg>
            </div>

            {/* ══════════════ CORNER ACCENTS ══════════════ */}
            <div className="absolute top-0 left-0 right-0 z-[20] pointer-events-none">
                <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
            </div>
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-[20] pointer-events-none hidden sm:block">
                <div className="w-12 sm:w-16 h-12 sm:h-16 border-t-2 border-l-2 border-yellow-500/20 rounded-tl-lg" />
            </div>
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-[20] pointer-events-none hidden sm:block">
                <div className="w-12 sm:w-16 h-12 sm:h-16 border-t-2 border-r-2 border-yellow-500/20 rounded-tr-lg" />
            </div>
        </section >
    );
}