import { ChevronRight, File as FileIcon, Folder } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { FileNode, FileTreeRoot } from "@/lib/conversation";

function TreeNode({ node }: { node: FileNode }) {
    if (!node.children) {
        return (
            <SidebarMenuSubItem>
                <SidebarMenuSubButton render={<button type="button" />}>
                    <FileIcon />
                    <span>{node.name}</span>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        );
    }
    return (
        <SidebarMenuSubItem>
            <Collapsible>
                <CollapsibleTrigger
                    render={<SidebarMenuSubButton className="group/node" />}
                >
                    <ChevronRight className="size-3.5 transition-transform group-data-[panel-open]/node:rotate-90" />
                    <Folder />
                    <span>{node.name}</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {node.children.map((child) => (
                            <TreeNode key={child.name} node={child} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuSubItem>
    );
}

export function FileTreeNav({ trees }: { trees: FileTreeRoot[] }) {
    return (
        <SidebarMenu>
            {trees.map((tree) => (
                <SidebarMenuItem key={tree.id}>
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger
                            render={
                                <SidebarMenuButton className="group/root" />
                            }
                        >
                            <ChevronRight className="size-3.5 transition-transform group-data-[panel-open]/root:rotate-90" />
                            <Folder />
                            <span className="truncate">{tree.label}</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {tree.nodes.map((node) => (
                                    <TreeNode key={node.name} node={node} />
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
