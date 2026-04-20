import { getMessages, setRequestLocale } from 'next-intl/server';
import PrivacyPolicyClient from "@/components/pages/PrivacyPolicyClient";

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
        title: t.privacyPolicyTitle || "Privacy Policy - TCG Vault",
        description: t.defaultDesc,
    };
}

export default async function PrivacyPolicyPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <PrivacyPolicyClient />;
}