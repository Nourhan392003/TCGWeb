"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { arSA } from "@clerk/localizations";

type Props = {
    children: React.ReactNode;
    locale: string;
};

export default function Providers({ children, locale }: Props) {
    return (
        <ClerkProvider
            localization={locale === "ar" ? (arSA as any) : undefined}
        >
            {children}
        </ClerkProvider>
    );
}