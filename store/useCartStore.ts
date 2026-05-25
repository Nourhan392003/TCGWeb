import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    rarity: string;
    stockQuantity?: number;
}

interface CartStore {
    items: CartItem[];
    freeShipping: boolean;
    setFreeShipping: (value: boolean) => void;
    resetFreeShipping: () => void;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}

type CartPersist = {
    items: CartItem[];
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
                rarity: typeof item.rarity === 'string' ? item.rarity : '',
                stockQuantity:
                    typeof item.stockQuantity === 'number' ? item.stockQuantity : undefined,
            }))
        : [];

    const normalizedFreeShipping =
        typeof state.freeShipping === 'boolean' ? state.freeShipping : false;

    if (version < 2) {
        return {
            items: normalizedItems,
            freeShipping: normalizedFreeShipping,
        };
    }

    return {
        items: normalizedItems,
        freeShipping: normalizedFreeShipping,
    };
}

const cartStoreCreator: StateCreator<CartStore, [], [], CartStore> = (set, get) => ({
    items: [],
    freeShipping: false,

    setFreeShipping: (value) => {
        set({ freeShipping: value });
    },
    resetFreeShipping: () => {
        set({ freeShipping: false });
    },
    addItem: (newItem) => {
        set((state) => {
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (existingItem) {
                const maxQty = existingItem.stockQuantity ?? Infinity;
                if (existingItem.quantity >= maxQty) return state;

                return {
                    items: state.items.map((item) =>
                        item.id === newItem.id
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
                        name: normalizeStoredName(newItem.name),
                        quantity: 1,
                    },
                ],
            };
        });
    },

    removeItem: (id) => {
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        }));
    },

    updateQuantity: (id, quantity) => {
        set((state) => ({
            items: state.items.map((item) => {
                if (item.id === id) {
                    const maxQty = item.stockQuantity ?? Infinity;
                    return { ...item, quantity: Math.min(Math.max(1, quantity), maxQty) };
                }
                return item;
            }),
        }));
    },

    clearCart: () => {
        set({ items: [], freeShipping: false });
    },

    getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
});

const cartPersistOptions: PersistOptions<CartStore, CartPersist> = {
    name: 'tcg-cart-storage',
    version: 2,
    migrate: (persistedState, version) => migrateCartState(persistedState, version),
    partialize: (state) => ({
        items: state.items,
        freeShipping: state.freeShipping,
    }),
};

export const useCartStore = create<CartStore>()(
    persist(cartStoreCreator, cartPersistOptions)
);