"use client";

import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const t = useTranslations("snippets");
    const locale = useLocale();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", page.toString());

        router.push(`/${locale}/snippets?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center gap-2 mt-8">
            <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {t("previousButton")}
            </Button>
            <span className="flex items-center px-4">
                {t("pageInfo", { current: currentPage, total: totalPages })}
            </span>
            <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {t("nextButton")}
            </Button>
        </div>
    );
}
