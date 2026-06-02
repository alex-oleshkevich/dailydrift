import { useState } from "react";

import { AppSidebar, type NavLeaf } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { type TabItem, TabView } from "@/components/tab-view";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface TabState {
    tabs: TabItem[];
    activeId?: string;
}

export default function Layout() {
    const [state, setState] = useState<TabState>({ tabs: [] });

    const openTab = (item: NavLeaf) => {
        setState((prev) => ({
            tabs: prev.tabs.some((tab) => tab.id === item.id)
                ? prev.tabs
                : [...prev.tabs, item],
            activeId: item.id,
        }));
    };

    const closeTab = (id: string) => {
        setState((prev) => {
            const index = prev.tabs.findIndex((tab) => tab.id === id);
            if (index === -1) {
                return prev;
            }
            const tabs = prev.tabs.filter((tab) => tab.id !== id);
            const activeId =
                prev.activeId === id
                    ? (tabs[index] ?? tabs[index - 1])?.id
                    : prev.activeId;
            return { tabs, activeId };
        });
    };

    const setActive = (id: string) => {
        setState((prev) => ({ ...prev, activeId: id }));
    };

    return (
        <SidebarProvider>
            <AppSidebar activeId={state.activeId} onOpen={openTab} />
            <SidebarInset>
                <TabView
                    tabs={state.tabs}
                    activeId={state.activeId}
                    onActiveChange={setActive}
                    onClose={closeTab}
                />
            </SidebarInset>
            <CommandPalette />
        </SidebarProvider>
    );
}
