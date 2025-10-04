"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

interface TagData {
    tag: {
        id: string;
        name: string;
    };
    snippets: Snippet[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export default function TagPage() {
    const [data, setData] = useState<TagData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);

    const params = useParams();
    const tagName = decodeURIComponent(params.name as string);

    const fetchTagSnippets = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/tags/${encodeURIComponent(tagName)}?page=${page}&limit=10`
            );
            const data = await response.json();

            if (response.ok) {
                setData(data);
            } else {
                setError(data.error || "Failed to fetch tag data");
            }
        } catch (error) {
            setError("An error occurred while fetching tag data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTagSnippets();
    }, [tagName, page]);

    const truncateCode = (code: string, maxLength: number = 200) => {
        if (code.length <= maxLength) return code;
        return code.substring(0, maxLength) + "...";
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Tag Not Found</h1>
                    <p className="text-muted-foreground mb-4">
                        {error || "The tag you're looking for doesn't exist."}
                    </p>
                    <Link href="/tags">
                        <Button>Browse All Tags</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/tags">
                        <Button variant="outline" size="sm">
                            ← All Tags
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">#{data.tag.name}</h1>
                        <p className="text-muted-foreground">
                            {data.pagination.total} snippet
                            {data.pagination.total !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>
            </div>

            {/* Snippets */}
            {data.snippets.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        No snippets found for this tag yet.
                    </p>
                    <Link href="/snippets/new">
                        <Button className="mt-4">Create First Snippet</Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid gap-6">
                        {data.snippets.map((snippet) => (
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
                                                by{" "}
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
                    {data.pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4">
                                Page {page} of {data.pagination.pages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={page === data.pagination.pages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
