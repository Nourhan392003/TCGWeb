'use client';

import { Link } from "@/i18n/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations('Admin');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex">
            {/* Sidebar */}
            <aside className={`w-64 bg-[#12121a] border-${isRTL ? 'l' : 'r'} border-[#2a2a38] hidden md:flex flex-col`}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-yellow-500">TCG Admin</h2>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a24] text-gray-300 hover:text-white transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>{t('dashboard')}</span>
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a24] text-gray-300 hover:text-white transition-colors"
                    >
                        <Package className="w-5 h-5" />
                        <span>{t('products')}</span>
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a24] text-gray-300 hover:text-white transition-colors"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{t('orders')}</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-[#2a2a38]">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Back to Store</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className={`h-16 border-b border-[#2a2a38] bg-[#12121a]/50 backdrop-blur-sm flex items-center px-8 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <h1 className="text-xl font-semibold">{t('dashboard')}</h1>
                </header>
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}