import { create } from "zustand";

export interface Space {
    id: string;
    name: string;
    children?: Space[];
}

// Depth-first lookup across the (possibly nested) space tree.
export function findSpace(
    spaces: Space[],
    id: string | null,
): Space | undefined {
    if (id === null) {
        return undefined;
    }
    for (const space of spaces) {
        if (space.id === id) {
            return space;
        }
        const nested = space.children && findSpace(space.children, id);
        if (nested) {
            return nested;
        }
    }
    return undefined;
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
        {
            id: "investerra",
            name: "Investerra",
            children: [
                { id: "investerra-fund-i", name: "Fund I" },
                { id: "investerra-ops", name: "Ops" },
            ],
        },
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
