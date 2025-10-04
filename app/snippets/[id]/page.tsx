"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
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
    updatedAt: string;
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

export default function SnippetPage() {
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const t = useTranslations("snippets.view");

    const fetchSnippet = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/snippets/${params.id}`);
            const data = await response.json();

            if (response.ok) {
                setSnippet(data.snippet);
            } else {
                setError(data.error || "Failed to fetch snippet");
            }
        } catch (error) {
            setError("An error occurred while fetching the snippet");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this snippet?")) {
            return;
        }

        try {
            setDeleting(true);
            const response = await fetch(`/api/snippets/${params.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.push("/snippets");
            } else {
                const data = await response.json();
                setError(data.error || "Failed to delete snippet");
            }
        } catch (error) {
            setError("An error occurred while deleting the snippet");
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchSnippet();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">
                        {t("loadingSnippet")}
                    </p>
                </div>
            </div>
        );
    }

    if (error || !snippet) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {t("snippetNotFound")}
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        {error || t("snippetNotFoundDescription")}
                    </p>
                    <Link href="/snippets">
                        <Button>{t("backToSnippets")}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isAuthor = user && user.id === snippet.author.id;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {snippet.title}
                        </h1>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <span>
                                {t("by")}{" "}
                                <Link
                                    href={`/users/${
                                        snippet.author.username ||
                                        snippet.author.id
                                    }`}
                                    className="hover:underline font-medium"
                                >
                                    {snippet.author.name}
                                </Link>
                            </span>
                            <span>•</span>
                            <span>
                                {new Date(
                                    snippet.createdAt
                                ).toLocaleDateString()}
                            </span>
                            {snippet.updatedAt !== snippet.createdAt && (
                                <>
                                    <span>•</span>
                                    <span>
                                        {t("updated")}{" "}
                                        {new Date(
                                            snippet.updatedAt
                                        ).toLocaleDateString()}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm">
                            {snippet.language}
                        </Badge>
                        {snippet.complexity && (
                            <Badge variant="outline" className="text-sm">
                                {snippet.complexity}
                            </Badge>
                        )}
                    </div>
                </div>

                {snippet.description && (
                    <p className="text-lg text-muted-foreground mb-4">
                        {snippet.description}
                    </p>
                )}

                {snippet.topic && (
                    <p className="text-sm text-muted-foreground mb-4">
                        {t("topic")}:{" "}
                        <span className="font-medium">{snippet.topic}</span>
                    </p>
                )}

                {snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
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

                {isAuthor && (
                    <div className="flex gap-2">
                        <Link href={`/snippets/${snippet.id}/edit`}>
                            <Button variant="outline" size="sm">
                                {t("edit")}
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? t("deleting") : t("delete")}
                        </Button>
                    </div>
                )}
            </div>

            {/* Code */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("code")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted p-6 rounded-md overflow-x-auto">
                        <code className="text-sm">{snippet.code}</code>
                    </pre>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="mt-6 flex gap-4">
                <Button
                    onClick={() => {
                        navigator.clipboard.writeText(snippet.code);
                        // You could add a toast notification here
                    }}
                    variant="outline"
                >
                    {t("copyCode")}
                </Button>
                <Link href="/snippets">
                    <Button variant="outline">{t("backToSnippets")}</Button>
                </Link>
            </div>
        </div>
    );
}
