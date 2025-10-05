"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { updateSnippet } from "../lib/actions";
import type { Snippet, UpdateSnippetData } from "../types";
import { useTranslations, useLocale } from "next-intl";

const LANGUAGES = [
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "c",
    "csharp",
    "go",
    "rust",
    "php",
    "ruby",
    "swift",
    "kotlin",
    "scala",
    "r",
    "matlab",
    "sql",
    "html",
    "css",
    "scss",
    "sass",
    "less",
    "json",
    "xml",
    "yaml",
    "markdown",
    "bash",
    "shell",
    "powershell",
    "dockerfile",
    "other",
];

interface EditSnippetFormProps {
    snippet: Snippet;
}

export function EditSnippetForm({ snippet }: EditSnippetFormProps) {
    const [formData, setFormData] = useState<UpdateSnippetData>({
        id: snippet.id,
        title: snippet.title,
        code: snippet.code,
        language: snippet.language,
        description: snippet.description || "",
        topic: snippet.topic || "",
        tags: snippet.tags.map((t) => t.tag.name),
    });
    const [tagsInput, setTagsInput] = useState(
        snippet.tags.map((t) => t.tag.name).join(", ")
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const t = useTranslations("snippets");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const tags = tagsInput
                ? tagsInput
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                : [];

            await updateSnippet({
                ...formData,
                tags,
            });
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update snippet"
            );
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {t("editSnippet")}
                    </CardTitle>
                    <CardDescription>Update your code snippet</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    {t("snippetTitle")} *
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    required
                                    placeholder="Enter snippet title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="language">
                                    {t("language")} *
                                </Label>
                                <select
                                    id="language"
                                    value={formData.language}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            language: e.target.value,
                                        })
                                    }
                                    required
                                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                                >
                                    <option value="">Select a language</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang.charAt(0).toUpperCase() +
                                                lang.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Describe what this snippet does"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">Topic</Label>
                                <Input
                                    id="topic"
                                    value={formData.topic}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            topic: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., algorithms, web development"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    value={tagsInput}
                                    onChange={(e) =>
                                        setTagsInput(e.target.value)
                                    }
                                    placeholder="comma-separated tags"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Code *</Label>
                            <Textarea
                                id="code"
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        code: e.target.value,
                                    })
                                }
                                required
                                placeholder="Paste your code here"
                                rows={15}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? tCommon("loading") : tCommon("save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.push(`/snippets/${snippet.id}`)
                                }
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
