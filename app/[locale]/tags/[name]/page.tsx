import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTagSnippets } from "@/features/tags/lib/data";
import { TagSnippetsList } from "@/features/tags/components/TagSnippetsList";
import { getTranslations } from "next-intl/server";

interface TagPageProps {
    params: Promise<{ name: string }>;
    searchParams: Promise<{ page?: string }>;
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
    const tCommon = await getTranslations("common");

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
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/tags">
                        <Button variant="outline" size="sm">
                            ← {t("allTags")}
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">#{tag.name}</h1>
                        <p className="text-muted-foreground">
                            {pagination.total} snippet
                            {pagination.total !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>
            </div>

            {/* Snippets */}
            <TagSnippetsList snippets={snippets} pagination={pagination} />
        </div>
    );
}
