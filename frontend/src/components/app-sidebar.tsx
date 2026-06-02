import {
    Calendar,
    Home,
    type LucideIcon,
    MessageSquare,
    Radar,
    Target,
} from "lucide-react";
import type * as React from "react";
import { useShallow } from "zustand/react/shallow";

import { SpaceSwitcher } from "@/components/space-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useChatsStore } from "@/stores/chats";
import { useFocusStore } from "@/stores/focus";

export interface NavLeaf {
    id: string;
    title: string;
    icon: LucideIcon;
    status?: "warning";
}

interface NavGroup {
    label?: string;
    items: NavLeaf[];
    loading?: boolean;
}

// Static app navigation. Focus and Chats come from their stores (API-backed later).
const mainItems: NavLeaf[] = [
    { id: "home", title: "Home", icon: Home },
    { id: "calendar", title: "Calendar", icon: Calendar },
];

const SKELETON_KEYS = ["a", "b", "c"];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    activeId?: string;
    onOpen: (item: NavLeaf) => void;
}

export function AppSidebar({ activeId, onOpen, ...props }: AppSidebarProps) {
    const focus = useFocusStore(
        useShallow((state) => ({
            items: state.items,
            loading: state.loading,
        })),
    );
    const chats = useChatsStore(
        useShallow((state) => ({
            items: state.items,
            loading: state.loading,
        })),
    );

    const navGroups: NavGroup[] = [
        { items: mainItems },
        {
            label: "Focus",
            loading: focus.loading,
            items: focus.items.map((item) => ({ ...item, icon: Target })),
        },
        {
            label: "Chats",
            loading: chats.loading,
            items: chats.items.map((chat) => ({
                ...chat,
                icon: MessageSquare,
            })),
        },
    ];

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="flex h-8 items-center gap-2 px-2">
                    <Radar className="size-5 shrink-0 text-primary" />
                    <span className="font-semibold text-lg tracking-tight">
                        dailydrift
                    </span>
                </div>
                <SpaceSwitcher />
            </SidebarHeader>
            <SidebarContent>
                {navGroups.map((group, index) => (
                    <SidebarGroup key={group.label ?? `group-${index}`}>
                        {group.label ? (
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        ) : null}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.loading && group.items.length === 0
                                    ? SKELETON_KEYS.map((key) => (
                                          <SidebarMenuItem key={key}>
                                              <SidebarMenuSkeleton showIcon />
                                          </SidebarMenuItem>
                                      ))
                                    : group.items.map((item) => (
                                          <SidebarMenuItem key={item.id}>
                                              <SidebarMenuButton
                                                  isActive={
                                                      item.id === activeId
                                                  }
                                                  tooltip={item.title}
                                                  onClick={() => onOpen(item)}
                                              >
                                                  <item.icon />
                                                  <span>{item.title}</span>
                                              </SidebarMenuButton>
                                              {item.status === "warning" ? (
                                                  <SidebarMenuBadge className="min-w-0 p-0">
                                                      <span className="size-2 rounded-full bg-warning" />
                                                  </SidebarMenuBadge>
                                              ) : null}
                                          </SidebarMenuItem>
                                      ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
