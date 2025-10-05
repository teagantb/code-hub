"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { deleteSnippet } from "../lib/actions";
import type { Snippet } from "../types";

interface SnippetActionsProps {
    snippet: Snippet;
}

export function SnippetActions({ snippet }: SnippetActionsProps) {
    const { user } = useAuth();
    const isAuthor = user && user.id === snippet.author.id;

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this snippet?")) {
            return;
        }

        try {
            await deleteSnippet(snippet.id);
        } catch (error) {
            console.error("Failed to delete snippet:", error);
            // You could add a toast notification here
        }
    };

    if (!isAuthor) return null;

    return (
        <div className="flex gap-2">
            <Link href={`/snippets/${snippet.id}/edit`}>
                <Button variant="outline" size="sm">
                    Edit
                </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
                Delete
            </Button>
        </div>
    );
}
