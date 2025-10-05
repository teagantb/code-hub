import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Tag } from "../types";

interface TagCardProps {
    tag: Tag;
}

export function TagCard({ tag }: TagCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <Link
                        href={`/tags/${encodeURIComponent(tag.name)}`}
                        className="hover:underline"
                    >
                        #{tag.name}
                    </Link>
                    <Badge variant="secondary">
                        {tag._count.snippets}{" "}
                        {tag._count.snippets !== 1 ? "snippets" : "snippet"}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    {tag._count.snippets === 0
                        ? "No snippets yet"
                        : `View ${tag._count.snippets} ${
                              tag._count.snippets !== 1 ? "snippets" : "snippet"
                          } tagged with ${tag.name}`}
                </CardDescription>
            </CardContent>
        </Card>
    );
}
