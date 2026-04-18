import { getMessages } from 'next-intl/server';
import ContactClient from "@/components/pages/ContactClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const messages: any = await getMessages();
    const t = messages.SEO;

    return {
        title: t.contactTitle,
        description: t.defaultDesc,
    };
}

export default function ContactPage() {
    return <ContactClient />;
}