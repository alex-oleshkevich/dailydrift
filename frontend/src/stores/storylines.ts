import { createListStore } from "@/stores/create-list-store";

// Active Storylines pinned in the nav. `status: "warning"` flags a Storyline
// whose Momentum is stalled/looping or whose Status is blocked.
export interface StorylineNavItem {
    id: string;
    title: string;
    status?: "warning";
}

export const useStorylinesStore = createListStore<StorylineNavItem>(
    async () => [
        {
            id: "story-framework",
            title: "Framework UI direction",
            status: "warning",
        },
        { id: "story-billing", title: "Q2 billing migration" },
        { id: "story-belov", title: "Belov consensus research" },
    ],
);
