'use client';

import Link from 'next/link';
import { ArrowLeft, Truck, Package, Clock, MapPin, Mail, Globe } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Shipping Policy</h1>
          <p className="text-gray-400 mt-2 text-lg">Fast and secure delivery to your door</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Shipping Methods</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We offer multiple shipping options:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Standard Shipping:</strong> 5-7 business days - Free for orders over 200 SAR</li>
                <li><strong className="text-white">Express Shipping:</strong> 2-3 business days - 30 SAR</li>
                <li><strong className="text-white">Priority Shipping:</strong> 1-2 business days - 50 SAR</li>
                <li><strong className="text-white">International Shipping:</strong> 7-14 business days - Calculated at checkout</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Packaging</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>All trading cards are carefully packaged to ensure safe delivery:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cards are placed in protective sleeves and top loaders</li>
                <li>Products are wrapped in bubble wrap</li>
                <li>Boxes are reinforced with packing materials</li>
                <li>Graded cards get extra protection with hard cases</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Processing Time</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Orders are processed within 1-2 business days</li>
                <li>Custom orders may take 3-5 business days</li>
                <li>Pre-orders ship on the release date</li>
                <li>Tracking information is sent via email once shipped</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">International Shipping</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We ship internationally to select countries. Please note:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Customs fees and taxes are the responsibility of the buyer</li>
                <li>International orders may be subject to customs inspections</li>
                <li>Delivery times vary by country</li>
                <li>Contact us for shipping availability to your country</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Shipping Address</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>Please ensure your shipping address is correct at checkout. We are not responsible for orders delivered to incorrect addresses provided by the customer.</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>For shipping inquiries, please contact us at:</p>
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