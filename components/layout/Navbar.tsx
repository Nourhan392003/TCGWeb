'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useAuth, UserButton } from '@clerk/nextjs';
import Logo from './Logo';
import { Menu, X, ShoppingCart, Heart, Home, Package, Gamepad, Star } from 'lucide-react';
import { useAuthAction } from '@/hooks/useAuthAction';
import { Link, useRouter } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations, useLocale } from 'next-intl';
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
const locale = useLocale();

const localizeText = (value: any) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') {
        return locale === 'ar'
            ? (value.ar ?? value.en ?? '')
            : (value.en ?? value.ar ?? '');
    }
    return '';
};
export default function Navbar() {
    const t = useTranslations('Navbar');
    const { checkAuth } = useAuthAction();
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { isSignedIn, isLoaded } = useAuth();
    const cartCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

    const navLinks = [
        { name: t('home'), href: '/', icon: Home },
        { name: t('products'), href: '/products', icon: Package },
        { name: t('games'), href: '/games', icon: Gamepad },
        { name: t('wishlist'), href: '/wishlist', icon: Star },
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="sticky top-0 z-50 w-full"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
                <div className="absolute inset-0 backdrop-blur-xl bg-black/30" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                <div className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
                    <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
                        <motion.div variants={logoVariants} className="flex-shrink-0">
                            <Logo />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="hidden md:flex items-center space-x-1"
                        >
                            {navLinks.map((link) => {
                                const isWishlist = link.href === '/wishlist';
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="relative px-4 py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-amber-400 group cursor-pointer"
                                        onClick={(e) => {
                                            if (isWishlist) {
                                                e.preventDefault();
                                                checkAuth(() => router.push(link.href), undefined, link.href);
                                            }
                                        }}
                                    >
                                        <span className="relative z-10">{String(link.name)}</span>
                                        ...
                                        {String(link.name)}
                                        <span className="absolute inset-x-4 -bottom-0 h-[2px] scale-x-0 bg-gradient-to-r from-amber-400 to-yellow-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                                        <span className="absolute inset-0 -z-10 rounded-lg bg-amber-500/0 transition-colors duration-300 group-hover:bg-amber-500/10" />
                                    </Link>
                                );
                            })}
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex items-center gap-1 sm:gap-2"
                        >
                            <LanguageSwitcher />

                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-2 text-gray-400 transition-all duration-200 hover:text-amber-400 hover:bg-white/5 rounded-lg group"
                                aria-label="Search"
                            >
                                <SearchIcon className="w-5 h-5" />
                            </button>

                            <div className="hidden sm:flex items-center px-2">
                                {isLoaded && !isSignedIn && (
                                    <Link href="/sign-in" className="text-sm font-medium text-amber-400 hover:text-amber-300 border border-amber-500/50 hover:bg-amber-500/10 px-3 sm:px-4 py-1.5 rounded-lg transition-all whitespace-nowrap">
                                        {t('signIn')}
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

                            <div
                                onClick={() => checkAuth(() => router.push('/cart'), undefined, '/cart')}
                                className="relative p-2 text-gray-400 transition-all duration-200 hover:text-amber-400 hover:bg-white/5 rounded-lg group cursor-pointer"
                            >
                                <CartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-[#F5A524] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                                        {cartCount}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-gray-400 hover:text-amber-400 hover:bg-white/5 rounded-lg"
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </motion.div>
                    </div>
                </div>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-white/5 bg-black/80 backdrop-blur-xl"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isWishlist = link.href === '/wishlist';
                                    return (
                                        <div
                                            key={link.href}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                if (isWishlist) {
                                                    checkAuth(() => router.push(link.href), undefined, link.href);
                                                } else {
                                                    router.push(link.href);
                                                }
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Icon className="w-5 h-5" />
                                            {localizeText(link.name)}                                        </div>
                                    );
                                })}
                                <div className="pt-4 border-t border-white/10">
                                    {isLoaded && !isSignedIn && (
                                        <Link
                                            href="/sign-in"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-amber-400 border border-amber-500/50 hover:bg-amber-500/10 rounded-lg transition-all"
                                        >
                                            {t('signIn')}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {isSearchOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 top-full bg-black/80 backdrop-blur-xl border-t border-white/10"
                >
                    <div className="mx-auto max-w-2xl px-3 sm:px-4 py-3 sm:py-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder={t('search')}
                                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-sm sm:text-base text-gray-200 placeholder-gray-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                                autoFocus
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}