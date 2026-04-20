import { getMessages, setRequestLocale } from 'next-intl/server';
import AboutClient from "@/components/pages/AboutClient";

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
        title: t.aboutTitle,
        description: t.defaultDesc,
    };
}

export default async function AboutPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <AboutClient />;
}