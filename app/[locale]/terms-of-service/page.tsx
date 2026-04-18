import { getMessages } from 'next-intl/server';
import TermsOfServiceClient from "@/components/pages/TermsOfServiceClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const messages: any = await getMessages();
    const t = messages.SEO;
    return {
        title: t.termsTitle || "Terms of Service - TCG Vault",
        description: t.defaultDesc,
    };
}

export default function TermsOfServicePage() {
    return <TermsOfServiceClient />;
}