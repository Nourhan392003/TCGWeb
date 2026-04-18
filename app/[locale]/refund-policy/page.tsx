import { getMessages } from 'next-intl/server';
import RefundPolicyClient from "@/components/pages/RefundPolicyClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const messages: any = await getMessages();
    const t = messages.SEO;

    return {
        title: t.refundPolicyTitle || "Refund Policy - TCG Vault",
        description: t.defaultDesc,
    };
}

export default function RefundPolicyPage() {
    return <RefundPolicyClient />;
}