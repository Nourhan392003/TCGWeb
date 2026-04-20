import { getMessages, setRequestLocale } from 'next-intl/server';
import ShippingPolicyClient from "@/components/pages/ShippingPolicyClient";

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
        title: t.shippingPolicyTitle || "Shipping Policy - TCG Vault",
        description: t.defaultDesc,
    };
}

export default async function ShippingPolicyPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ShippingPolicyClient />;
}