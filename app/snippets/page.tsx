"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface Snippet {
    id: string;
    title: string;
    code: string;
    language: string;
    description?: string;
    topic?: string;
    complexity?: string;
    createdAt: string;
    author: {
        id: string;
        name: string;
        username?: string;
        image?: string;
    };
    tags: Array<{
        tag: {
            id: string;
            name: string;
        };
    }>;
}

interface SnippetsResponse {
    snippets: Snippet[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    error?: string;
}

export default function SnippetsPage() {
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [language, setLanguage] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });

    const t = useTranslations("snippets");

    const fetchSnippets = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });

            if (search) params.append("search", search);
            if (language) params.append("language", language);

            const response = await fetch(`/api/snippets?${params}`);
            const data: SnippetsResponse = await response.json();

            if (response.ok) {
                setSnippets(data.snippets);
                setPagination(data.pagination);
            } else {
                setError(data.error || "Failed to fetch snippets");
            }
        } catch (error) {
            setError("An error occurred while fetching snippets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSnippets();
    }, [page, search, language]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchSnippets();
    };

    const truncateCode = (code: string, maxLength: number = 200) => {
        if (code.length <= maxLength) return code;
        return code.substring(0, maxLength) + "...";
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
                <p className="text-muted-foreground">{t("subtitle")}</p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder={t("searchPlaceholder")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1"
                            />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="px-3 py-2 border border-input bg-background rounded-md"
                            >
                                <option value="">{t("allLanguages")}</option>
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="c">C</option>
                                <option value="csharp">C#</option>
                                <option value="go">Go</option>
                                <option value="rust">Rust</option>
                                <option value="php">PHP</option>
                                <option value="ruby">Ruby</option>
                            </select>
                            <Button type="submit">{t("search")}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Results */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">
                        {t("loadingSnippets")}
                    </p>
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-destructive">{error}</p>
                    <Button onClick={fetchSnippets} className="mt-4">
                        {t("tryAgain")}
                    </Button>
                </div>
            ) : snippets.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        {t("noSnippetsFound")}
                    </p>
                    <Link href="/snippets/new">
                        <Button className="mt-4">{t("createSnippet")}</Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid gap-6">
                        {snippets.map((snippet) => (
                            <Card key={snippet.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">
                                                <Link
                                                    href={`/snippets/${snippet.id}`}
                                                    className="hover:underline"
                                                >
                                                    {snippet.title}
                                                </Link>
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {t("by")}{" "}
                                                <Link
                                                    href={`/users/${
                                                        snippet.author
                                                            .username ||
                                                        snippet.author.id
                                                    }`}
                                                    className="hover:underline"
                                                >
                                                    {snippet.author.name}
                                                </Link>
                                                {" • "}
                                                {new Date(
                                                    snippet.createdAt
                                                ).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary">
                                            {snippet.language}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {snippet.description && (
                                        <p className="text-muted-foreground mb-4">
                                            {snippet.description}
                                        </p>
                                    )}
                                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                                        <code>
                                            {truncateCode(snippet.code)}
                                        </code>
                                    </pre>
                                    {snippet.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {snippet.tags.map((tag) => (
                                                <Link
                                                    key={tag.tag.id}
                                                    href={`/tags/${encodeURIComponent(
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
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                {t("previous")}
                            </Button>
                            <span className="flex items-center px-4">
                                {t("page")} {page} {t("of")} {pagination.pages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={page === pagination.pages}
                            >
                                {t("next")}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
