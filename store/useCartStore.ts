import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import { api } from '@/convex/_generated/api';
import { getLocalizedText } from '@/utils/localization';

export interface CartItem {
    id: string;
    name?: string;
    price?: number;
    image?: string;
    quantity: number;
    stockQuantity?: number;
    purchaseOptionType?: string;
}

interface CartStore {
    items: CartItem[];
    freeShipping: boolean;
    appliedCoupon: string | null;
    setAppliedCoupon: (code: string | null) => void;
    setFreeShipping: (value: boolean) => void;
    resetFreeShipping: () => void;
    addItem: (item: CartItem) => void;
    removeItem: (id: string, purchaseOptionType?: string) => void;
    updateQuantity: (id: string, quantity: number, purchaseOptionType?: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    validationErrors: string[];
    priceChanges: { productId: string; oldPrice: number; newPrice: number; name?: string }[];
    unavailableItems: { productId: string; reason: string; name?: string }[];
    validatedPrices: Record<string, number>;
    validateCart: (convexClient: { query: <T = any>(q: any, args: any) => Promise<T | null> }) => Promise<void>;
}

type CartPersist = {
    items: Array<{
        id: string;
        quantity: number;
        purchaseOptionType?: string;
        stockQuantity?: number;
    }>;
    freeShipping: boolean;
};

function normalizeStoredName(value: unknown): string {
    if (typeof value === 'string') {
        return value;
    }

    if (value && typeof value === 'object') {
        const obj = value as Record<string, unknown>;

        if (typeof obj.en === 'string' && obj.en.trim() !== '') {
            return obj.en;
        }

        if (typeof obj.ar === 'string' && obj.ar.trim() !== '') {
            return obj.ar;
        }

        for (const key of Object.keys(obj)) {
            const current = obj[key];
            if (typeof current === 'string' && current.trim() !== '') {
                return current;
            }
        }
    }

    return '';
}

function migrateCartState(persistedState: unknown, version: number): CartPersist {
    const state =
        persistedState && typeof persistedState === 'object'
            ? (persistedState as { items?: unknown; freeShipping?: unknown })
            : {};

    const normalizedItems = Array.isArray(state.items)
        ? state.items
            .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
            .map((item) => ({
                id: typeof item.id === 'string' ? item.id : String(item.id ?? ''),
                name: normalizeStoredName(item.name),
                price: typeof item.price === 'number' ? item.price : Number(item.price ?? 0) || 0,
                image: typeof item.image === 'string' ? item.image : '',
                quantity:
                    typeof item.quantity === 'number' && item.quantity > 0
                        ? item.quantity
                        : 1,
                stockQuantity:
                    typeof item.stockQuantity === 'number' ? item.stockQuantity : undefined,
                purchaseOptionType:
                    typeof item.purchaseOptionType === 'string'
                        ? item.purchaseOptionType
                        : undefined,
            }))
        : [];

    const normalizedFreeShipping =
        typeof state.freeShipping === 'boolean' ? state.freeShipping : false;

    if (version < 4) {
        return {
            items: normalizedItems.map(({ id, quantity, purchaseOptionType, stockQuantity }) => ({
                id,
                quantity,
                purchaseOptionType,
                stockQuantity,
            })),
            freeShipping: normalizedFreeShipping,
        };
    }

    return {
        items: normalizedItems.map(({ id, quantity, purchaseOptionType, stockQuantity }) => ({
            id,
            quantity,
            purchaseOptionType,
            stockQuantity,
        })),
        freeShipping: normalizedFreeShipping,
    };
}

const cartStoreCreator: StateCreator<CartStore, [], [], CartStore> = (set, get) => ({
    items: [],
    freeShipping: false,
    appliedCoupon: null,
    validationErrors: [],
    priceChanges: [],
    unavailableItems: [],
    validatedPrices: {},
    setAppliedCoupon: (code) => set({ appliedCoupon: code }),

    setFreeShipping: (value) => {
        set({ freeShipping: value });
    },
    resetFreeShipping: () => {
        set({ freeShipping: false });
    },
    addItem: (newItem) => {
        set((state) => {
            const optionA = (newItem.purchaseOptionType ?? null);
            const existingItem = state.items.find(
                (item) =>
                    item.id === newItem.id &&
                    (item.purchaseOptionType ?? null) === optionA
            );

            if (existingItem) {
                const maxQty = existingItem.stockQuantity ?? Infinity;
                if (existingItem.quantity >= maxQty) return state;

                return {
                    items: state.items.map((item) =>
                        item.id === newItem.id &&
                        (item.purchaseOptionType ?? null) === optionA
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }

            return {
                items: [
                    ...state.items,
                    {
                        ...newItem,
                        quantity: 1,
                    },
                ],
            };
        });
    },

    removeItem: (id, purchaseOptionType) => {
        const optionA = (purchaseOptionType ?? null);
        set((state) => ({
            items: state.items.filter(
                (item) =>
                    !(item.id === id && (item.purchaseOptionType ?? null) === optionA)
            ),
        }));
    },

    updateQuantity: (id, quantity, purchaseOptionType) => {
        const optionA = (purchaseOptionType ?? null);
        set((state) => ({
            items: state.items.map((item) => {
                if (item.id === id && (item.purchaseOptionType ?? null) === optionA) {
                    const maxQty = item.stockQuantity ?? Infinity;
                    return { ...item, quantity: Math.min(Math.max(1, quantity), maxQty) };
                }
                return item;
            }),
        }));
    },

    clearCart: () => {
        set({ items: [], freeShipping: false, validationErrors: [], priceChanges: [], unavailableItems: [], validatedPrices: {} });
    },

    getTotalPrice: () => {
        const { items, validatedPrices } = get();
        return items.reduce((total, item) => {
            const price = validatedPrices[item.id] ?? item.price ?? 0;
            return total + price * item.quantity;
        }, 0);
    },

    validateCart: async (convexClient) => {
        const { items } = get();
        const validationErrors: string[] = [];
        const priceChanges: { productId: string; oldPrice: number; newPrice: number; name?: string }[] = [];
        const unavailableItems: { productId: string; reason: string; name?: string }[] = [];
        const validatedPrices: Record<string, number> = {};
        const updatedItems: CartItem[] = [];

        for (const item of items) {
            try {
                const product = await convexClient.query(api.products.getProductById, {
                    id: item.id as any,
                });

                if (!product) {
                    unavailableItems.push({ productId: item.id, reason: "deleted", name: item.name });
                    validationErrors.push(`Product deleted: ${item.name || item.id}`);
                    updatedItems.push(item);
                    continue;
                }

                const localizedName = getLocalizedText(product.name, "en");
                const productImage = product.imageUrl || product.image || "";

                let effectivePrice: number | undefined;
                let effectiveInStock = product.inStock;
                let effectiveStockQuantity = product.stockQuantity;

                if (item.purchaseOptionType) {
                    const option = product.purchaseOptions?.find(
                        (o: { type: string; price: number; inStock?: boolean; stockQuantity?: number }) => o.type === item.purchaseOptionType
                    );
                    if (!option) {
                        unavailableItems.push({
                            productId: item.id,
                            reason: "option_not_found",
                            name: localizedName,
                        });
                        validationErrors.push(`Purchase option not found: ${localizedName}`);
                        updatedItems.push(item);
                        continue;
                    }
                    effectivePrice = option.price;
                    effectiveInStock = option.inStock ?? product.inStock;
                    effectiveStockQuantity = option.stockQuantity ?? product.stockQuantity;
                } else {
                    effectivePrice = product.price;
                }

                if (!effectiveInStock) {
                    unavailableItems.push({
                        productId: item.id,
                        reason: "out_of_stock",
                        name: localizedName,
                    });
                    validationErrors.push(`Out of stock: ${localizedName}`);
                } else if (
                    effectiveStockQuantity !== undefined &&
                    item.quantity > effectiveStockQuantity
                ) {
                    unavailableItems.push({
                        productId: item.id,
                        reason: "insufficient_stock",
                        name: localizedName,
                    });
                    validationErrors.push(
                        `Insufficient stock for ${localizedName}: requested ${item.quantity}, available ${effectiveStockQuantity}`
                    );
                }

                if (
                    effectivePrice !== undefined &&
                    item.price !== undefined &&
                    effectivePrice !== item.price
                ) {
                    priceChanges.push({
                        productId: item.id,
                        oldPrice: item.price,
                        newPrice: effectivePrice,
                        name: localizedName,
                    });
                }

                if (effectivePrice !== undefined) {
                    validatedPrices[item.id] = effectivePrice;
                }

                updatedItems.push({
                    ...item,
                    name: localizedName || item.name,
                    image: productImage || item.image,
                    price: effectivePrice ?? item.price,
                    stockQuantity: effectiveStockQuantity ?? item.stockQuantity,
                });
            } catch (error) {
                validationErrors.push(`Error validating product: ${item.id}`);
                updatedItems.push(item);
            }
        }

        set({
            validationErrors,
            priceChanges,
            unavailableItems,
            validatedPrices,
            items: updatedItems,
        });
    },
});

const cartPersistOptions: PersistOptions<CartStore, CartPersist> = {
    name: 'tcg-cart-storage',
    version: 4,
    migrate: (persistedState, version) => migrateCartState(persistedState, version),
    partialize: (state) => ({
        items: state.items.map(({ id, quantity, purchaseOptionType, stockQuantity }) => ({
            id,
            quantity,
            purchaseOptionType,
            stockQuantity,
        })),
        freeShipping: state.freeShipping,
    }),
};

export const useCartStore = create<CartStore>()(
    persist(cartStoreCreator, cartPersistOptions)
);
