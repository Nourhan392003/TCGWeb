'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft, Shield, FileText, Mail } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import { useTranslations, useLocale } from 'next-intl';

export default function PrivacyPolicyClient() {
  const t = useTranslations('Policies');
  const tp = useTranslations('Policies.privacy');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <BackButton text={t('back')} />
          <h1 className="text-4xl md:text-5xl font-bold text-white">{tp('title')}</h1>
          <p className="text-gray-200 mt-3 text-lg md:text-xl font-medium drop-shadow-sm">{tp('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{tp('section1.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{tp('section1.p1')}</p>
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{tp('section1.l1')}</li>
                <li>{tp('section1.l2')}</li>
                <li>{tp('section1.l3')}</li>
                <li>{tp('section1.l4')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{tp('section2.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{tp('section2.p1')}</p>
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{tp('section2.l1')}</li>
                <li>{tp('section2.l2')}</li>
                <li>{tp('section2.l3')}</li>
                <li>{tp('section2.l4')}</li>
                <li>{tp('section2.l5')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{tp('section3.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{tp('section3.p1')}</p>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{tp('section4.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{tp('section4.p1')}</p>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <ul className="space-y-2 ltr:ml-4 rtl:mr-4">
                <li>Email: hatartcg@gmail.com</li>
                <li>Phone: +966 56 246 4664</li>
              </ul>
            </div>
          </section>

          <p className="text-gray-500 text-sm text-center pt-8 border-t border-[#1a3050]">
            {t('lastUpdated')}
          </p>
        </div>
      </div>
    </div>
  );
}
