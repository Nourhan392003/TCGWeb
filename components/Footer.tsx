'use client';

import { useState } from 'react';
import { ArrowRight, Facebook, Instagram, Twitter, Youtube, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const policiesLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
];

const moreInfoLinks = [
    { label: 'About Us', href: '/about' },
    // FAQ page not yet implemented - uncomment when available
    // { label: 'FAQ', href: '/faq' },
    { label: 'Subscribe', href: '/subscribe' },
    { label: 'Contact Us', href: '/contact' },
];

const socialIcons = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'Youtube' },
];

export function CookieBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white text-black px-4 py-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center md:text-left">
          We use cookies to improve your experience and analyze website traffic.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setIsVisible(false)}
            className="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            DECLINE
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            ACCEPT
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      <footer className="bg-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Policies</h3>
              <ul className="space-y-3">
                {policiesLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white hover:underline transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">More Info</h3>
              <ul className="space-y-3">
                {moreInfoLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white hover:underline transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-white">
                Subscribe to our newsletter for new product updates and exclusive deals!
              </h3>
              
              <div className="flex items-center border-b border-gray-600 pb-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full py-2"
                />
                <button className="text-gray-400 hover:text-white transition-colors p-1">
                  <ArrowRight size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {socialIcons.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>

              <Link href="/products" className="inline-flex items-center gap-2 w-full sm:w-auto px-6 py-3 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
                Follow on shop
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} TCG Vault. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <CookieBar />
    </>
  );
}