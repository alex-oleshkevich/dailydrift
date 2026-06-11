import { SpaceSwitcher } from "@/components/space-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

export type View = "overview" | "inbox" | "calendar" | "tasks";

interface AppSidebarProps {
    activeView: View;
    onNavigate: (view: View) => void;
    onOpenSettings: () => void;
}

const NAV_ITEMS: { id: View; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "inbox", label: "Inbox" },
    { id: "calendar", label: "Calendar" },
    { id: "tasks", label: "Tasks" },
];

const DEMO_STORYLINES = [
    { id: "sl-1", label: "Product launch Q3" },
    { id: "sl-2", label: "Infrastructure migration" },
];

const DEMO_CHATS = [
    { id: "ch-1", label: "Daily standup recap" },
    { id: "ch-2", label: "Architecture discussion" },
];

export function AppSidebar({ activeView, onNavigate, onOpenSettings }: AppSidebarProps) {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="px-2 py-1.5">
                    <span className="font-semibold text-lg tracking-tight">dailydrift</span>
                </div>
                <SpaceSwitcher />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAV_ITEMS.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        render={<a href="#" />}
                                        isActive={item.id === activeView}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onNavigate(item.id);
                                        }}
                                    >
                                        {item.label}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Storylines</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {DEMO_STORYLINES.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton render={<a href="#" />}>
                                        {item.label}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Chats</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {DEMO_CHATS.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton render={<a href="#" />}>
                                        {item.label}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="text-muted-foreground">
                            Running tasks (0)
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={onOpenSettings}>
                            Settings
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
