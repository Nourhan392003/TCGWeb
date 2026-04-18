"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export const useAuthAction = () => {
    const { isSignedIn } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('Actions');

    const checkAuth = (action: () => void, message?: string, customRedirect?: string) => {
        if (!isSignedIn) {
            toast.error(message || t('loginRequired'));

            // Redirect to sign-in with the current path or custom path as redirect_url
            const redirectUrl = encodeURIComponent(customRedirect || pathname);
            router.push(`/sign-in?redirect_url=${redirectUrl}`);
            return false;
        }

        action();
        return true;
    };

    return { checkAuth, isSignedIn };
};
