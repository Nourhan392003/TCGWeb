'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft, Users, Award, Heart, Target, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AboutClient() {
  const t = useTranslations('About');

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2 rtl:rotate-180" />
            {t('back')}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{t('title')}</h1>
          <p className="text-gray-400 mt-2 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">{t('story.title')}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>{t('story.p1')}</p>
              <p>{t('story.p2')}</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">{t('values.title')}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">{t('values.quality.title')}</h3>
                <p className="text-gray-400 text-sm">{t('values.quality.desc')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">{t('values.customer.title')}</h3>
                <p className="text-gray-400 text-sm">{t('values.customer.desc')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">{t('values.community.title')}</h3>
                <p className="text-gray-400 text-sm">{t('values.community.desc')}</p>
              </div>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">{t('why.title')}</h2>
            </div>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">✓</span>
                </span>
                <span>{t('why.l1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">✓</span>
                </span>
                <span>{t('why.l2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">✓</span>
                </span>
                <span>{t('why.l3')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">✓</span>
                </span>
                <span>{t('why.l4')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">✓</span>
                </span>
                <span>{t('why.l5')}</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">{t('getInTouch')}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{t('email')}</h3>
                  <p className="text-gray-400 text-sm">support@tcgvault.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{t('phone')}</h3>
                  <p className="text-gray-400 text-sm">+966 56 246 4664</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{t('location')}</h3>
                  <p className="text-gray-400 text-sm">{t('locationValue')}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
