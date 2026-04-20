'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-4xl sm:text-6xl font-bold text-red-500 mb-4">Oops!</h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Something went wrong</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    {error.message || 'An unexpected error occurred. Please try again.'}
                </p>
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}