import { getMessages } from 'next-intl/server';
import AboutClient from "@/components/pages/AboutClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const messages: any = await getMessages();
    const t = messages.SEO;

    return {
        title: t.aboutTitle,
        description: t.defaultDesc,
    };
}

export default function AboutPage() {
    return <AboutClient />;
}