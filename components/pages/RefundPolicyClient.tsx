'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft, RefreshCw, CreditCard, FileText, Mail } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import { useTranslations, useLocale } from 'next-intl';

export default function RefundPolicyClient() {
  const t = useTranslations('Policies');
  const tr = useTranslations('Policies.refund');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <BackButton text={t('back')} />
          <h1 className="text-4xl md:text-5xl font-bold text-white">{tr('title')}</h1>
          <p className="text-gray-200 mt-3 text-lg md:text-xl font-medium drop-shadow-sm">{tr('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{tr('eligibility.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{tr('eligibility.p1')}</p>
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{tr('eligibility.l1')}</li>
                <li>{tr('eligibility.l2')}</li>
                <li>{tr('eligibility.l3')}</li>
                <li>{tr('eligibility.l4')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{tr('process.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{tr('process.p1')}</p>
              <ol className="list-decimal list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{tr('process.l1')}</li>
                <li>{tr('process.l2')}</li>
                <li>{tr('process.l3')}</li>
                <li>{tr('process.l4')}</li>
              </ol>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{tr('nonRefundable.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{tr('nonRefundable.p1')}</p>
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{tr('nonRefundable.l1')}</li>
                <li>{tr('nonRefundable.l2')}</li>
                <li>{tr('nonRefundable.l3')}</li>
                <li>{tr('nonRefundable.l4')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{tr('method.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{tr('method.p1')}</p>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>For refund inquiries, please contact us at:</p>
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
