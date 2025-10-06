"use client";

import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    previousLabel: string;
    nextLabel: string;
    pageInfo: string;
    onChange: (page: number) => void;
    className?: string;
}

export function PaginationControls({
    currentPage,
    totalPages,
    previousLabel,
    nextLabel,
    pageInfo,
    onChange,
    className,
}: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    return (
        <div className={`flex justify-center gap-2 mt-8 ${className ?? ""}`}>
            <Button
                variant="outline"
                onClick={() => onChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {previousLabel}
            </Button>
            <span className="flex items-center px-4">{pageInfo}</span>
            <Button
                variant="outline"
                onClick={() => onChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {nextLabel}
            </Button>
        </div>
    );
}
