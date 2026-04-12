"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VideoSection() {
    const videoRef = useRef<HTMLVideoElement>(null);

    // الـ useEffect ده بيجبر الفيديو يشتغل حتى لو المتصفح حاول يعطله
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay was prevented:", error);
            });
        }
    }, []);

    return (
        <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden flex items-center justify-center bg-[#0a0a0a]">

            {/* ══════════════ LOCAL VIDEO BACKGROUND ══════════════ */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">

                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    src="/op-trailer.mp4"
                    className="w-full h-full object-cover opacity-180"
                    style={{ minWidth: "100%", minHeight: "100%" }}
                />
            </div>

            {/* ══════════════ OVERLAYS FOR READABILITY ══════════════ */}
            {/* ══════════════ OVERLAYS ══════════════ */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.4)_100%)] z-[1] pointer-events-none" />

            ص            <div className="absolute inset-0 bg-gradient-to-b from-[#06060c]/60 via-transparent to-[#06060c]/60 z-[2] pointer-events-none" />
            {/* ══════════════ CONTENT (زي موقع وان بيس) ══════════════ */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-12">

                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-white text-2xl md:text-3xl mb-2 block"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                >
                    Experience it.
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide mb-8"
                    style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}
                >
                    This is the New Era of Card Games.
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                >

                </motion.div>

            </div>
        </section>
    );
}