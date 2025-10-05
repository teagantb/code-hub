"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { TagSnippet } from "../types";

interface TagSnippetsListProps {
    snippets: TagSnippet[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export function TagSnippetsList({
    snippets,
    pagination,
}: TagSnippetsListProps) {
    const [currentPage, setCurrentPage] = useState(pagination.page);

    const truncateCode = (code: string, maxLength: number = 200) => {
        if (code.length <= maxLength) return code;
        return code.substring(0, maxLength) + "...";
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        // In a real app, you'd update the URL and refetch data
        // For now, we'll just update the local state
    };

    if (snippets.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">
                    No snippets found for this tag yet.
                </p>
                <Link href="/snippets/new">
                    <Button className="mt-4">Create First Snippet</Button>
                </Link>
            </div>
        );
    }

    return (
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
                                        by{" "}
                                        <Link
                                            href={`/users/${
                                                snippet.author.username ||
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
                                <code>{truncateCode(snippet.code)}</code>
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
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4">
                        Page {currentPage} of {pagination.pages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.pages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </>
    );
}
