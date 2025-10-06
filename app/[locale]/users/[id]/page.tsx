import { Button } from "@/components/ui/button";
import { UserProfile } from "@/features/users/components/user-profile";
import { UserSnippetsList } from "@/features/users/components/user-snippet-list";
import { UserStats } from "@/features/users/components/user-stats";
import { getUser, getUserSnippets } from "@/features/users/lib/data";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

interface UserPageProps {
    params: Promise<{ id: string; locale: string }>;
    searchParams: Promise<{
        page?: string;
        language?: string;
        search?: string;
    }>;
}

export async function generateMetadata({
    params,
}: UserPageProps): Promise<Metadata> {
    const { id, locale } = await params;
    const t = await getTranslations({ locale, namespace: "snippets" });

    const { user, error: userError } = await getUser(id);

    if (userError || !user) {
        return {
            title: t("userNotFound") || "User Not Found",
            description:
                t("userNotFoundDescription") ||
                "The requested user could not be found.",
        };
    }

    // Get user snippets to determine languages and count
    const { snippets } = await getUserSnippets(id, 1, 10);
    const languages = [...new Set(snippets.map((s) => s.language))];
    const snippetCount = snippets.length;

    const title = t("userPageTitle", { userName: user.name });
    const description = t("userPageDescription", {
        userName: user.name,
        snippetCount: snippetCount.toString(),
        languages: languages.join(", "),
    });

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "profile",
            firstName: user.name,
            username: user.username || user.id,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        keywords: [
            user.name,
            "developer profile",
            "code snippets",
            "programming",
            ...languages,
            "developer portfolio",
        ],
    };
}

export default async function UserPage({
    params,
    searchParams,
}: UserPageProps) {
    const { id } = await params;

    const { page, language, search } = await searchParams;

    const t = await getTranslations("users");

    const pageNumber = parseInt(page || "1");

    const { user, error: userError } = await getUser(id);

    if (userError || !user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {t("userNotFound")}
                    </h1>
                    <Link href="/snippets">
                        <Button>{t("browseSnippets")}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const {
        snippets,
        pagination,
        error: snippetsError,
    } = await getUserSnippets(id, pageNumber, 3, language, search);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Profile Header */}
            <UserProfile user={user} />

            {user.stats.totalSnippets === 0 ? (
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            {t("noSnippets")}
                        </p>
                        <Link href="/snippets/new">
                            <Button className="mt-4">{t("createNew")}</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <UserStats user={user} />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <UserSnippetsList
                            snippets={snippets}
                            pagination={pagination}
                            userId={id}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
