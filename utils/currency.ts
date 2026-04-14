/**
 * TCG Vault - Currency Utilities
 * تنسيق العملة: الريال السعودي (ر.س)
 */

/**
 * تنسيق السعر بالعملة المحلية (الريال السعودي)
 * يُرجع قيمة مثل: "1,234.56 ر.س"
 */
export function formatPriceSAR(price: number): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    return new Intl.NumberFormat("ar-SA", {
        style: "currency",
        currency: "SAR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
}

/**
 * تنسيق السعر بدون رمز العملة
 * يُرجع قيمة مثل: "1,234.56"
 */
export function formatNumber(price: number): string {
    return new Intl.NumberFormat("ar-SA").format(price);
}

/**
 * shorthand للدالة الرئيسية
 */
export const formatPrice = formatPriceSAR;

/**
 * التحقق من صحة السعر
 */
export function isValidPrice(price: number): boolean {
    return !isNaN(price) && price >= 0 && isFinite(price);
}