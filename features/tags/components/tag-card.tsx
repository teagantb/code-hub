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
import { useTranslations, useLocale } from "next-intl";

interface TagCardProps {
    tag: Tag;
}

export function TagCard({ tag }: TagCardProps) {
    const t = useTranslations("snippets");
    const locale = useLocale();

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <Link
                        href={`/${locale}/tags/${encodeURIComponent(tag.name)}`}
                        className="hover:underline"
                    >
                        #{tag.name}
                    </Link>
                    <Badge variant="secondary">
                        {tag._count.snippets}{" "}
                        {tag._count.snippets !== 1
                            ? t("snippetCountPlural")
                            : t("snippetCount")}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    {tag._count.snippets === 0
                        ? t("noSnippetsYet")
                        : t("viewSnippetsTagged", {
                              count: tag._count.snippets,
                              snippetText:
                                  tag._count.snippets !== 1
                                      ? t("snippetCountPlural")
                                      : t("snippetCount"),
                              tagName: tag.name,
                          })}
                </CardDescription>
            </CardContent>
        </Card>
    );
}
