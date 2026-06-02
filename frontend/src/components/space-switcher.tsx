import { ChevronsUpDown } from "lucide-react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useSpacesStore } from "@/stores/spaces";

export function SpaceSwitcher() {
    const { spaces, activeSpaceId, loading, load, setActiveSpace } =
        useSpacesStore(
            useShallow((state) => ({
                spaces: state.spaces,
                activeSpaceId: state.activeSpaceId,
                loading: state.loading,
                load: state.load,
                setActiveSpace: state.setActiveSpace,
            })),
        );
    const activeSpace = spaces.find((space) => space.id === activeSpaceId);
    const label = activeSpace?.name ?? (loading ? "Loading…" : "Select space");

    useEffect(() => {
        load();
    }, [load]);

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
                            {spaces.map((space) => (
                                <DropdownMenuItem
                                    key={space.id}
                                    onClick={() => setActiveSpace(space.id)}
                                >
                                    {space.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
