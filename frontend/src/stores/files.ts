import type { FileTreeRoot } from "@/lib/conversation";
import { MOUNTED_TREES } from "@/lib/conversation";
import { createListStore } from "@/stores/create-list-store";

export type { FileTreeRoot };

export const useFilesStore = createListStore<FileTreeRoot>(
    async () => MOUNTED_TREES,
);
