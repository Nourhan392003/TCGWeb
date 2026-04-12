'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Shield, AlertCircle, Gavel, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Terms of Service</h1>
          <p className="text-gray-400 mt-2 text-lg">Please read our terms carefully</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Acceptance of Terms</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>By accessing and using the TCG Vault website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Use License</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>Permission is granted to temporarily use TCG Vault for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Transfer the materials to another person</li>
                <li>Attempt to reverse engineer any software contained in the website</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Product Information</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We strive to provide accurate product descriptions and images. However:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Colors may appear differently on your monitor</li>
                <li>Card conditions are based on our professional grading</li>
                <li>We reserve the right to correct any pricing errors</li>
                <li>Product availability is subject to change without notice</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Orders and Payments</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All orders are subject to acceptance and availability</li>
                <li>Payment must be received before order processing</li>
                <li>We accept major credit cards and digital payments</li>
                <li>Orders may be cancelled if payment cannot be verified</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Limitation of Liability</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>TCG Vault shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of our website.</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Changes to Terms</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We reserve the right to modify these terms at any time. Your continued use of the website following any changes indicates your acceptance of the new terms.</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
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