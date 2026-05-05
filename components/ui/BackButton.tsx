'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { useLocale } from 'next-intl';

interface BackButtonProps {
    href?: string;
    text: string;
    className?: string;
}

export default function BackButton({ href = "/", text, className = "" }: BackButtonProps) {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    return (
        <Link 
            href={href as any} 
            className={`inline-flex items-center text-gray-300 hover:text-white mb-6 transition-all duration-200 group bg-[#0d1f35]/50 hover:bg-[#0d1f35] px-4 py-2.5 rounded-xl border border-[#1a3050] hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 w-fit font-medium text-sm md:text-base ${className}`}
        >
            <ArrowLeft className={`w-5 h-5 transition-transform duration-200 ${isRTL ? 'ml-2.5 rotate-180 group-hover:translate-x-1' : 'mr-2.5 group-hover:-translate-x-1'}`} />
            {text}
        </Link>
    );
}
