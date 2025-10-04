"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface Snippet {
    id: string;
    title: string;
    code: string;
    language: string;
    description?: string;
    topic?: string;
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

export default function EditSnippetPage() {
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [description, setDescription] = useState("");
    const [topic, setTopic] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const fetchSnippet = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/snippets/${params.id}`);
            const data = await response.json();

            if (response.ok) {
                const snippetData = data.snippet;
                setSnippet(snippetData);
                setTitle(snippetData.title);
                setCode(snippetData.code);
                setLanguage(snippetData.language);
                setDescription(snippetData.description || "");
                setTopic(snippetData.topic || "");
                setTags(
                    snippetData.tags.map((t: any) => t.tag.name).join(", ")
                );
            } else {
                setError(data.error || "Failed to fetch snippet");
            }
        } catch (error) {
            setError("An error occurred while fetching the snippet");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        if (!user) {
            setError("You must be logged in to edit a snippet");
            setSaving(false);
            return;
        }

        try {
            const response = await fetch(`/api/snippets/${params.id}`, {
                method: "PUT",
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
                router.push(`/snippets/${params.id}`);
            } else {
                setError(data.error || "Failed to update snippet");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setSaving(false);
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
                        Loading snippet...
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
                        Snippet Not Found
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        {error ||
                            "The snippet you're looking for doesn't exist."}
                    </p>
                    <Button onClick={() => router.push("/snippets")}>
                        Back to Snippets
                    </Button>
                </div>
            </div>
        );
    }

    if (!user || user.id !== snippet.author.id) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-muted-foreground mb-4">
                        You can only edit your own snippets.
                    </p>
                    <Button
                        onClick={() => router.push(`/snippets/${params.id}`)}
                    >
                        View Snippet
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Edit Snippet</CardTitle>
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
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Enter snippet title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="language">Language *</Label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(e) =>
                                        setLanguage(e.target.value)
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what this snippet does"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">Topic</Label>
                                <Input
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., algorithms, web development"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="comma-separated tags"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Code *</Label>
                            <Textarea
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                placeholder="Paste your code here"
                                rows={15}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Update Snippet"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.push(`/snippets/${params.id}`)
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
