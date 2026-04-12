'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Gift, Zap, Star } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Thank you for subscribing!');
    setEmail('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Subscribe</h1>
          <p className="text-gray-400 mt-2 text-lg">Stay updated with exclusive offers</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">Why Subscribe?</h2>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>Early access to new product releases</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>Exclusive discounts and special offers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>Member-only promotions and giveaways</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>Latest news and updates from the TCG world</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-white">Join Our Newsletter</h2>
              </div>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-[#0a1628] border border-[#1a3050] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </form>
              <p className="text-gray-500 text-sm mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl p-6 md:p-8 border border-yellow-500/30">
              <h2 className="text-2xl font-bold text-white mb-4">Subscriber Benefits</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-500 font-bold">10%</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Welcome Discount</h3>
                    <p className="text-gray-400 text-sm">10% off your first order</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-500 font-bold">24h</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Early Access</h3>
                    <p className="text-gray-400 text-sm">24h before public release</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Monthly Giveaways</h3>
                    <p className="text-gray-400 text-sm">Win free cards every month</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0d1f35] rounded-xl p-6 md:p-8 border border-[#1a3050]">
              <h2 className="text-xl font-semibold text-white mb-4">What You'll Get</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Weekly deals and promotions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  New arrival announcements
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  TCG market news and trends
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Exclusive subscriber-only sales
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}