import { type ReactNode, useEffect } from "react";

import { useChatsStore } from "@/stores/chats";
import { useFilesStore } from "@/stores/files";
import { useSpacesStore } from "@/stores/spaces";
import { useStorylinesStore } from "@/stores/storylines";

// Loads all API-backed stores once at app startup. Local app — no need to
// lazy-load per component. Add new stores' load() here as they appear.
export function StoreLoader({ children }: { children: ReactNode }) {
    useEffect(() => {
        useSpacesStore.getState().load();
        useStorylinesStore.getState().load();
        useChatsStore.getState().load();
        useFilesStore.getState().load();
    }, []);

    return <>{children}</>;
}
