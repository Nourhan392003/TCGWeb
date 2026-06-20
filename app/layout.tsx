import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import ConvexClientProvider from "@/components/ConvexClientProvider";

export const metadata: Metadata = {
    icons: {
        icon: "/icon.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ClerkProvider>
                    <ConvexClientProvider>{children}</ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}