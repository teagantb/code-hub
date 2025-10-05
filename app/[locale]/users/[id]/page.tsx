import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser, getUserSnippets } from "@/features/users/lib/data";
import { UserProfile } from "@/features/users/components/UserProfile";
import { UserStats } from "@/features/users/components/UserStats";
import { UserSnippetsList } from "@/features/users/components/UserSnippetsList";
import { getTranslations } from "next-intl/server";

interface UserPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{
        page?: string;
        language?: string;
        search?: string;
    }>;
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
    } = await getUserSnippets(id, pageNumber, 10, language, search);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Profile Header */}
            <UserProfile user={user} />

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
        </div>
    );
}
