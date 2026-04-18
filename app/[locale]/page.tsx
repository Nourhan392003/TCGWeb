import { getMessages, setRequestLocale } from 'next-intl/server';
import HomeClient from '@/components/pages/HomeClient';

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const messages: any = await getMessages();
    const t = messages.SEO;

    return {
        title: t.homeTitle,
        description: t.defaultDesc
    };
}

export default async function Home({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <HomeClient />;
}