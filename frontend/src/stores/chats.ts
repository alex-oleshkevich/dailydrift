import { createListStore } from "@/stores/create-list-store";

export interface Chat {
    id: string;
    title: string;
}

export const useChatsStore = createListStore<Chat>(async () => [
    { id: "chat-1", title: "Chat 1" },
    { id: "chat-2", title: "Chat 2" },
    { id: "chat-3", title: "Chat 3" },
]);
