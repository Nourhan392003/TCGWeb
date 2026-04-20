"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { useLocale } from "next-intl";

export const useAuthAction = () => {
    const { isSignedIn } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const checkAuth = (action: () => void, message?: string, customRedirect?: string) => {
        if (!isSignedIn) {
            toast.error(message || "Please login to continue");

            // Build redirect URL with locale prefix for proper routing
            const redirectPath = customRedirect || pathname;
            // Ensure the path includes the locale prefix
            const fullRedirect = `/${locale}${redirectPath.startsWith('/') ? redirectPath : '/' + redirectPath}`;
            router.push(`/sign-in?redirect_url=${encodeURIComponent(fullRedirect)}`);
            return false;
        }

        action();
        return true;
    };

    return { checkAuth, isSignedIn };
};