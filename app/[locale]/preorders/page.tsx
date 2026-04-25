import { getMessages } from 'next-intl/server';
import PreordersClient from "@/components/pages/PreordersClient";

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages: any = await getMessages();
    const t = messages.SEO;

    return {
        title: t.preordersTitle,
        description: t.defaultDesc,
    };
}

export default async function PreordersPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return <PreordersClient />;
}
