"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-black text-[#1a1a24] select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
              <span className="text-5xl">🃏</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
        <p className="text-gray-400 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a24] border border-[#2a2a38] text-white font-semibold rounded-xl hover:border-yellow-500/50 transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
