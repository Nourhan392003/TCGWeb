"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { useLocale } from "next-intl";

export const useAuthAction = () => {
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const checkAuth = (
        action: () => void,
        message?: string,
        customRedirect?: string
    ) => {
        console.log("AUTH CHECK", { isLoaded, isSignedIn, pathname, locale });

        if (!isLoaded) {
            toast.error("Authentication is still loading");
            return false;
        }

        if (!isSignedIn) {
            toast.error(message || "Please login to continue");

            const redirectPath = customRedirect || pathname;
            const normalizedRedirect = redirectPath.startsWith(`/${locale}`)
                ? redirectPath
                : `/${locale}${redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`}`;

            console.log("REDIRECTING TO", normalizedRedirect);
            return false;
        }

        action();
        return true;
    };

    return { checkAuth, isSignedIn, isLoaded };
};