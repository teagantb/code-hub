"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";

export function TagSearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const t = useTranslations("snippets");
    const locale = useLocale();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) {
            params.set("search", search);
        }
        router.push(`/${locale}/tags?${params.toString()}`);
    };

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder={t("tagSearchPlaceholder")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">{t("tagSearchButton")}</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
