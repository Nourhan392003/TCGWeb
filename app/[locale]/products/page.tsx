import { getMessages } from 'next-intl/server';
import ProductsClient from "@/components/pages/ProductsClient";

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages: any = await getMessages();
    const t = messages.SEO;

    return {
        title: t.productsTitle,
        description: t.defaultDesc,
    };
}

export default async function ProductsPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return <ProductsClient />;
}
