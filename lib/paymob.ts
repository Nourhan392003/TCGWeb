const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY;
const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY;
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL;

// Support both PAYMOB_PAYMENT_METHODS (comma-separated array) or legacy PAYMOB_INTEGRATION_ID (single number)
const PAYMOB_PAYMENT_METHODS = process.env.PAYMOB_PAYMENT_METHODS
    ? process.env.PAYMOB_PAYMENT_METHODS.split(",").map((id) => Number(id.trim())).filter(Boolean)
    : process.env.PAYMOB_INTEGRATION_ID 
        ? [Number(process.env.PAYMOB_INTEGRATION_ID)] 
        : [];

export interface PaymobItem {
    name: string;
    amount: number;
    description?: string;
    quantity: number;
}

export interface PaymobBillingData {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    apartment?: string;
    floor?: string;
    street: string;
    building?: string;
    shipping_method?: string;
    postal_code?: string;
    city: string;
    country: string;
    state?: string;
}

export interface CreateIntentionPayload {
    amount: number;
    currency: string;
    items: PaymobItem[];
    billing_data: PaymobBillingData;
    special_reference: string;
    extras?: Record<string, unknown>;
}

export interface PaymobIntentionResponse {
    id: string;
    client_secret: string;
    status: string;
}

export async function createPaymobIntention(
    payload: CreateIntentionPayload
): Promise<PaymobIntentionResponse> {
    if (!PAYMOB_SECRET_KEY) throw new Error("Missing PAYMOB_SECRET_KEY in environment variables");
    if (!PAYMOB_BASE_URL) throw new Error("Missing PAYMOB_BASE_URL in environment variables");
    if (PAYMOB_PAYMENT_METHODS.length === 0) throw new Error("Missing PAYMOB_PAYMENT_METHODS in environment variables");

    const url = `${PAYMOB_BASE_URL}/v1/intention/`;
    let response;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${PAYMOB_SECRET_KEY}`,
            },
            body: JSON.stringify({
                amount: payload.amount,
                currency: payload.currency,
                payment_methods: PAYMOB_PAYMENT_METHODS,
                items: payload.items,
                billing_data: payload.billing_data,
                special_reference: payload.special_reference,
                extras: payload.extras || {},
            }),
            cache: "no-store",
        });
    } catch (fetchError: any) {
        console.error("Paymob Fetch Connection Details:", {
            url,
            message: fetchError.message,
            cause: fetchError.cause,
            stack: fetchError.stack
        });
        throw new Error(`Paymob fetch failed: ${fetchError.message} | cause: ${String(fetchError.cause)}`);
    }

    const text = await response.text();

    let data: any = null;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(`Paymob returned non-JSON response: ${text.slice(0, 200)}`);
    }

    if (!response.ok) {
        console.error("Paymob create intention error:", data);
        throw new Error(
            data?.detail || data?.message || data?.error || "Failed to create Paymob intention"
        );
    }

    return data;
}

export function getPaymobCheckoutUrl(clientSecret: string) {
    if (!PAYMOB_PUBLIC_KEY) throw new Error("Missing PAYMOB_PUBLIC_KEY in environment variables");
    return `https://accept.paymob.com/unifiedcheckout/?publicKey=${encodeURIComponent(
        PAYMOB_PUBLIC_KEY!
    )}&clientSecret=${encodeURIComponent(clientSecret)}`;
}