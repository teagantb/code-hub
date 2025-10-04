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
import { useTranslations } from "next-intl";

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

export default function CreateSnippetPage() {
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [description, setDescription] = useState("");
    const [topic, setTopic] = useState("");
    const [tags, setTags] = useState("");
    const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const t = useTranslations("snippets.create");

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
        setTags(value);

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
        const tagsArray = tags.split(",").map((tag) => tag.trim());
        tagsArray[tagsArray.length - 1] = suggestion;
        setTags(tagsArray.join(", ") + ", ");
        setShowSuggestions(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!user) {
            setError(t("errors.authRequired"));
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/snippets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    code,
                    language,
                    description: description || null,
                    topic: topic || null,
                    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
                }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push(`/snippets/${data.snippet.id}`);
            } else {
                setError(data.error || t("errors.createFailed"));
            }
        } catch (error) {
            setError(t("errors.tryAgain"));
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">{t("loading")}</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {t("authRequired")}
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        {t("authRequiredDescription")}
                    </p>
                    <Link href="/login">
                        <Button>{t("login")}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{t("title")}</CardTitle>
                    <CardDescription>{t("subtitle")}</CardDescription>
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
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder={t("snippetTitle")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="language">
                                    {t("language")} *
                                </Label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(e) =>
                                        setLanguage(e.target.value)
                                    }
                                    required
                                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                                >
                                    <option value="">
                                        {t("selectLanguage")}
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t("describeSnippet")}
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">{t("topic")}</Label>
                                <Input
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder={t("topicPlaceholder")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">{t("tags")}</Label>
                                <div className="relative">
                                    <Input
                                        id="tags"
                                        value={tags}
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
                                        placeholder={t("tagsPlaceholder")}
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
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                placeholder={t("codePlaceholder")}
                                rows={15}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? t("creating") : t("createSnippet")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                {t("cancel")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
