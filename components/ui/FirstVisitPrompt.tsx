"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "tcg-welcome-prompt-dismissed";

export default function FirstVisitPrompt() {
    const t = useTranslations("WelcomePrompt");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const { isSignedIn, isLoaded } = useUser();

    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);
    const ctaRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoaded || isSignedIn) return;

        try {
            const dismissed = localStorage.getItem(STORAGE_KEY);
            if (!dismissed) {
                const timer = setTimeout(() => setVisible(true), 2000);
                return () => clearTimeout(timer);
            }
        } catch {
            setVisible(true);
        }
    }, [isLoaded, isSignedIn]);

    useEffect(() => {
        if (!visible) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleDismiss();
            }
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [visible]);

    useEffect(() => {
        if (visible) {
            closeRef.current?.focus();
        }
    }, [visible]);

    const handleDismiss = () => {
        try {
            localStorage.setItem(STORAGE_KEY, "true");
        } catch {
            // private browsing — silently ignore
        }
        setVisible(false);
    };

    if (!mounted || !isLoaded || isSignedIn || !visible) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="vault-prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
                >
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleDismiss}
                        aria-hidden="true"
                    />

                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 26, stiffness: 220 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="vault-prompt-headline"
                        aria-describedby="vault-prompt-benefit"
                        className={`relative w-full sm:max-w-sm bg-[#11111a] border border-[var(--color-mythic)]/40 rounded-t-2xl sm:rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.12)] overflow-hidden ${isRTL ? "rtl" : "ltr"}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-mythic)]/[0.06] to-transparent pointer-events-none" />

                        <button
                            ref={closeRef}
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 sm:right-4 z-10 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            aria-label={t("skip")}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="relative px-6 pt-10 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
                            <div className="mx-auto w-14 h-14 rounded-xl bg-[var(--color-mythic)]/10 border border-[var(--color-mythic)]/30 flex items-center justify-center mb-5">
                                <Lock className="w-6 h-6 text-[var(--color-mythic)]" strokeWidth={1.5} />
                            </div>

                            <h2
                                id="vault-prompt-headline"
                                className="text-xl sm:text-2xl font-extrabold text-white text-center leading-tight"
                                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                            >
                                {t("headline")}
                            </h2>

                            <p
                                id="vault-prompt-benefit"
                                className="mt-3 text-sm text-gray-400 text-center leading-relaxed"
                            >
                                {t("benefit")}
                            </p>

                            <div className="mt-6 space-y-3">
                                <Link
                                    ref={ctaRef}
                                    href="/sign-in"
                                    onClick={handleDismiss}
                                    className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-[var(--color-mythic)] to-[var(--color-mythic-dark)] text-black font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_24px_rgba(255,215,0,0.25)] hover:shadow-[0_0_36px_rgba(255,215,0,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
                                >
                                    {t("cta")}
                                    <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                                </Link>

                                <button
                                    onClick={handleDismiss}
                                    className="w-full py-3 text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-widest"
                                >
                                    {t("skip")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
