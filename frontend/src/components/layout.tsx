import { useState } from "react";
import { AppSidebar, type View } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { MainHeader } from "@/components/main-header";
import { SettingsDialog } from "@/components/settings-dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { HomeView } from "@/components/views/home";

export default function Layout() {
    const [view, setView] = useState<View>("overview");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);

    return (
        <SidebarProvider>
            <AppSidebar
                activeView={view}
                onNavigate={setView}
                onOpenSettings={() => setSettingsOpen(true)}
            />
            <SidebarInset>
                <MainHeader onOpenCommand={() => setCommandOpen(true)} />
                <div className="flex flex-1 flex-col overflow-hidden p-6">
                    <HomeView />
                </div>
            </SidebarInset>
            <SettingsDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
            />
            <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
            <Toaster />
        </SidebarProvider>
    );
}
