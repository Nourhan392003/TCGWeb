'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
    useEffect(() => {
        console.error('NotFound error: ', 'Page not found');
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-6xl sm:text-8xl font-bold text-amber-500 mb-4">404</h1>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">Page Not Found</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}