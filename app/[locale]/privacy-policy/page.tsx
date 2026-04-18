import { getMessages } from 'next-intl/server';
import PrivacyPolicyClient from "@/components/pages/PrivacyPolicyClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const messages: any = await getMessages();
    const t = messages.SEO;

    return {
        title: t.privacyPolicyTitle || "Privacy Policy - TCG Vault",
        description: t.defaultDesc,
    };
}

export default function PrivacyPolicyPage() {
    return <PrivacyPolicyClient />;
}