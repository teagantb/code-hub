"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { useAuth } from "@/contexts/AuthContext";
import { createSnippet } from "../lib/actions";
import type { CreateSnippetData } from "../types";
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

export function CreateSnippetForm() {
    const [formData, setFormData] = useState<CreateSnippetData>({
        title: "",
        code: "",
        language: "",
        description: "",
        topic: "",
        tags: [],
    });
    const [tagsInput, setTagsInput] = useState("");
    const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const t = useTranslations("snippets");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    const fetchTagSuggestions = async (query: string) => {
        if (query.length < 2) {
            setTagSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `/api/tags?search=${encodeURIComponent(query)}&limit=5`
            );
            const data = await response.json();

            if (response.ok) {
                setTagSuggestions(data.tags.map((tag: any) => tag.name));
            }
        } catch (error) {
            console.error("Failed to fetch tag suggestions:", error);
        }
    };

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTagsInput(value);

        // Get the last tag being typed
        const tagsArray = value.split(",").map((tag) => tag.trim());
        const lastTag = tagsArray[tagsArray.length - 1];

        if (lastTag) {
            fetchTagSuggestions(lastTag);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleTagSuggestionClick = (suggestion: string) => {
        const tagsArray = tagsInput.split(",").map((tag) => tag.trim());
        tagsArray[tagsArray.length - 1] = suggestion;
        setTagsInput(tagsArray.join(", ") + ", ");
        setShowSuggestions(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!user) {
            setError("Authentication required");
            setLoading(false);
            return;
        }

        try {
            const tags = tagsInput
                ? tagsInput
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                : [];

            await createSnippet({
                ...formData,
                tags,
            });
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create snippet"
            );
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Authentication Required
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        Authentication is required to create a snippet.
                    </p>
                    <Link href="/login">
                        <Button>Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{t("createNew")}</CardTitle>
                    <CardDescription>Create a new snippet</CardDescription>
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
                                    placeholder="Snippet Title"
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
                                    <option value="">
                                        Select {t("language")}
                                    </option>
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
                            <Label htmlFor="description">
                                {t("description")}
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Describe your snippet"
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
                                    placeholder="Topic"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">{t("tags")}</Label>
                                <div className="relative">
                                    <Input
                                        id="tags"
                                        value={tagsInput}
                                        onChange={handleTagInputChange}
                                        onBlur={() =>
                                            setTimeout(
                                                () => setShowSuggestions(false),
                                                200
                                            )
                                        }
                                        onFocus={() => {
                                            if (tagSuggestions.length > 0) {
                                                setShowSuggestions(true);
                                            }
                                        }}
                                        placeholder={t("tags")}
                                    />
                                    {showSuggestions &&
                                        tagSuggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 bg-background border border-input rounded-md shadow-lg z-10 mt-1">
                                                {tagSuggestions.map(
                                                    (suggestion, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            className="w-full px-3 py-2 text-left hover:bg-muted"
                                                            onClick={() =>
                                                                handleTagSuggestionClick(
                                                                    suggestion
                                                                )
                                                            }
                                                        >
                                                            {suggestion}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">{t("code")} *</Label>
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
                                placeholder={t("code")}
                                rows={15}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? tCommon("loading") : t("createNew")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                {tCommon("cancel")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
