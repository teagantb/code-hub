import { Button } from "@/components/ui/button";
import { Pagination } from "@/features/snippets/components/pagination";
import { SnippetCard } from "@/features/snippets/components/snippet-card";
import { SnippetSearchForm } from "@/features/snippets/components/snippet-search-form";
import { getSnippets } from "@/features/snippets/lib/data";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

interface SnippetsPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        language?: string;
        tag?: string;
    }>;
}

const ITEMS_PER_PAGE = 6;

export default async function SnippetsPage({
    searchParams,
}: SnippetsPageProps) {
    const params = await searchParams;

    const page = parseInt(params.page || "1");
    const search = params.search;
    const language = params.language;
    const tag = params.tag;

    const { snippets, pagination, error } = await getSnippets(
        page,
        ITEMS_PER_PAGE,
        search,
        language,
        tag
    );

    const t = await getTranslations("snippets");

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
                <p className="text-muted-foreground">{t("discoverShare")}</p>
            </div>

            {/* Search and Filters */}
            <SnippetSearchForm />

            {/* Results */}
            {error ? (
                <div className="text-center py-8">
                    <p className="text-destructive">{error}</p>
                    <Link href="/snippets">
                        <Button className="mt-4">{t("tryAgain")}</Button>
                    </Link>
                </div>
            ) : snippets.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">{t("noSnippets")}</p>
                    <Link href="/snippets/new">
                        <Button className="mt-4">{t("createNew")}</Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {snippets.map((snippet) => (
                            <SnippetCard key={snippet.id} snippet={snippet} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                    />
                </>
            )}
        </div>
    );
}
