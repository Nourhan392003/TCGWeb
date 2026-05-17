import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';
import { ConvexClientProvider } from "@/components/convex-client-provider";

export const metadata: Metadata = {
    icons: {
        icon: '/icon.png',
    },
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body>
                    <ConvexClientProvider>
                        {children}
                    </ConvexClientProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}