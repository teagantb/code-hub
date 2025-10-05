import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Snippet } from "../types";
import { CodeViewer } from "@/components/CodeViewer";
import { useTranslations, useLocale } from "next-intl";

interface SnippetCardProps {
    snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
    const t = useTranslations("snippets");
    const locale = useLocale();

    const truncateCode = (code: string, maxLength: number = 1000) => {
        if (code.length <= maxLength) return code;
        return code.substring(0, maxLength) + "...";
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">
                            <Link
                                href={`/${locale}/snippets/${snippet.id}`}
                                className="hover:underline"
                            >
                                {snippet.title}
                            </Link>
                        </CardTitle>
                        <CardDescription className="mt-1">
                            {t("byAuthor")}{" "}
                            <Link
                                href={`/${locale}/users/${
                                    snippet.author.username || snippet.author.id
                                }`}
                                className="hover:underline"
                            >
                                {snippet.author.name}
                            </Link>
                            {" • "}
                            {new Date(snippet.createdAt).toLocaleDateString()}
                        </CardDescription>
                    </div>
                    <Badge variant="secondary">{snippet.language}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                {snippet.description && (
                    <p className="text-muted-foreground mb-4">
                        {snippet.description}
                    </p>
                )}
                <div className="bg-muted p-0 rounded-md overflow-hidden text-sm">
                    <CodeViewer
                        code={truncateCode(snippet.code)}
                        language={snippet.language}
                    />
                </div>
                {snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {snippet.tags.map((tag) => (
                            <Link
                                key={tag.tag.id}
                                href={`/${locale}/tags/${encodeURIComponent(
                                    tag.tag.name
                                )}`}
                            >
                                <Badge
                                    variant="outline"
                                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                                >
                                    {tag.tag.name}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
