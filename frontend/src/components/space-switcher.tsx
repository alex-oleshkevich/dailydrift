import { Check, ChevronsUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { findSpace, type Space, useSpacesStore } from "@/stores/spaces";

export function SpaceSwitcher() {
    const { spaces, activeSpaceId, loading, setActiveSpace } = useSpacesStore(
        useShallow((state) => ({
            spaces: state.spaces,
            activeSpaceId: state.activeSpaceId,
            loading: state.loading,
            setActiveSpace: state.setActiveSpace,
        })),
    );
    const activeSpace = findSpace(spaces, activeSpaceId);
    const label = activeSpace?.name ?? (loading ? "Loading…" : "Select space");

    const activeMark = (space: Space) =>
        space.id === activeSpaceId ? (
            <Check data-icon="inline-end" className="ml-auto" />
        ) : null;

    // Parents with sub-spaces nest into a dropdown submenu and stay selectable
    // via a "(all)" entry; leaves are plain items.
    const renderSpace = (space: Space): ReactNode => {
        if (!space.children || space.children.length === 0) {
            return (
                <DropdownMenuItem
                    key={space.id}
                    onClick={() => setActiveSpace(space.id)}
                >
                    {space.name}
                    {activeMark(space)}
                </DropdownMenuItem>
            );
        }
        return (
            <DropdownMenuSub key={space.id}>
                <DropdownMenuSubTrigger>{space.name}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => setActiveSpace(space.id)}
                        >
                            {space.name} (all)
                            {activeMark(space)}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {space.children.map((child) => renderSpace(child))}
                    </DropdownMenuGroup>
                </DropdownMenuSubContent>
            </DropdownMenuSub>
        );
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={<SidebarMenuButton size="lg" />}
                    >
                        <div className="flex flex-col gap-0.5 text-left leading-none">
                            <span className="font-medium">{label}</span>
                            <span className="text-muted-foreground text-xs">
                                Space
                            </span>
                        </div>
                        <ChevronsUpDown className="ml-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-56">
                        <DropdownMenuGroup>
                            {spaces.map((space) => renderSpace(space))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
