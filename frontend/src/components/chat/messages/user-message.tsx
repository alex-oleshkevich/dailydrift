import { chatBubbleVariants, FileChip } from "@/components/chat/messages/parts";
import type { UserMessage as UserMessageData } from "@/lib/conversation";
import { cn } from "@/lib/utils";

export function UserMessage({ message }: { message: UserMessageData }) {
    return (
        <div className="flex flex-col items-end gap-1.5">
            <div className={cn(chatBubbleVariants({ isUser: true }))}>
                {message.body}
            </div>
            {message.attachments?.map((file) => (
                <FileChip key={file.id} file={file} />
            ))}
            <span className="px-1 text-muted-foreground text-xs">
                {message.time}
            </span>
        </div>
    );
}
