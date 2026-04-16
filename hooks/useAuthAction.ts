"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export const useAuthAction = () => {
    const { isSignedIn } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    const checkAuth = (action: () => void, message?: string, customRedirect?: string) => {
        if (!isSignedIn) {
            const arabicMessage = "يرجى تسجيل الدخول أولًا لإضافة المنتجات أو إكمال الشراء";
            toast.error(message || arabicMessage);
            
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
