import { getMessages, setRequestLocale } from 'next-intl/server';
import RefundPolicyClient from "@/components/pages/RefundPolicyClient";

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
        title: t.refundPolicyTitle || "Refund Policy - TCG Vault",
        description: t.defaultDesc,
    };
}

export default async function RefundPolicyPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <RefundPolicyClient />;
}