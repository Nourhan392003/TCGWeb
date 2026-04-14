'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { FaInstagram, FaTiktok, FaYoutube, FaWhatsapp } from 'react-icons/fa';

const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/hatar_anime', icon: FaInstagram, color: 'hover:text-pink-500' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@hataranime', icon: FaTiktok, color: 'hover:text-black' },
    { name: 'YouTube', href: 'https://youtube.com/@hatar_tcg', icon: FaYoutube, color: 'hover:text-red-500' },
    { name: 'WhatsApp', href: 'https://wa.me/966562464664', icon: FaWhatsapp, color: 'hover:text-green-500' },
];

const policyLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
];

const infoLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Subscribe', href: '/subscribe' },
    { label: 'Contact Us', href: '/contact' },
];

function NewsletterForm() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        console.log('Newsletter signup:', email);
    };

    return (
        <form method="post" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6 max-w-md">
            <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                />
            </div>
            <button 
                type="submit"
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-yellow-400 text-[#071a78] font-semibold text-sm sm:text-base rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
                Subscribe
                <ArrowRight className="w-4 h-4" />
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
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white transition-all duration-300 cursor-pointer"
            style={{ color: 'inherit' }}
        >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#071a78] text-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 md:px-12 mt-auto">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-white">Policies</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {policyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link 
                                        href={link.href}
                                        className="text-sm sm:text-base text-gray-300 hover:text-white hover:underline transition-colors cursor-pointer block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-white">More Info</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {infoLinks.map((link) => (
                                <li key={link.href}>
                                    <Link 
                                        href={link.href}
                                        className="text-sm sm:text-base text-gray-300 hover:text-white hover:underline transition-colors cursor-pointer block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-2">
                        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-white">
                            Subscribe to our newsletter!
                        </h3>
                        
                        <NewsletterForm />

                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <span className="text-gray-300 text-sm">Follow us:</span>
                            <div className="flex gap-2 sm:gap-3">
                                {socialLinks.map((social) => (
                                    <SocialIcon key={social.name} {...social} />
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 bg-white text-[#071a78] px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-yellow-400 hover:text-[#071a78] transition-all cursor-pointer"
                        >
                            Follow on shop
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
                    © {currentYear} HTR. All rights reserved.
                </div>
            </div>
        </footer>
    );
}