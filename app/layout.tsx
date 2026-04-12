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
            <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
                <Providers>
                    <Navbar />
                    <main className="flex-grow pt-4">
                        {children}
                    </main>
                    <Footer />
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}