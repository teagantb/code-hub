"use client";

import { PaginationControls } from "@/components/pagination-controls";
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

    const pageInfoText = t("pageInfo", {
        current: currentPage,
        total: totalPages,
    });

    return (
        <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            previousLabel={t("previousButton")}
            nextLabel={t("nextButton")}
            pageInfo={pageInfoText}
            onChange={handlePageChange}
        />
    );
}
