import { prisma } from "@/lib/prisma";
import type { Snippet, SnippetsResponse } from "../types";

export async function getSnippets(
    page: number = 1,
    limit: number = 10,
    search?: string,
    language?: string,
    tag?: string
): Promise<SnippetsResponse> {
    try {
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            isPublic: true,
        };

        if (language) {
            where.language = language;
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }

        if (tag) {
            where.tags = {
                some: {
                    tag: {
                        name: tag.toLowerCase(),
                    },
                },
            };
        }

        // Get snippets with pagination
        const [snippets, total] = await Promise.all([
            prisma.snippet.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                        },
                    },
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.snippet.count({ where }),
        ]);

        return {
            snippets: snippets.map((snippet) => ({
                ...snippet,
                createdAt: snippet.createdAt.toISOString(),
                updatedAt: snippet.updatedAt.toISOString(),
            })) as Snippet[],
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error("Get snippets error:", error);
        return {
            snippets: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                pages: 0,
            },
            error: "Failed to fetch snippets",
        };
    }
}

export async function getSnippet(id: string): Promise<Snippet | null> {
    try {
        const snippet = await prisma.snippet.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        return snippet as Snippet | null;
    } catch (error) {
        console.error("Get snippet error:", error);
        return null;
    }
}

export async function getSnippetForEdit(
    id: string,
    userId: string
): Promise<Snippet | null> {
    try {
        const snippet = await prisma.snippet.findFirst({
            where: {
                id,
                authorId: userId, // Only allow author to edit
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        return snippet as Snippet | null;
    } catch (error) {
        console.error("Get snippet for edit error:", error);
        return null;
    }
}
