'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLocale = (newLocale: 'en' | 'ar') => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 text-gray-400 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-all"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
        <span className="text-xs font-bold uppercase">{locale}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-32 z-50 overflow-hidden rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl"
            >
              <button
                onClick={() => toggleLocale('en')}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${locale === 'en' ? 'text-amber-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span>English</span>
                {locale === 'en' && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
              <button
                onClick={() => toggleLocale('ar')}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${locale === 'ar' ? 'text-amber-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span>العربية</span>
                {locale === 'ar' && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
