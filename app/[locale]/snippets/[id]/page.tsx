import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSnippet } from "@/features/snippets/lib/data";
import { SnippetActions } from "@/features/snippets/components/SnippetActions";
import { ComplexityAnalysis } from "@/components/complexity-analysis";
import { estimateComplexity } from "@/lib/complexity-analyzer";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface SnippetPageProps {
    params: Promise<{ id: string }>;
}

export default async function SnippetPage({ params }: SnippetPageProps) {
    const { id } = await params;

    const snippet = await getSnippet(id);

    if (!snippet) {
        notFound();
    }

    // Analyze code complexity
    const complexityAnalysis = estimateComplexity(snippet.code);

    const t = await getTranslations("snippets");
    const tCommon = await getTranslations("common");

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
                                By{" "}
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
                                        Updated{" "}
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
                        <Badge variant="outline" className="text-sm">
                            {complexityAnalysis.complexity}
                        </Badge>
                    </div>
                </div>

                {snippet.description && (
                    <p className="text-lg text-muted-foreground mb-4">
                        {snippet.description}
                    </p>
                )}

                {snippet.topic && (
                    <p className="text-sm text-muted-foreground mb-4">
                        Topic:{" "}
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

                <SnippetActions snippet={snippet} />
            </div>

            {/* Code and Complexity Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-muted p-6 rounded-md overflow-x-auto">
                                <code className="text-sm">{snippet.code}</code>
                            </pre>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <ComplexityAnalysis analysis={complexityAnalysis} />
                </div>
            </div>

            {/* Actions */}
            {/* <div className="mt-6 flex gap-4">
                <Button
                    onClick={() => {
                        navigator.clipboard.writeText(snippet.code);
                        // You could add a toast notification here
                    }}
                    variant="outline"
                >
                    Copy Code
                </Button>
                <Link href="/snippets">
                    <Button variant="outline">Back to Snippets</Button>
                </Link>
            </div> */}
        </div>
    );
}
