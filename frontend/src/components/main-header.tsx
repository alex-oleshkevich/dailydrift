import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

interface MainHeaderProps {
    onOpenCommand: () => void;
}

export function MainHeader({ onOpenCommand }: MainHeaderProps) {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="shrink-0 px-2"
            >
                &#9776;
            </Button>

            <button
                type="button"
                className="flex-1 rounded-md border bg-muted/50 px-3 py-1.5 text-left text-muted-foreground text-sm transition-colors hover:bg-muted/80"
                onClick={onOpenCommand}
            >
                Search&hellip;
                <span className="float-right text-xs opacity-50">⌘K</span>
            </button>

            <DropdownMenu>
                <DropdownMenuTrigger render={<Button size="sm" />}>
                    New ▾
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>New chat</DropdownMenuItem>
                    <DropdownMenuItem>New storyline</DropdownMenuItem>
                    <DropdownMenuItem>New task</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
