"use server";

import { prisma } from "@/lib/prisma";
import type { TagsResponse, TagSnippetsResponse } from "../types";

export async function getTags(search?: string): Promise<TagsResponse> {
    try {
        const where = search
            ? {
                  name: {
                      contains: search,
                      mode: "insensitive" as const,
                  },
              }
            : {};

        const tags = await prisma.tag.findMany({
            where,
            include: {
                _count: {
                    select: {
                        snippets: true,
                    },
                },
            },
            orderBy: {
                snippets: {
                    _count: "desc",
                },
            },
        });

        return { tags };
    } catch (error) {
        console.error("Error fetching tags:", error);
        return {
            tags: [],
            error: "Failed to fetch tags",
        };
    }
}

export async function getTagSnippets(
    tagName: string,
    page: number = 1,
    limit: number = 10
): Promise<TagSnippetsResponse> {
    try {
        const decodedTagName = decodeURIComponent(tagName);

        const tag = await prisma.tag.findUnique({
            where: { name: decodedTagName },
        });

        if (!tag) {
            return {
                tag: { id: "", name: decodedTagName },
                snippets: [],
                pagination: { page, limit, total: 0, pages: 0 },
                error: "Tag not found",
            };
        }

        const skip = (page - 1) * limit;

        const [snippets, total] = await Promise.all([
            prisma.snippet.findMany({
                where: {
                    tags: {
                        some: {
                            tag: {
                                name: decodedTagName,
                            },
                        },
                    },
                    isPublic: true,
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
                            tag: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma.snippet.count({
                where: {
                    tags: {
                        some: {
                            tag: {
                                name: decodedTagName,
                            },
                        },
                    },
                    isPublic: true,
                },
            }),
        ]);

        const pages = Math.ceil(total / limit);

        return {
            tag: { id: tag.id, name: tag.name },
            snippets: snippets.map((snippet) => ({
                ...snippet,
                createdAt: snippet.createdAt.toISOString(),
            })),
            pagination: {
                page,
                limit,
                total,
                pages,
            },
        };
    } catch (error) {
        console.error("Error fetching tag snippets:", error);
        return {
            tag: { id: "", name: tagName },
            snippets: [],
            pagination: { page, limit, total: 0, pages: 0 },
            error: "Failed to fetch tag snippets",
        };
    }
}
