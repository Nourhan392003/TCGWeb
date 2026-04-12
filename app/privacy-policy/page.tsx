'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Truck, RefreshCw, FileText, Mail, MapPin, Phone, Clock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
          <p className="text-gray-400 mt-2 text-lg">Your privacy is important to us</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information</li>
                <li>Payment and billing information</li>
                <li>Order history and preferences</li>
                <li>Communication history with our team</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your purchases</li>
                <li>Provide customer support</li>
                <li>Send you promotional offers (with your consent)</li>
                <li>Improve our services and website</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Data Protection</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your payment information is encrypted using industry-standard security protocols.</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Third-Party Disclosure</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with trusted service providers who assist us in operating our website, conducting our business, or servicing you.</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <ul className="space-y-2 ml-4">
                <li>Email: support@tcgvault.com</li>
                <li>Phone: +966 XX XXX XXXX</li>
              </ul>
            </div>
          </section>

          <p className="text-gray-500 text-sm text-center pt-8 border-t border-[#1a3050]">
            Last updated: April 2026
          </p>
        </div>
      </div>
    </div>
  );
}