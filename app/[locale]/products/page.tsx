import { getMessages } from 'next-intl/server';
import ProductsClient from "@/components/pages/ProductsClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const messages: any = await getMessages();
    const t = messages.SEO;

    return {
        title: t.productsTitle,
        description: t.defaultDesc,
    };
}

export default function ProductsPage() {
    return <ProductsClient />;
}
