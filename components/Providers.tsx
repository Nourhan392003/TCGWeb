'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Toaster } from "react-hot-toast";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
            <ConvexProvider client={convex}>
                {children}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#333',
                            color: '#fff',
                        },
                    }}
                />
            </ConvexProvider>
        </ClerkProvider>
    );
}