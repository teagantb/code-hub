"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function SnippetSearchForm() {
    const [search, setSearch] = useState("");
    const [language, setLanguage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize from URL params
    useState(() => {
        setSearch(searchParams.get("search") || "");
        setLanguage(searchParams.get("language") || "");
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (language) params.set("language", language);
        params.set("page", "1"); // Reset to first page

        router.push(`/snippets?${params.toString()}`);
    };

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search snippets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1"
                        />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-3 py-2 border border-input bg-background rounded-md"
                        >
                            <option value="">All Languages</option>
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
                        <Button type="submit">Search</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
