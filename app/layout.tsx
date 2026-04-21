import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    icons: {
        icon: '/icon.png',
    },
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html suppressHydrationWarning>
                <body>{children}</body>
            </html>
        </ClerkProvider>
    );
}