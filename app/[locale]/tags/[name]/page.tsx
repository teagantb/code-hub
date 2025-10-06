import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTagSnippets } from "@/features/tags/lib/data";
import { TagSnippetsList } from "@/features/tags/components/tag-snippet-list";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface TagPageProps {
    params: Promise<{ name: string; locale: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
    params,
}: TagPageProps): Promise<Metadata> {
    const { name, locale } = await params;
    const t = await getTranslations({ locale, namespace: "snippets" });

    const { tag, snippets, pagination } = await getTagSnippets(name, 1, 10);

    if (!tag) {
        return {
            title: t("tagNotFound") || "Tag Not Found",
            description:
                t("tagNotFoundDescription") ||
                "The requested tag could not be found.",
        };
    }

    const title = t("tagPageTitle", { tagName: tag.name });
    const description = t("tagPageDescription", {
        tagName: tag.name,
        count: pagination.total,
        language: tag.name, // Using tag name as primary language indicator
    });

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        keywords: [
            tag.name,
            "code snippets",
            "programming",
            "code examples",
            "developer resources",
        ],
    };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
    const { name } = await params;
    const { page } = await searchParams;

    const pageNumber = parseInt(page || "1");

    const { tag, snippets, pagination, error } = await getTagSnippets(
        name,
        pageNumber,
        10
    );

    const t = await getTranslations("tags");

    if (error || !tag) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {t("tagNotFound")}
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        {error || t("tagNotExist")}
                    </p>
                    <Link href="/tags">
                        <Button>{t("browseAllTags")}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/tags">
                        <Button variant="outline" size="sm">
                            ← {t("allTags")}
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">#{tag.name}</h1>
                    </div>
                </div>
            </div>

            <p className="text-muted-foregroun text-sm font-bold my-4">
                {pagination.total} snippet
                {pagination.total !== 1 ? "s" : ""} found
            </p>

            {/* Snippets */}
            <TagSnippetsList snippets={snippets} pagination={pagination} />
        </div>
    );
}
