import { getMessages } from 'next-intl/server';
import ShippingPolicyClient from "@/components/pages/ShippingPolicyClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const messages: any = await getMessages();
    const t = messages.SEO;
    return {
        title: t.shippingPolicyTitle || "Shipping Policy - TCG Vault",
        description: t.defaultDesc,
    };
}

export default function ShippingPolicyPage() {
    return <ShippingPolicyClient />;
}