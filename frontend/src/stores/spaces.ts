import { create } from "zustand";

export interface Space {
    id: string;
    name: string;
}

interface SpacesState {
    spaces: Space[];
    activeSpaceId: string;
    setActiveSpace: (id: string) => void;
}

const defaultSpaces: Space[] = [
    { id: "personal", name: "Personal" },
    { id: "investerra", name: "Investerra" },
    { id: "research", name: "Research" },
];

export const useSpacesStore = create<SpacesState>((set) => ({
    spaces: defaultSpaces,
    activeSpaceId: defaultSpaces[0].id,
    setActiveSpace: (id) => {
        set({ activeSpaceId: id });
    },
}));
