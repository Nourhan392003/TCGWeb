export const DEFAULT_SHIPPING_FEE = 27;

export function getShippingFee(shippingFeeOverride?: number | null) {
    if (typeof shippingFeeOverride === "number") {
        return Math.max(0, shippingFeeOverride);
    }
    return DEFAULT_SHIPPING_FEE;
}