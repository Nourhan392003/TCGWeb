"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export const normalizeLocalePath = (path: string, locale: string) => {
    if (!path) return `/${locale}`;
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) return path;
    if (path.startsWith("/")) return `/${locale}${path}`;
    return `/${locale}/${path}`;
};

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
        if (!isLoaded) {
            toast.error("Authentication is still loading");
            return false;
        }

        if (!isSignedIn) {
            const redirectPath = normalizeLocalePath(
                customRedirect || pathname,
                locale
            );
            const signInHref = `/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`;
            router.push(signInHref);
            return false;
        }

        action();
        return true;
    };

    return { checkAuth, isSignedIn: isSignedIn ?? false, isLoaded };
};

export const useRequireAuth = (customRedirect?: string) => {
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            const redirectPath = normalizeLocalePath(
                customRedirect || pathname,
                locale
            );
            const signInHref = `/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`;
            router.replace(signInHref);
        }
    }, [isLoaded, isSignedIn, router, pathname, locale, customRedirect]);

    return { isLoaded, isSignedIn: isSignedIn ?? false };
};
