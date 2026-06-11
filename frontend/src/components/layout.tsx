import { useState } from "react";
import { AppSidebar, type View } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { MainHeader } from "@/components/main-header";
import { SettingsDialog } from "@/components/settings-dialog";
import { CalendarView } from "@/components/views/calendar";
import { HomeView } from "@/components/views/home";
import { InboxView } from "@/components/views/inbox";
import { TasksView } from "@/components/views/tasks";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

function ActiveView({ view }: { view: View }) {
    switch (view) {
        case "overview":
            return <HomeView />;
        case "inbox":
            return <InboxView />;
        case "calendar":
            return <CalendarView />;
        case "tasks":
            return <TasksView />;
    }
}

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
                <MainHeader />
                <div className="flex flex-1 flex-col overflow-hidden p-6">
                    <ActiveView view={view} />
                </div>
            </SidebarInset>
            <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
            <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
            <Toaster />
        </SidebarProvider>
    );
}
