'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ────────────────────────────── Types ────────────────────────────── */
interface FloatingCard {
    src: string;
    rotate: number;
    depth: 'bg' | 'mid' | 'fg';
    pos: Record<string, string>;
}

/* ────────────────────────────── Data ────────────────────────────── */
const FLOATING_CARDS: FloatingCard[] = [
    { src: 'https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg', rotate: -20, depth: 'bg', pos: { top: '6%', left: '3%' } },
    { src: 'https://tcg.pokemon.com/img/tcg-swsh-swsh08-268.jpg', rotate: 25, depth: 'mid', pos: { top: '12%', right: '6%' } },
    { src: 'https://tcg.pokemon.com/img/tcg-swsh-swsh04-188.jpg', rotate: -10, depth: 'fg', pos: { bottom: '22%', left: '8%' } },
    { src: 'https://tcg.pokemon.com/img/tcg-swsh-swsh07-215.jpg', rotate: 30, depth: 'bg', pos: { top: '45%', right: '12%' } },
    { src: 'https://tcg.pokemon.com/img/tcg-swsh-swsh04-188.jpg', rotate: -28, depth: 'fg', pos: { bottom: '15%', right: '3%' } },
];

/* ────────────────────────────── Spring ────────────────────────────── */
const springCfg = { stiffness: 70, damping: 22, mass: 1.4 };

/* ═══════════════════════════════ COMPONENT ═══════════════════════════════ */
export default function HeroBanner() {
    const containerRef = useRef<HTMLDivElement>(null);

    /* ── Mouse tracking ── */
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, springCfg);
    const sy = useSpring(my, springCfg);

    /* ── Parallax transforms per depth ── */
    const bgX = useTransform(sx, [-0.5, 0.5], [-8, 8]);
    const bgY = useTransform(sy, [-0.5, 0.5], [-5, 5]);
    const midX = useTransform(sx, [-0.5, 0.5], [-20, 20]);
    const midY = useTransform(sy, [-0.5, 0.5], [-12, 12]);
    const fgX = useTransform(sx, [-0.5, 0.5], [-40, 40]);
    const fgY = useTransform(sy, [-0.5, 0.5], [-25, 25]);

    /* ── Texture parallax (subtle) ── */
    const texX = useTransform(sx, [-0.5, 0.5], [-6, 6]);
    const texY = useTransform(sy, [-0.5, 0.5], [-4, 4]);

    /* ── Product box parallax ── */
    const prodX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
    const prodY = useTransform(sy, [-0.5, 0.5], [-8, 8]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseLeave = () => { mx.set(0); my.set(0); };

    const parallaxMap = (depth: string) => {
        switch (depth) {
            case 'bg': return { x: bgX, y: bgY };
            case 'mid': return { x: midX, y: midY };
            case 'fg': return { x: fgX, y: fgY };
            default: return { x: midX, y: midY };
        }
    };

    /* ── Stagger helper ── */
    const stagger = (i: number, base = 0.25) => ({
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.75, delay: base + i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    });

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-[620px] md:min-h-[700px] h-[100svh] overflow-hidden selection:bg-yellow-400/40"        >
            {/* ══════════════ LAYER 0 — Vibrant Red Background ══════════════ */}
            <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(180deg, #2a160d 0%, #120a06 100%)' }} />

            {/* ══════════════ LAYER 1 — Texture Overlay (treasure-map feel) ══════════════ */}
            <motion.div style={{ x: texX, y: texY }} className="absolute inset-0 z-[1] pointer-events-none">
                <div
                    className="absolute inset-[-20px]"
                    style={{
                        opacity: 0.04, backgroundImage: `
                            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 1px, transparent 1px),
                            radial-gradient(circle at 70% 60%, rgba(255,255,255,0.06) 1px, transparent 1px),
                            repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(0,0,0,0.03) 50px),
                            repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(0,0,0,0.03) 50px)
                        `,
                        backgroundSize: '60px 60px, 80px 80px, 50px 50px, 50px 50px',
                    }}
                />
                {/* Warm radial glows */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_40%,_rgba(255,200,50,0.12),_transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_75%_55%,_rgba(139,0,0,0.18),_transparent)]" />
            </motion.div>

            {/* ══════════════ LAYER 2 — Gradient edge vignette ══════════════ */}
            <div className="absolute inset-0 z-[2] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,_transparent_30%,_transparent_70%,_rgba(0,0,0,0.4)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_0%,_transparent_25%)]" />
            </div>

            {/* ══════════════ LAYER 3 — Flying Cards (parallax) ══════════════ */}
            {FLOATING_CARDS.map((card, i) => {
                const p = parallaxMap(card.depth);
                const zIdx = card.depth === 'fg' ? 12 : card.depth === 'mid' ? 7 : 4;
                const blur = card.depth === 'bg' ? 'blur(1.5px)' : 'none';
                return (
                    <motion.div
                        key={`fc-${i}`}
                        style={{ ...p, position: 'absolute', ...card.pos, zIndex: zIdx }}
                        className="w-28 sm:w-36 md:w-56"

                        initial={{ opacity: 0, y: 60, rotateZ: card.rotate + 10 }}
                        animate={{
                            opacity: card.depth === 'fg' ? 0.8 : card.depth === 'mid' ? 0.5 : 0.25,
                            y: 0,
                            rotateZ: card.rotate,
                        }}
                        transition={{ duration: 0.9, delay: 0.6 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div
                            animate={{ y: [0, -10 - i * 2, 0] }}
                            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-24 lg:w-32 xl:w-40 aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-2xl border border-white/10"
                            style={{
                                filter: blur,
                                boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(0,0,0,0.3)',
                            }}
                        >
                            <img src={card.src} alt="TCG Card" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/20" />
                        </motion.div>
                    </motion.div>
                );
            })}

            {/* ══════════════ LAYER 4 — Giant Character Cutout (center-right) ══════════════ */}
            <motion.div
                initial={{ y: 200, opacity: 0, rotate: 3 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{
                    y: { type: 'spring', stiffness: 55, damping: 16, mass: 1.8, delay: 0.2 },
                    opacity: { duration: 0.9, delay: 0.2 },
                    rotate: { type: 'spring', stiffness: 55, damping: 16, mass: 1.8, delay: 0.2 },
                }}
                className="absolute bottom-0 right-[2%] z-[10] pointer-events-none
                           hidden md:block"
                style={{ width: 'clamp(320px, 48vw, 720px)' }}
            >
                <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Image
                        src="/luffy-placeholder.png"
                        alt="Main Character"
                        width={720}
                        height={900}
                        priority
                        className="w-full h-auto"
                        style={{
                            filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.5)) drop-shadow(0 10px 30px rgba(0,0,0,0.4))',
                        }}
                    />
                </motion.div>
                {/* Ground glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[130%] h-28 bg-[radial-gradient(ellipse_90%_100%_at_50%_100%,_rgba(0,0,0,0.35),_transparent)] pointer-events-none" />
            </motion.div>

            {/* ══════════════ LAYER 5 — Left Content (Title + Product + Date) ══════════════ */}
            <div className="relative z-[15] flex items-center h-full px-4 sm:px-8 lg:px-16">
                <div className="max-w-[300px] sm:max-w-lg lg:max-w-xl">
                    {/* ── Subtitle badge ── */}
                    <motion.div {...stagger(0, 0.15)} className="mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/25 backdrop-blur-sm border border-white/15 text-white/90 text-xs font-bold tracking-[0.2em] uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
                            </span>
                            New Expansion
                        </span>
                    </motion.div>

                    {/* ── Main Title with text-stroke ── */}
                    <motion.h1
                        {...stagger(1, 0.25)}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.88] tracking-tight select-none mb-2" style={{
                            fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                            color: '#fff',
                            WebkitTextStroke: '3px #1a472a',
                            paintOrder: 'stroke fill',
                            textShadow: '4px 4px 0 #1a472a, 0 0 40px rgba(0,0,0,0.3)',
                        }}
                    >
                        ONE PIECE
                    </motion.h1>

                    <motion.h2
                        {...stagger(2, 0.35)}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tight select-none mb-6"
                        style={{
                            fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                            background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 40%, #ff8c00 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5)) drop-shadow(3px 3px 0 rgba(26,71,42,0.8))',
                        }}
                    >
                        CARD GAME
                    </motion.h2>

                    {/* ── Product Box (floating) ── */}
                    <motion.div
                        {...stagger(3, 0.45)}
                        className="mb-6"
                        style={{ x: prodX, y: prodY }}
                    >
                        <motion.div
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="inline-block"
                        >
                            <div
                                className="relative w-28 sm:w-36 md:w-56 aspect-[3/4] rounded-xl overflow-hidden border-2 border-yellow-500/40" style={{
                                    boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,215,0,0.15)',
                                }}
                            >
                                <Image
                                    src="/product-box.png"
                                    alt="Booster Box"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* ── Date text ── */}
                    <motion.p
                        {...stagger(4, 0.55)}
                        className="text-sm sm:text-base font-extrabold tracking-[0.15em] uppercase text-white/80 mb-8"
                        style={{ fontFamily: '"Arial Narrow", "Helvetica Neue", sans-serif' }}
                    >
                        Available <span className="text-yellow-300">Nov. 7, 2026</span>
                    </motion.p>

                    {/* ── CTA Buttons ── */}
                    <motion.div {...stagger(5, 0.65)} className="flex flex-wrap gap-3">
                        <Link href="/products" className="group relative">
                            <motion.div
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-lg blur opacity-50"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.96 }}
                                className="relative bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-7 sm:px-9 py-3 sm:py-3.5 rounded-lg font-extrabold text-xs sm:text-sm tracking-wider uppercase overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Shop Now
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </motion.button>
                        </Link>

                        <Link href="/collection">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.96 }}
                                className="px-7 sm:px-9 py-3 sm:py-3.5 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase text-white border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                            >
                                View Collection
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* ══════════════ LAYER 6 — Floating Announcement Badge (right/bottom) ══════════════ */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
                animate={{ opacity: 1, scale: 1, rotate: 2 }}
                transition={{ duration: 0.7, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-20 right-3 sm:right-10 lg:bottom-28 lg:right-20 z-[16] scale-90 sm:scale-100"            >
                <motion.div
                    animate={{ rotate: [2, -1, 2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                >
                    <div
                        className="bg-yellow-400 text-black px-5 sm:px-7 py-3 sm:py-4 rounded-lg font-black text-sm sm:text-base tracking-wide uppercase cursor-pointer hover:bg-yellow-300 transition-colors"
                        style={{
                            boxShadow: '0 8px 30px rgba(0,0,0,0.4), 0 0 0 3px rgba(0,0,0,0.15)',
                            transform: 'rotate(-2deg)',
                        }}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Recommended Decks
                        </span>
                    </div>
                    {/* Tape/sticker effect */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/20 rounded-sm rotate-[-3deg]" />
                </motion.div>
            </motion.div>

            {/* ══════════════ LAYER 7 — Diagonal Divider (bottom) ══════════════ */}
            <div className="absolute bottom-0 left-0 right-0 z-[20] pointer-events-none">
                <svg viewBox="0 0 1440 80" className="w-full h-auto block" preserveAspectRatio="none">
                    <polygon fill="#06060c" points="0,80 1440,20 1440,80" />
                    <polygon fill="rgba(198,40,40,0.3)" points="0,80 1440,40 1440,80" />
                </svg>
            </div>

            {/* ══════════════ LAYER 8 — Corner decorative accents ══════════════ */}
            <div className="absolute top-0 left-0 right-0 z-[18] pointer-events-none">
                <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
            </div>
            <div className="absolute top-6 left-6 z-[18] pointer-events-none hidden sm:block">
                <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500/20 rounded-tl-lg" />
            </div>
            <div className="absolute top-6 right-6 z-[18] pointer-events-none hidden sm:block">
                <div className="w-16 h-16 border-t-2 border-r-2 border-yellow-500/20 rounded-tr-lg" />
            </div>
        </section>
    );
}
