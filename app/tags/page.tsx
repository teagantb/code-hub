"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface Tag {
    id: string;
    name: string;
    _count: {
        snippets: number;
    };
}

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const t = useTranslations("tags");

    const fetchTags = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append("search", search);

            const response = await fetch(`/api/tags?${params}`);
            const data = await response.json();

            if (response.ok) {
                setTags(data.tags);
            } else {
                setError(data.error || "Failed to fetch tags");
            }
        } catch (error) {
            setError("An error occurred while fetching tags");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, [search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTags();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
                <p className="text-muted-foreground">{t("subtitle")}</p>
            </div>

            {/* Search */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <Input
                            placeholder={t("searchPlaceholder")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-md"
                        />
                    </form>
                </CardContent>
            </Card>

            {/* Results */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">{t("loading")}</p>
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-destructive">{error}</p>
                </div>
            ) : tags.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        {search ? t("noTagsFound") : t("noTagsAvailable")}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tags.map((tag) => (
                        <Card
                            key={tag.id}
                            className="hover:shadow-md transition-shadow"
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <Link
                                        href={`/tags/${encodeURIComponent(
                                            tag.name
                                        )}`}
                                        className="hover:underline"
                                    >
                                        #{tag.name}
                                    </Link>
                                    <Badge variant="secondary">
                                        {tag._count.snippets}{" "}
                                        {tag._count.snippets !== 1
                                            ? t("snippetsPlural")
                                            : t("snippets")}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    {tag._count.snippets === 0
                                        ? t("noSnippetsYet")
                                        : t("viewSnippets", {
                                              count: tag._count.snippets,
                                              snippet:
                                                  tag._count.snippets !== 1
                                                      ? t("snippetsPlural")
                                                      : t("snippets"),
                                              tag: tag.name,
                                          })}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
