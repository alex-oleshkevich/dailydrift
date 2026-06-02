import { create } from "zustand";

export interface ListState<T> {
    items: T[];
    loading: boolean;
    error: string | null;
    load: () => Promise<void>;
}

// Factory for an async, API-backed list store: empty until load() fetches it.
// Swap the fetcher body for a real API call when the backend lands.
export function createListStore<T>(fetcher: () => Promise<T[]>) {
    return create<ListState<T>>()((set, get) => ({
        items: [],
        loading: false,
        error: null,
        load: async () => {
            if (get().loading) {
                return;
            }
            set({ loading: true, error: null });
            try {
                set({ items: await fetcher(), loading: false });
            } catch (error) {
                set({
                    error:
                        error instanceof Error
                            ? error.message
                            : "Failed to load",
                    loading: false,
                });
            }
        },
    }));
}
