'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function Logo() {
    return (
        <Link
            href="/"
            // كبرنا العرض والطول هنا لمقاس مناسب جداً للـ Navbar
            className="relative flex items-center justify-center overflow-hidden rounded-md group flex-shrink-0 bg-transparent"
            style={{ width: '160px', height: '60px' }}
        >
            {/* لمعة خارجية زرقا خفيفة */}
            <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0" />

            <img
                src="/logo.png"
                alt="HTR Logo"
                className="relative z-10 w-full h-full object-cover"
            />

            {/* اللمعة (الهولوجرافيك) اللي بتتحرك */}
            <motion.div
                className="absolute top-0 bottom-0 z-20 pointer-events-none"
                style={{
                    background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.8) 60%, transparent 80%)',
                    width: '60%',
                }}
                initial={{ left: '-100%' }}
                animate={{ left: '200%' }}
                transition={{
                    repeat: Infinity,
                    repeatDelay: 3,
                    duration: 1.5,
                    ease: 'easeInOut'
                }}
            />
        </Link>
    );
}