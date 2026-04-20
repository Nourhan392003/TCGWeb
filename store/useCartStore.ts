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
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}

type CartPersist = {
    items: CartItem[];
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
            ? (persistedState as { items?: unknown })
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
            }))
        : [];

    if (version < 1) {
        return { items: normalizedItems };
    }

    return { items: normalizedItems };
}

const cartStoreCreator: StateCreator<CartStore, [], [], CartStore> = (set, get) => ({
    items: [],

    addItem: (newItem) => {
        set((state) => {
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (existingItem) {
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
            items: state.items.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            ),
        }));
    },

    clearCart: () => {
        set({ items: [] });
    },

    getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
});

const cartPersistOptions: PersistOptions<CartStore, CartPersist> = {
    name: 'tcg-cart-storage',
    version: 1,
    migrate: (persistedState, version) => migrateCartState(persistedState, version),
};

export const useCartStore = create<CartStore>()(
    persist(cartStoreCreator, cartPersistOptions)
);