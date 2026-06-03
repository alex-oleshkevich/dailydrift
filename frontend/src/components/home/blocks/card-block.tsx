import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CardBlock({
    image,
    title,
    body,
}: {
    image?: string;
    title: string;
    body: string;
}) {
    return (
        <Card size="sm" className="max-w-md">
            {image ? (
                <img src={image} alt="" className="h-32 w-full object-cover" />
            ) : null}
            <CardHeader>
                <CardTitle className="text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/70 text-sm">
                {body}
            </CardContent>
        </Card>
    );
}
