'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft, Truck, Package, Clock, MapPin, Mail, Globe } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import { useTranslations, useLocale } from 'next-intl';

export default function ShippingPolicyClient() {
  const t = useTranslations('Policies');
  const ts = useTranslations('Policies.shipping');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <BackButton text={t('back')} />
          <h1 className="text-4xl md:text-5xl font-bold text-white">{ts('title')}</h1>
          <p className="text-gray-200 mt-3 text-lg md:text-xl font-medium drop-shadow-sm">{ts('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{ts('methods.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{ts('methods.p1')}</p>
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li><strong className="text-white">{ts('methods.l1').split(':')[0]}:</strong> {ts('methods.l1').split(':').slice(1).join(':')}</li>
                <li><strong className="text-white">{ts('methods.l2').split(':')[0]}:</strong> {ts('methods.l2').split(':').slice(1).join(':')}</li>
                <li><strong className="text-white">{ts('methods.l3').split(':')[0]}:</strong> {ts('methods.l3').split(':').slice(1).join(':')}</li>
                <li><strong className="text-white">{ts('methods.l4').split(':')[0]}:</strong> {ts('methods.l4').split(':').slice(1).join(':')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{ts('packaging.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{ts('packaging.p1')}</p>
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{ts('packaging.l1')}</li>
                <li>{ts('packaging.l2')}</li>
                <li>{ts('packaging.l3')}</li>
                <li>{ts('packaging.l4')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{ts('processing.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{ts('processing.l1')}</li>
                <li>{ts('processing.l2')}</li>
                <li>{ts('processing.l3')}</li>
                <li>{ts('processing.l4')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{ts('international.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{ts('international.p1')}</p>
              <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
                <li>{ts('international.l1')}</li>
                <li>{ts('international.l2')}</li>
                <li>{ts('international.l3')}</li>
                <li>{ts('international.l4')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">{ts('address.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>{ts('address.p1')}</p>
            </div>
          </section>

          <section className="bg-[#0d1f35]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#1a3050] hover:border-[#2a4566] transition-all duration-300 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
              <p>For shipping inquiries, please contact us at:</p>
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
