'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Award, Heart, Target, Mail, Phone, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">About Us</h1>
          <p className="text-gray-400 mt-2 text-lg">Your trusted source for trading cards</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Our Story</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>TCG Vault was founded with a simple mission: to provide collectors and players with the best selection of trading cards at competitive prices. What started as a small local shop has grown into a trusted online destination for TCG enthusiasts across the region.</p>
              <p>We specialize in Pokemon, Yu-Gi-Oh!, One Piece, and Magic: The Gathering cards, offering everything from budget-friendly singles to premium graded collectibles.</p>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Our Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">Quality First</h3>
                <p className="text-gray-400 text-sm">Every card is carefully inspected and professionally graded</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">Customer Focus</h3>
                <p className="text-gray-400 text-sm">Your satisfaction is our top priority</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">Community</h3>
                <p className="text-gray-400 text-sm">Building lasting relationships with collectors</p>
              </div>
            </div>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Why Choose TCG Vault?</h2>
            </div>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">✓</span>
                </span>
                <span>Authentic products with verified authenticity guarantee</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">✓</span>
                </span>
                <span>Professional card grading and condition assessment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">✓</span>
                </span>
                <span>Secure packaging and fast shipping</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">✓</span>
                </span>
                <span>Competitive prices and regular discounts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-yellow-500 text-sm font-bold">✓</span>
                </span>
                <span>Knowledgeable staff passionate about TCGs</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-white">Get In Touch</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Email</h3>
                  <p className="text-gray-400 text-sm">support@tcgvault.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Phone</h3>
                  <p className="text-gray-400 text-sm">+966 XX XXX XXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Location</h3>
                  <p className="text-gray-400 text-sm">Riyadh, Saudi Arabia</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}