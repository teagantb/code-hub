"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
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
import { LANGUAGES } from "../constant";

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
                error instanceof Error ? error.message : t("updateSnippetError")
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
                    <CardDescription>{t("editDescription")}</CardDescription>
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
                                    placeholder={t("snippetTitlePlaceholder")}
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
                                        {t("selectLanguagePlaceholder")}
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
                                {t("descriptionLabel")}
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
                                placeholder={t("describeSnippetPlaceholder")}
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">{t("topic")}</Label>
                                <Input
                                    id="topic"
                                    value={formData.topic}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            topic: e.target.value,
                                        })
                                    }
                                    placeholder={t("topicPlaceholder")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">{t("tags")}</Label>
                                <Input
                                    id="tags"
                                    value={tagsInput}
                                    onChange={(e) =>
                                        setTagsInput(e.target.value)
                                    }
                                    placeholder={t("tagsPlaceholder")}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">{t("code")} *</Label>
                            <Editor
                                value={formData.code}
                                onValueChange={(code) =>
                                    setFormData({
                                        ...formData,
                                        code: code,
                                    })
                                }
                                highlight={(code) => {
                                    const lang = (
                                        formData.language || ""
                                    ).toLowerCase();
                                    if (lang === "javascript") {
                                        return Prism.highlight(
                                            code,
                                            Prism.languages.javascript,
                                            "javascript"
                                        );
                                    }
                                    if (lang === "typescript") {
                                        return Prism.highlight(
                                            code,
                                            Prism.languages.typescript,
                                            "typescript"
                                        );
                                    }
                                    if (lang === "python") {
                                        return Prism.highlight(
                                            code,
                                            Prism.languages.python,
                                            "python"
                                        );
                                    }
                                    return code;
                                }}
                                padding={10}
                                style={{
                                    fontFamily:
                                        '"Fira code", "Fira Mono", monospace',
                                    fontSize: 12,
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
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
                                    router.push(
                                        `/${locale}/snippets/${snippet.id}`
                                    )
                                }
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
