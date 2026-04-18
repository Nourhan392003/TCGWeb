/**
 * Utility to get localized content from a multilingual object with fallback to English
 */
export function getLocalizedContent(
    content: string | { en: string; ar?: string } | undefined,
    locale: string
): string {
    if (!content) return "";
    if (typeof content === "string") return content;
    return content[locale as "en" | "ar"] || content.en || "";
}
