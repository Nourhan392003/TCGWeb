/**
 * Safely extracts a display string from a localized value.
 * Accepts strings, localized objects { en?, ar? }, or any other value.
 * Never throws and always returns a string.
 *
 * @param value - The value to localize (string | {en: string, ar?: string} | unknown)
 * @param locale - Current locale code ('en' or 'ar')
 * @returns A plain string safe for rendering
 *
 * Fallback order for objects:
 * 1. value[locale] if it's a string
 * 2. value.en if it's a string
 * 3. value.ar if it's a string
 * 4. First string value found in object
 * 5. Empty string
 */
export function getLocalizedText(value: unknown, locale: string): string {
    if (!value) return "";

    // Already a string - return as-is
    if (typeof value === "string") return value;

    // If it's an object with localization keys
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        const loc = locale as "en" | "ar";

        // Try current locale first
        if (typeof obj[loc] === "string" && obj[loc].trim() !== "") {
            return obj[loc];
        }

        // Try English
        if (typeof obj.en === "string" && obj.en.trim() !== "") {
            return obj.en;
        }

        // Try Arabic
        if (typeof obj.ar === "string" && obj.ar.trim() !== "") {
            return obj.ar;
        }

        // Fallback: first string value in the object
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (typeof val === "string" && val.trim() !== "") {
                return val;
            }
        }
    }

    // Anything else (number, boolean, null, undefined, etc.)
    return "";
}

/**
 * Legacy alias for getLocalizedText for backward compatibility.
 * Prefer using getLocalizedText directly.
 */
export function getLocalizedContent(
    content: string | { en: string; ar?: string } | undefined,
    locale: string
): string {
    return getLocalizedText(content, locale);
}

/**
 * Normalize a product name or title for search/filter comparisons.
 * Returns lowercase string suitable for includes(), toLowerCase(), etc.
 */
export function getLocalizedStringForSearch(value: unknown, locale: string): string {
    return getLocalizedText(value, locale).toLowerCase();
}