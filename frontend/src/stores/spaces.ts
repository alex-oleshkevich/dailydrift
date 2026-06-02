import { create } from "zustand";

export interface Space {
    id: string;
    name: string;
}

interface SpacesState {
    spaces: Space[];
    activeSpaceId: string | null;
    loading: boolean;
    error: string | null;
    load: () => Promise<void>;
    setActiveSpace: (id: string) => void;
}

async function fetchSpaces(): Promise<Space[]> {
    return [
        { id: "personal", name: "Personal" },
        { id: "investerra", name: "Investerra" },
        { id: "research", name: "Research" },
    ];
}

export const useSpacesStore = create<SpacesState>()((set, get) => ({
    spaces: [],
    activeSpaceId: null,
    loading: false,
    error: null,
    load: async () => {
        if (get().loading) {
            return;
        }
        set({ loading: true, error: null });
        try {
            const spaces = await fetchSpaces();
            set((state) => ({
                spaces,
                loading: false,
                activeSpaceId: state.activeSpaceId ?? spaces[0]?.id ?? null,
            }));
        } catch (error) {
            set({
                error:
                    error instanceof Error ? error.message : "Failed to load",
                loading: false,
            });
        }
    },
    setActiveSpace: (id) => {
        set({ activeSpaceId: id });
    },
}));
