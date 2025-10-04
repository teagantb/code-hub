"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface User {
    id: string;
    name: string;
    username?: string;
    image?: string;
    bio?: string;
    createdAt: string;
    stats: {
        totalSnippets: number;
        languages: Array<{
            language: string;
            _count: { language: number };
        }>;
        tags: Array<{
            tag: { id: string; name: string };
            count: number;
        }>;
    };
}

interface Snippet {
    id: string;
    title: string;
    code: string;
    language: string;
    description?: string;
    topic?: string;
    complexity?: string;
    createdAt: string;
    tags: Array<{
        tag: {
            id: string;
            name: string;
        };
    }>;
}

interface UserSnippetsResponse {
    snippets: Snippet[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export default function UserProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);
    const [snippetsLoading, setSnippetsLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [language, setLanguage] = useState("");
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });

    const t = useTranslations("users.profile");

    const params = useParams();
    const userId = params.id as string;

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/users/${userId}`);
            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
            } else {
                setError(data.error || "Failed to fetch user profile");
            }
        } catch (error) {
            setError("An error occurred while fetching user profile");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserSnippets = async () => {
        try {
            setSnippetsLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });

            if (language) params.append("language", language);
            if (search) params.append("search", search);

            const response = await fetch(
                `/api/users/${userId}/snippets?${params}`
            );
            const data: UserSnippetsResponse = await response.json();

            if (response.ok) {
                setSnippets(data.snippets);
                setPagination(data.pagination);
            } else {
                setError(data.error || "Failed to fetch user snippets");
            }
        } catch (error) {
            setError("An error occurred while fetching user snippets");
        } finally {
            setSnippetsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [userId]);

    useEffect(() => {
        if (user) {
            fetchUserSnippets();
        }
    }, [userId, page, language, search]);

    const truncateCode = (code: string, maxLength: number = 200) => {
        if (code.length <= maxLength) return code;
        return code.substring(0, maxLength) + "...";
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">
                        {t("loadingProfile")}
                    </p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {t("userNotFound")}
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        {error || t("userNotFoundDescription")}
                    </p>
                    <Link href="/snippets">
                        <Button>{t("browseSnippets")}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Profile Header */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-2xl font-bold">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">
                                {user.name}
                            </h1>
                            {user.username && (
                                <p className="text-muted-foreground mb-2">
                                    @{user.username}
                                </p>
                            )}
                            {user.bio && (
                                <p className="text-muted-foreground mb-4">
                                    {user.bio}
                                </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>
                                    {t("joined")}{" "}
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span>
                                    {user.stats.totalSnippets}{" "}
                                    {user.stats.totalSnippets !== 1
                                        ? t("snippets")
                                        : t("snippet")}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Languages */}
                    {user.stats.languages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {t("languages")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {user.stats.languages.map((lang) => (
                                        <div
                                            key={lang.language}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="capitalize">
                                                {lang.language}
                                            </span>
                                            <Badge variant="secondary">
                                                {lang._count.language}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Popular Tags */}
                    {user.stats.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {t("popularTags")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {user.stats.tags
                                        .slice(0, 10)
                                        .map((tagStat) => (
                                            <Link
                                                key={tagStat.tag.id}
                                                href={`/tags/${encodeURIComponent(
                                                    tagStat.tag.name
                                                )}`}
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                                                >
                                                    {tagStat.tag.name} (
                                                    {tagStat.count})
                                                </Badge>
                                            </Link>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Search and Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <Input
                                    placeholder={t("searchPlaceholder")}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <select
                                    value={language}
                                    onChange={(e) =>
                                        setLanguage(e.target.value)
                                    }
                                    className="px-3 py-2 border border-input bg-background rounded-md"
                                >
                                    <option value="">
                                        {t("allLanguages")}
                                    </option>
                                    <option value="javascript">
                                        JavaScript
                                    </option>
                                    <option value="typescript">
                                        TypeScript
                                    </option>
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Snippets */}
                    {snippetsLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-2 text-muted-foreground">
                                {t("loadingSnippets")}
                            </p>
                        </div>
                    ) : snippets.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">
                                {user.stats.totalSnippets === 0
                                    ? t("noSnippetsShared")
                                    : t("noSnippetsMatch")}
                            </p>
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
                                        Previous
                                    </Button>
                                    <span className="flex items-center px-4">
                                        Page {page} of {pagination.pages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === pagination.pages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
