import { getTags } from "@/features/tags/lib/data";
import { TagSearchForm } from "@/features/tags/components/tag-search-form";
import { TagCard } from "@/features/tags/components/tag-card";
import { getTranslations } from "next-intl/server";

interface TagsPageProps {
    searchParams: Promise<{ search?: string }>;
}

export default async function TagsPage({ searchParams }: TagsPageProps) {
    const params = await searchParams;
    const search = params.search;

    const { tags, error } = await getTags(search);

    const t = await getTranslations("tags");

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
                <p className="text-muted-foreground">{t("browseAll")}</p>
            </div>

            {/* Search */}
            <TagSearchForm />

            {/* Results */}
            {error ? (
                <div className="text-center py-8">
                    <p className="text-destructive">{error}</p>
                </div>
            ) : tags.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">{t("noTags")}</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tags.map((tag) => (
                        <TagCard key={tag.id} tag={tag} />
                    ))}
                </div>
            )}
        </div>
    );
}
