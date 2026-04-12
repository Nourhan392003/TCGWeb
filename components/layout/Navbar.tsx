'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useAuth, UserButton } from '@clerk/nextjs';
import Logo from './Logo';

// Navigation data
const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Games', href: '/games' },
    { name: 'Wishlist', href: '/wishlist' },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
};

const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// SVG Icons as components
const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const CartIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
);

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // سحب حالة المستخدم (هل هو مسجل دخول ولا لأ؟)
    const { isSignedIn, isLoaded } = useAuth();

    // حل مشكلة الـ Hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Get cart count from store
    const cartCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

    return (
        <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="sticky top-0 z-50 w-full"
        >
            {/* Glassmorphism background */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
                <div className="absolute inset-0 backdrop-blur-xl bg-black/30" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                {/* Navigation content */}
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Left: Logo */}
                        <motion.div variants={logoVariants} className="flex-shrink-0">
                            <Logo />
                        </motion.div>

                        {/* Center: Navigation Links */}
                        <motion.div
                            variants={itemVariants}
                            className="hidden md:flex items-center space-x-1"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative px-4 py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-amber-400 group"
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    <span className="absolute inset-x-4 -bottom-0 h-[2px] scale-x-0 bg-gradient-to-r from-amber-400 to-yellow-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                                    <span className="absolute inset-0 -z-10 rounded-lg bg-amber-500/0 transition-colors duration-300 group-hover:bg-amber-500/10" />
                                </Link>
                            ))}
                        </motion.div>

                        {/* Right: Action Icons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center space-x-2"
                        >
                            {/* Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="relative p-2 text-gray-400 transition-all duration-200 hover:text-amber-400 hover:bg-white/5 rounded-lg group"
                                aria-label="Search"
                            >
                                <SearchIcon className="h-5 w-5" />
                                <span className="absolute inset-0 rounded-lg bg-amber-500/0 transition-colors duration-300 group-hover:bg-amber-500/10" />
                            </button>

                            {/* User Authentication (Clerk) */}
                            <div className="flex items-center px-2">
                                {isLoaded && !isSignedIn && (
                                    <Link href="/sign-in" className="text-sm font-medium text-amber-400 hover:text-amber-300 border border-amber-500/50 hover:bg-amber-500/10 px-4 py-1.5 rounded-lg transition-all">
                                        Sign In
                                    </Link>
                                )}
                                {isLoaded && isSignedIn && (
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                userButtonAvatarBox: "w-8 h-8",
                                            }
                                        }}
                                    />
                                )}
                            </div>

                            {/* Cart Button with Badge */}
                            <Link href="/cart" className="relative p-2 text-gray-400 transition-all duration-200 hover:text-amber-400 hover:bg-white/5 rounded-lg group">
                                <CartIcon className="w-6 h-6" />
                                <span className="absolute inset-0 rounded-lg bg-amber-500/0 transition-colors duration-300 group-hover:bg-amber-500/10" />

                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-[#F5A524] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                                        {cartCount}
                                    </span>

                                )}
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden border-t border-white/5">
                    <div className="flex items-center justify-around py-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-3 py-1 text-sm font-medium text-gray-400 hover:text-amber-400 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search Overlay */}
            {isSearchOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 top-full bg-black/80 backdrop-blur-xl border-t border-white/10"
                >
                    <div className="mx-auto max-w-2xl px-4 py-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search cards, sets, games..."
                                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-gray-200 placeholder-gray-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                                autoFocus
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}