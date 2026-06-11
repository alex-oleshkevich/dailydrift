import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const SPACES = ["Personal", "Work", "Research"];

export function SpaceSwitcher() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={<SidebarMenuButton size="lg" />}
                    >
                        <div className="flex flex-col gap-0.5 text-left leading-none">
                            <span className="font-medium">Personal</span>
                            <span className="text-muted-foreground text-xs">
                                Space
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-48">
                        {SPACES.map((space) => (
                            <DropdownMenuItem key={space}>
                                {space}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
