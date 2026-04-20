import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    rarity?: string;
}

interface WishlistStore {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

const normalizeStoredName = (value: unknown): string => {
    if (typeof value === 'string') return value;

    if (value && typeof value === 'object') {
        const localized = value as { en?: unknown; ar?: unknown };
        if (typeof localized.en === 'string' && localized.en.trim()) return localized.en;
        if (typeof localized.ar === 'string' && localized.ar.trim()) return localized.ar;
    }

    return '';
};

type PersistedWishlistItem = Omit<WishlistItem, 'name'> & {
    name?: unknown;
};

type PersistedWishlistState = {
    items?: PersistedWishlistItem[];
};

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === item.id);

                if (!existingItem) {
                    set({
                        items: [
                            ...currentItems,
                            {
                                ...item,
                                name: normalizeStoredName(item.name),
                            },
                        ],
                    });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },

            isInWishlist: (id) => {
                return get().items.some((item) => item.id === id);
            },

            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'wishlist-storage',
            version: 1,
            migrate: (persistedState, version): WishlistStore | PersistedWishlistState => {
                const state = (persistedState ?? {}) as PersistedWishlistState;

                return {
                    items: Array.isArray(state.items)
                        ? state.items.map((item) => ({
                            ...item,
                            name: normalizeStoredName(item?.name),
                        }))
                        : [],
                };
            },
        }
    )
);