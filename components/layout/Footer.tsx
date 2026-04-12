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
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                />
            </div>
            <button 
                type="submit"
                className="px-6 py-3 bg-yellow-400 text-[#071a78] font-semibold rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
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
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white transition-all duration-300 cursor-pointer"
            style={{ color: 'inherit' }}
        >
            <Icon className={`w-5 h-5 ${color}`} />
        </a>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#071a78] text-white py-16 px-6 md:px-12 mt-auto">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Policies Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-5 text-white">Policies</h3>
                        <ul className="space-y-3">
                            {policyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link 
                                        href={link.href}
                                        className="text-gray-300 hover:text-white hover:underline transition-colors cursor-pointer block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* More Info Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-5 text-white">More Info</h3>
                        <ul className="space-y-3">
                            {infoLinks.map((link) => (
                                <li key={link.href}>
                                    <Link 
                                        href={link.href}
                                        className="text-gray-300 hover:text-white hover:underline transition-colors cursor-pointer block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Social Column */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold mb-5 text-white">
                            Subscribe to our newsletter for new product updates and exclusive deals!
                        </h3>
                        
                        <NewsletterForm />

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-gray-300 text-sm mr-2">Follow us:</span>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <SocialIcon key={social.name} {...social} />
                                ))}
                            </div>
                        </div>

                        {/* Follow on Shop Button */}
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 bg-white text-[#071a78] px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-[#071a78] transition-all cursor-pointer"
                        >
                            Follow on shop
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
                    © {currentYear} HTR. All rights reserved.
                </div>
            </div>
        </footer>
    );
}