/**
 * TCG Vault - Currency Utilities
 */

/**
 * Formats price based on locale
 * English -> 100.00 SAR
 * Arabic -> ١٠٠.٠٠ ر.س
 */
export function formatPriceByLocale(price: number, locale: string = 'en'): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (locale === 'ar') {
        // Arabic formatting with ر.س
        return new Intl.NumberFormat("ar-SA", {
            style: "currency",
            currency: "SAR",
            currencyDisplay: "symbol",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numPrice);
    }

    // English formatting with SAR
    // Intl.NumberFormat('en-US', {currency: 'SAR'}) often puts SAR at the beginning. 
    // User wants "Price SAR" or similar? Usually localized suffix or prefix.
    // Let's use currencyDisplay: 'code' for English to get "SAR".
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "SAR",
        currencyDisplay: "code",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numPrice).replace('SAR', '').trim() + ' SAR';
}

/**
 * Legacy support or simple formatting
 */
export const formatPrice = (price: number) => formatPriceByLocale(price, 'en');

/**
 * Formats number without currency
 */
export function formatNumber(price: number, locale: string = 'en'): string {
    return new Intl.NumberFormat(locale === 'ar' ? "ar-SA" : "en-US").format(price);
}

/**
 * Validates price
 */
export function isValidPrice(price: number): boolean {
    return !isNaN(price) && price >= 0 && isFinite(price);
}