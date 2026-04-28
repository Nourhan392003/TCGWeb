import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Providers from '@/components/Providers';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <Providers locale={locale} messages={messages}>
            <ConvexClientProvider>
                <div lang={locale} className={locale === 'ar' ? 'font-ar' : ''} dir={locale === 'ar' ? 'rtl' : 'ltr'}>                            <Navbar />
                    {children}
                    <Footer />
                </div>
            </ConvexClientProvider>
        </Providers>
    );
}