'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft, FileText, Shield, AlertCircle, Gavel, Mail } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function TermsOfServiceClient() {
  const t = useTranslations('Policies');
  const tt = useTranslations('Policies.terms');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {t('back')}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{tt('title')}</h1>
          <p className="text-gray-400 mt-2 text-lg">{tt('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">{tt('acceptance.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>{tt('acceptance.p1')}</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">{tt('license.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>{tt('license.p1')}</p>
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{tt('license.l1')}</li>
                <li>{tt('license.l2')}</li>
                <li>{tt('license.l3')}</li>
                <li>{tt('license.l4')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">{tt('productInfo.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>{tt('productInfo.p1')}</p>
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{tt('productInfo.l1')}</li>
                <li>{tt('productInfo.l2')}</li>
                <li>{tt('productInfo.l3')}</li>
                <li>{tt('productInfo.l4')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">{tt('orders.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{tt('orders.l1')}</li>
                <li>{tt('orders.l2')}</li>
                <li>{tt('orders.l3')}</li>
                <li>{tt('orders.l4')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">{tt('liability.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>{tt('liability.p1')}</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">{tt('changes.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>{tt('changes.p1')}</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
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
