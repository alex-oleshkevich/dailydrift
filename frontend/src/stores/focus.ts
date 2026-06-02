import { createListStore } from "@/stores/create-list-store";

export interface FocusItem {
    id: string;
    title: string;
    status?: "warning";
}

export const useFocusStore = createListStore<FocusItem>(async () => [
    { id: "example-1", title: "Example 1" },
    { id: "example-2", title: "Example 2", status: "warning" },
]);
