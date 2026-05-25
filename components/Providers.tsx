"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "react-hot-toast";

type Props = {
    children: React.ReactNode;
    locale: string;
    messages: any;
};

export default function Providers({ children, locale, messages }: Props) {
    return (
        <ClerkProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
                <Toaster position="top-center" />
            </NextIntlClientProvider>
        </ClerkProvider>
    );
}