import { getMessages, setRequestLocale } from 'next-intl/server';
import TermsOfServiceClient from "@/components/pages/TermsOfServiceClient";

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
        title: t.termsTitle || "Terms of Service - TCG Vault",
        description: t.defaultDesc,
    };
}

export default async function TermsOfServicePage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <TermsOfServiceClient />;
}