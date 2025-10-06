"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Check, Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deleteSnippet } from "../lib/actions";
import type { Snippet } from "../types";

interface SnippetActionsProps {
    snippet: Snippet;
}

export function SnippetActions({ snippet }: SnippetActionsProps) {
    const t = useTranslations("snippets");

    const locale = useLocale();

    const [copied, setCopied] = useState(false);

    const { user } = useAuth();

    const isAuthor = user && user.id === snippet.author.id;

    const handleDelete = async () => {
        if (!confirm(t("deleteConfirm"))) {
            return;
        }

        try {
            await deleteSnippet(snippet.id);
        } catch (error) {
            console.error("Failed to delete snippet:", error);
        }
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(snippet.code);
            setCopied(true);
            toast.success("Code copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy code:", error);
            toast.error("Failed to copy code");
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {isAuthor && (
                <>
                    <Link href={`/${locale}/snippets/${snippet.id}/edit`}>
                        <Button variant="outline" size="sm">
                            {t("editButton")}
                        </Button>
                    </Link>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                    >
                        {t("deleteButton")}
                    </Button>
                </>
            )}

            <Button variant="outline" size="sm" onClick={handleCopyCode}>
                {copied ? (
                    <>
                        <Check className="mr-2 h-4 w-4" /> Copied
                    </>
                ) : (
                    <>
                        <Copy className="mr-2 h-4 w-4" /> Copy Code
                    </>
                )}
            </Button>
        </div>
    );
}
