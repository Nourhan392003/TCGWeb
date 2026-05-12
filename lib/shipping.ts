export const DOMESTIC_SHIPPING_FEE = 27;
export function getShippingFee(country?: string) {
    if (!country || country === "SA" || country === "Saudi Arabia" || country === "KSA") {
        return DOMESTIC_SHIPPING_FEE;
    }
    return 27;
}