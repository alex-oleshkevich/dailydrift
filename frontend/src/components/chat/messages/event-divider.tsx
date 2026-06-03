import { Separator } from "@/components/ui/separator";
import type { EventMessage } from "@/lib/conversation";

export function EventDivider({ message }: { message: EventMessage }) {
    return (
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Separator className="flex-1" />
            {message.label}
            <Separator className="flex-1" />
        </div>
    );
}
