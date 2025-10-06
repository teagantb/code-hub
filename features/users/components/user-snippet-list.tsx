"use client";

import { CodeViewer } from "@/components/code-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { UserSnippet } from "../types";

interface UserSnippetsListProps {
  snippets: UserSnippet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  userId: string;
}

export function UserSnippetsList({
  snippets,
  pagination,
  userId,
}: UserSnippetsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations("snippets");
  const tCommon = useTranslations("common");
  const tUsers = useTranslations("users");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [language, setLanguage] = useState(searchParams.get("language") || "");

  const truncateCode = (code: string, maxLength: number = 1000) => {
    if (code.length <= maxLength) return code;
    return code.substring(0, maxLength) + "...";
  };

  const updateURL = (
    newSearch: string,
    newLanguage: string,
    newPage: number = 1
  ) => {
    const params = new URLSearchParams();

    if (newSearch) params.set("search", newSearch);
    if (newLanguage) params.set("language", newLanguage);
    if (newPage > 1) params.set("page", newPage.toString());

    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : "";
    router.push(`/users/${userId}${newURL}`);
  };

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    updateURL(newSearch, language);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    updateURL(search, newLanguage);
  };

  const handlePageChange = (newPage: number) => {
    updateURL(search, language, newPage);
  };

  if (snippets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {pagination.total === 0
            ? tUsers("noSnippetsShared")
            : tUsers("noSnippetsMatch")}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
            />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">All {t("language")}s</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="csharp">C#</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Snippets */}
      <div className="grid gap-6">
        {snippets.map((snippet) => (
          <Card key={snippet.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    <Link
                      href={`/snippets/${snippet.id}`}
                      className="hover:underline"
                    >
                      {snippet.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {new Date(snippet.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{snippet.language}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {snippet.description && (
                <p className="text-muted-foreground mb-4">
                  {snippet.description}
                </p>
              )}
              <div className="bg-muted p-0 rounded-md overflow-hidden text-sm">
                <CodeViewer
                  code={truncateCode(snippet.code)}
                  language={snippet.language}
                />
              </div>
              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {snippet.tags.map((tag) => (
                    <Link
                      key={tag.tag.id}
                      href={`/tags/${encodeURIComponent(tag.tag.name)}`}
                    >
                      <Badge
                        variant="outline"
                        className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                      >
                        {tag.tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            {tCommon("previous")}
          </Button>
          <span className="flex items-center px-4">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            {tCommon("next")}
          </Button>
        </div>
      )}
    </>
  );
}
