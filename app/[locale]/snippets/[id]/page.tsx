import { CodeViewer } from "@/components/code-viewer";
import { ComplexityAnalysis } from "@/components/complexity-analysis";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SnippetActions } from "@/features/snippets/components/snippet-actions";
import { getSnippet } from "@/features/snippets/lib/data";
import { estimateComplexity } from "@/lib/complexity-analyzer";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SnippetPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: SnippetPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "snippets" });

  const snippet = await getSnippet(id);

  if (!snippet) {
    return {
      title: t("snippetNotFound") || "Snippet Not Found",
      description:
        t("snippetNotFoundDescription") ||
        "The requested snippet could not be found.",
    };
  }

  const title = t("snippetPageTitle", { title: snippet.title });
  const description = t("snippetPageDescription", {
    title: snippet.title,
    author: snippet.author.name,
    language: snippet.language,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      authors: [snippet.author.name],
      tags: snippet.tags.map((tag) => tag.tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: [
      snippet.language,
      ...snippet.tags.map((tag) => tag.tag.name),
      snippet.topic,
      "code snippet",
      "programming",
    ].filter(Boolean) as string[],
  };
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
        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{snippet.title}</h1>
            <div className="flex md:hidden items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                {snippet.language}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {complexityAnalysis.complexity}
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-muted-foreground">
              <span>
                By{" "}
                <Link
                  href={`/users/${
                    snippet.author.username || snippet.author.id
                  }`}
                  className="hover:underline font-medium"
                >
                  {snippet.author.name}
                </Link>
              </span>
              <span className="hidden md:block">•</span>
              <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
              {snippet.updatedAt !== snippet.createdAt && (
                <>
                  <span className="hidden md:block">•</span>
                  <span>
                    Updated {new Date(snippet.updatedAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
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
          <p className="text-base text-muted-foreground mb-4">
            <span className="font-bold">{snippet.topic}</span>
          </p>
        )}

        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {snippet.tags.map((tag) => (
              <Link
                key={tag.tag.id}
                href={`/tags/${encodeURIComponent(tag.tag.name)}`}
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
              <CodeViewer code={snippet.code} language={snippet.language} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <ComplexityAnalysis analysis={complexityAnalysis} />
        </div>
      </div>
    </div>
  );
}
