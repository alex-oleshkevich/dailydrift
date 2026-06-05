import { NARRATIVE_FIELDS, type NarrativeSections } from "@/lib/narrative";

// The Narrative is the System's opening line (REQ-NAR-09): a structured,
// evidence-backed synthesis that reads as a short editorial document — a lead
// paragraph, then a heading + paragraph per section (REQ-NAR-03).
export function NarrativeCard({
    narrative,
    evidenceCount,
}: {
    narrative: NarrativeSections;
    evidenceCount?: number;
}) {
    return (
        <section className="flex max-w-prose flex-col gap-5">
            <p className="text-pretty font-medium text-base leading-relaxed">
                {narrative.state}
            </p>

            {NARRATIVE_FIELDS.slice(1).map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                    <h3 className="font-semibold text-sm leading-none tracking-tight">
                        {field.label}
                    </h3>
                    <p className="text-pretty text-sm leading-relaxed">
                        {narrative[field.key]}
                    </p>
                </div>
            ))}

            {evidenceCount ? (
                <p className="text-foreground/55 text-xs">
                    Backed by {evidenceCount} Evidence{" "}
                    {evidenceCount === 1 ? "item" : "items"}
                </p>
            ) : null}
        </section>
    );
}
