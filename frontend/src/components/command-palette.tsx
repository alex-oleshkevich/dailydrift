import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command";
import { useCommandPaletteStore } from "@/stores/commands";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const { commands, content } = useCommandPaletteStore(
        useShallow((state) => ({
            commands: state.commands,
            content: state.content,
        })),
    );

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "p") {
                event.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    // Stub: selecting an item just closes the palette for now.
    const handleSelect = () => {
        setOpen(false);
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <Command>
                <CommandInput placeholder="Search content or run a command…" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Content">
                        {content.map((item) => (
                            <CommandItem
                                key={item.id}
                                value={item.title}
                                onSelect={handleSelect}
                            >
                                <span>{item.title}</span>
                                <CommandShortcut>{item.kind}</CommandShortcut>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="Commands">
                        {commands.map((command) => (
                            <CommandItem
                                key={command.id}
                                value={command.title}
                                onSelect={handleSelect}
                            >
                                <command.icon />
                                <span>{command.title}</span>
                                {command.shortcut ? (
                                    <CommandShortcut>
                                        {command.shortcut}
                                    </CommandShortcut>
                                ) : null}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    );
}
