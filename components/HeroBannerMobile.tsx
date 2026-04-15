'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroBannerMobile() {
    return (
        <section className="relative overflow-hidden bg-[#08060d] px-3 pt-6 pb-10">
            <div className="mx-auto flex w-full max-w-[380px] flex-col items-center">
                <h2
                    className="mb-3 text-center text-[clamp(2.1rem,9vw,3.4rem)] font-black uppercase leading-none tracking-[0.08em] text-[#f3e1bf]"
                    style={{
                        fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                        textShadow: '0 3px 0 rgba(0,0,0,0.45), 0 8px 18px rgba(0,0,0,0.35)',
                    }}
                >
                    RECOMMEND
                </h2>

                <div className="relative w-full">
                    <div
                        className="relative mx-auto h-[255px] w-full overflow-visible rounded-sm border-y-[10px] border-[#1a1714] shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.08)), url("/wood-bg.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute left-0 right-0 top-0 flex h-[20px] items-center justify-around bg-[#1a1714] px-2">
                            {Array.from({ length: 14 }).map((_, i) => (
                                <span
                                    key={`top-nail-${i}`}
                                    className="h-2.5 w-2.5 rounded-full bg-gradient-to-b from-[#e8d08a] to-[#8d6a20] shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
                                />
                            ))}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 flex h-[20px] items-center justify-around bg-[#1a1714] px-2">
                            {Array.from({ length: 14 }).map((_, i) => (
                                <span
                                    key={`bottom-nail-${i}`}
                                    className="h-2.5 w-2.5 rounded-full bg-gradient-to-b from-[#e8d08a] to-[#8d6a20] shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
                                />
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 16, rotate: -4 }}
                            animate={{ opacity: 1, y: 0, rotate: -4 }}
                            transition={{ duration: 0.5 }}
                            className="absolute left-[8%] top-[30%] z-20 w-[78px]"
                        >
                            <div className="overflow-hidden rounded-[6px] bg-[#e3c691] shadow-[0_12px_25px_rgba(0,0,0,0.45)] ring-1 ring-black/15">
                                <div className="bg-[#d8ba7f] px-1 py-1 text-center text-[0.82rem] font-black uppercase leading-none text-[#2d160c]">
                                    WANTED
                                </div>

                                <div className="px-1.5 pt-1.5">
                                    <div className="relative h-[72px] w-full overflow-hidden border border-black/20 bg-white">
                                        <Image
                                            src="/wanted-bg.jpg"
                                            alt="Recommended card"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="px-1.5 pt-1 text-center text-[0.58rem] font-extrabold uppercase leading-tight text-[#3a2416]">
                                    Dead Or Alive
                                </div>

                                <div className="px-1.5 pt-1 text-center text-[0.52rem] leading-[1.25] text-[#4c3423]">
                                    One Piece Card Game
                                </div>

                                <div className="px-1.5 pb-2 pt-2">
                                    <Link
                                        href="/products"
                                        className="block w-full rounded-sm bg-[#6b4a22] px-1 py-1 text-center text-[0.52rem] font-bold uppercase tracking-[0.08em] text-[#f7e7c2]"
                                    >
                                        Claim
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}