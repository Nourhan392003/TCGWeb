'use client';

import { Link } from '@/i18n/navigation';
import { ArrowRight, Mail } from 'lucide-react';
import { FaInstagram, FaTiktok, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import toast from 'react-hot-toast';

const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/hatar_anime', icon: FaInstagram, color: 'hover:text-pink-500' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@hataranime', icon: FaTiktok, color: 'hover:text-black' },
    { name: 'YouTube', href: 'https://youtube.com/@hatar_tcg', icon: FaYoutube, color: 'hover:text-red-500' },
    { name: 'WhatsApp', href: 'https://wa.me/966562464664', icon: FaWhatsapp, color: 'hover:text-green-500' },
];

function NewsletterForm() {
    const t = useTranslations('Footer');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const subscribe = useMutation(api.contact.subscribeNewsletter);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await subscribe({ email });
            toast.success(t('subscribeSuccess') || 'Subscribed successfully!');
            setEmail('');
        } catch (error) {
            console.error('Newsletter error:', error);
            toast.error(t('subscribeError') || 'Failed to subscribe. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6 max-w-md">
            <div className="flex-1 relative">
                <Mail className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletterPlaceholder')}
                    required
                    disabled={isLoading}
                    className="w-full ltr:pl-9 ltr:sm:pl-10 rtl:pr-9 rtl:sm:pr-10 ltr:pr-3 rtl:pl-3 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-500 text-black font-bold text-sm sm:text-base rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 min-w-[120px]"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                    <>
                        {t('subscribeTitle')}
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </>
                )}
            </button>
        </form>
    );
}

function SocialIcon({ href, name, icon: Icon, color }: { href: string; name: string; icon: React.ElementType; color: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
        >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
    );
}

export default function Footer() {
    const t = useTranslations('Footer');
    const locale = useLocale();
    const currentYear = new Date().getFullYear();

    const policyLinks = [
        { label: t('privacyPolicy'), href: '/privacy-policy' },
        { label: t('refundPolicy'), href: '/refund-policy' },
        { label: t('shippingPolicy'), href: '/shipping-policy' },
        { label: t('termsOfService'), href: '/terms-of-service' },
    ];

    const infoLinks = [
        { label: t('aboutUs'), href: '/about' },
        // FAQ page not yet implemented - uncomment when available
        // { label: t('faq'), href: '/faq' },
        { label: t('contactUs'), href: '/contact' },
    ];

    return (
        <footer className="bg-[#0a0a0f] border-t border-white/5 text-white py-12 sm:py-16 px-4 sm:px-6 md:px-12 mt-auto">
            <div className="max-w-7xl mx-auto ltr:text-left rtl:text-right">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-16">
                    <div>
                        <h3 className="text-lg font-black mb-6 text-white uppercase tracking-widest">{t('policies')}</h3>
                        <ul className="space-y-4">
                            {policyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-black mb-6 text-white uppercase tracking-widest">{t('moreInfo')}</h3>
                        <ul className="space-y-4">
                            {infoLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-2">
                        <h3 className="text-xl font-black mb-6 text-white uppercase tracking-widest">
                            {t('newsletter')}
                        </h3>

                        <NewsletterForm />

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">{t('followUs')}</span>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <SocialIcon key={social.name} {...social} />
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/products"
                            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                        >
                            {t('followShop')}
                            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                        </Link>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 text-center text-gray-500 text-sm font-medium">
                    © {currentYear} TCG VAULT. {t('allRightsReserved')}
                </div>
            </div>
        </footer>
    );
}