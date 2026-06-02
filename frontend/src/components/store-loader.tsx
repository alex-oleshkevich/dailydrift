import { type ReactNode, useEffect } from "react";

import { useChatsStore } from "@/stores/chats";
import { useFocusStore } from "@/stores/focus";
import { useSpacesStore } from "@/stores/spaces";

// Loads all API-backed stores once at app startup. Local app — no need to
// lazy-load per component. Add new stores' load() here as they appear.
export function StoreLoader({ children }: { children: ReactNode }) {
    useEffect(() => {
        useSpacesStore.getState().load();
        useFocusStore.getState().load();
        useChatsStore.getState().load();
    }, []);

    return <>{children}</>;
}
