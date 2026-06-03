import { InsightCard } from "@/components/chat/messages/insight-card";
import { SituationCard } from "@/components/chat/messages/situation-card";
import { CardBlock } from "@/components/home/blocks/card-block";
import { ChartBlock } from "@/components/home/blocks/chart-block";
import { MessageRow } from "@/components/home/blocks/message-row";
import { StatTile } from "@/components/home/blocks/stat-tile";
import { TextBlock } from "@/components/home/blocks/text-block";
import type { HomeBlock as HomeBlockData } from "@/lib/home";

export function HomeBlock({
    block,
    onResolveSituation,
}: {
    block: HomeBlockData;
    onResolveSituation: (id: string, action: string) => void;
}) {
    switch (block.kind) {
        case "text":
            return <TextBlock body={block.body} />;
        case "stat":
            return (
                <StatTile
                    label={block.label}
                    value={block.value}
                    trend={block.trend}
                />
            );
        case "card":
            return (
                <CardBlock
                    image={block.image}
                    title={block.title}
                    body={block.body}
                />
            );
        case "message":
            return <MessageRow agentId={block.agentId} body={block.body} />;
        case "situation":
            return (
                <SituationCard
                    message={block.situation}
                    onResolve={onResolveSituation}
                />
            );
        case "insight":
            return <InsightCard message={block.insight} />;
        case "bar-chart":
            return (
                <ChartBlock
                    variant="bar"
                    title={block.title}
                    data={block.data}
                />
            );
        case "line-chart":
            return (
                <ChartBlock
                    variant="line"
                    title={block.title}
                    data={block.data}
                />
            );
        case "pie-chart":
            return (
                <ChartBlock
                    variant="pie"
                    title={block.title}
                    data={block.data}
                />
            );
        default:
            return null;
    }
}
