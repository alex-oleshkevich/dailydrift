import {
    Activity,
    ArrowRight,
    CircleHelp,
    Compass,
    ScrollText,
    TriangleAlert,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { NarrativeSections } from "@/lib/narrative";

// The four "where does it stand" facets (REQ-NAR-03). `nextStep` is given its
// own emphasis below; `state` is the lead synthesis in the header.
const FACETS = [
    { key: "direction", label: "Direction", icon: Compass },
    { key: "momentum", label: "Momentum", icon: Activity },
    { key: "friction", label: "Friction", icon: TriangleAlert },
    { key: "openQuestions", label: "Open questions", icon: CircleHelp },
] as const;

// The Narrative is the System's opening line (REQ-NAR-09): a structured,
// evidence-backed synthesis, not a list of events.
export function NarrativeCard({
    narrative,
    evidenceCount,
}: {
    narrative: NarrativeSections;
    evidenceCount?: number;
}) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    <ScrollText className="size-3.5" />
                    Narrative
                </div>
                <CardTitle className="text-pretty text-base leading-relaxed">
                    {narrative.state}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    {FACETS.map((facet) => (
                        <div key={facet.key} className="flex gap-2.5">
                            <facet.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="flex flex-col gap-0.5">
                                <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                                    {facet.label}
                                </dt>
                                <dd className="text-pretty text-sm leading-relaxed">
                                    {narrative[facet.key]}
                                </dd>
                            </div>
                        </div>
                    ))}
                </dl>
                <Separator />
                <div className="flex gap-2.5">
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="flex flex-col gap-0.5">
                        <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                            Next step
                        </dt>
                        <dd className="text-pretty font-medium text-sm leading-relaxed">
                            {narrative.nextStep}
                        </dd>
                    </div>
                </div>
            </CardContent>
            {evidenceCount ? (
                <CardFooter className="text-muted-foreground text-xs">
                    Backed by {evidenceCount} Evidence{" "}
                    {evidenceCount === 1 ? "item" : "items"}
                </CardFooter>
            ) : null}
        </Card>
    );
}
