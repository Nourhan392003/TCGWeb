import { getMessages, setRequestLocale } from 'next-intl/server';
import ContactClient from "@/components/pages/ContactClient";

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
        title: t.contactTitle,
        description: t.defaultDesc,
    };
}

export default async function ContactPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ContactClient />;
}