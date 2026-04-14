import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: 'TCG Vault - Premium Trading Cards',
    description: 'Your premium source for trading card games - Pokémon, Yu-Gi-Oh!, Magic & more',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
                <meta name="theme-color" content="#0a0a0f" />
            </head>
            <body className={`${inter.className} bg-[#0a0a0f] text-white min-h-screen flex flex-col antialiased`}>
                <Providers>
                    <Navbar />
                    <main className="flex-grow pt-0">
                        {children}
                    </main>
                    <Footer />
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}