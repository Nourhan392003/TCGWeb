'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, RefreshCw, CreditCard, FileText, Mail, Clock } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Refund Policy</h1>
          <p className="text-gray-400 mt-2 text-lg">Our commitment to your satisfaction</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Eligibility for Refunds</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We offer refunds under the following conditions:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Items received damaged or defective</li>
                <li>Wrong item shipped to you</li>
                <li>Items not as described on our website</li>
                <li>Request made within 14 days of delivery</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Refund Process</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>To request a refund:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact us at support@tcgvault.com within 14 days</li>
                <li>Provide your order number and reason for refund</li>
                <li>Return the item in original condition</li>
                <li>Refunds are processed within 5-7 business days</li>
              </ol>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Non-Refundable Items</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>The following items cannot be refunded:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Opened or used trading card products</li>
                <li>Singed or graded cards (unless damaged)</li>
                <li>Items damaged by customer misuse</li>
                <li>Items returned after 14 days of delivery</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Refund Method</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>Refunds will be issued to the original payment method. Please allow 5-10 business days for the refund to appear in your account after processing.</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>For refund inquiries, please contact us at:</p>
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