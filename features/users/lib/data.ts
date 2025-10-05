"use server";

import { prisma } from "@/lib/prisma";
import type { UserResponse, UserSnippetsResponse } from "../types";

export async function getUser(usernameOrId: string): Promise<UserResponse> {
    try {
        const user = await prisma.user.findFirst({
            where: { OR: [{ id: usernameOrId }, { username: usernameOrId }] },
            include: {
                snippets: {
                    where: { isPublic: true },
                    select: {
                        language: true,
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
                },
            },
        });

        if (!user) {
            return {
                user: {} as any,
                error: "User not found",
            };
        }

        // Calculate stats
        const totalSnippets = user.snippets.length;

        // Group by language
        const languageStats = user.snippets.reduce((acc, snippet) => {
            const lang = snippet.language;
            acc[lang] = (acc[lang] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const languages = Object.entries(languageStats).map(
            ([language, count]) => ({
                language,
                _count: { language: count },
            })
        );

        // Group by tags
        const tagStats = user.snippets.reduce((acc, snippet) => {
            snippet.tags.forEach(({ tag }) => {
                acc[tag.name] = (acc[tag.name] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);

        const tags = Object.entries(tagStats)
            .map(([name, count]) => ({
                tag: { id: "", name },
                count,
            }))
            .sort((a, b) => b.count - a.count);

        const userWithStats = {
            ...user,
            username: user.username ?? undefined,
            image: user.image ?? undefined,
            bio: user.bio ?? undefined,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            stats: {
                totalSnippets,
                languages,
                tags,
            },
        };

        return { user: userWithStats };
    } catch (error) {
        console.error("Error fetching user:", error);
        return {
            user: {} as any,
            error: "Failed to fetch user",
        };
    }
}

export async function getUserSnippets(
    usernameOrId: string,
    page: number = 1,
    limit: number = 10,
    language?: string,
    search?: string
): Promise<UserSnippetsResponse> {
    try {
        const skip = (page - 1) * limit;

        const user = await prisma.user.findFirst({
            where: { OR: [{ id: usernameOrId }, { username: usernameOrId }] },
        });

        if (!user) {
            return {
                snippets: [],
                pagination: { page, limit, total: 0, pages: 0 },
                error: "User not found",
            };
        }

        const where: any = {
            authorId: user.id,
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

        const [snippets, total] = await Promise.all([
            prisma.snippet.findMany({
                where,
                include: {
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
            prisma.snippet.count({ where }),
        ]);

        const pages = Math.ceil(total / limit);

        return {
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
        console.error("Error fetching user snippets:", error);
        return {
            snippets: [],
            pagination: { page, limit, total: 0, pages: 0 },
            error: "Failed to fetch user snippets",
        };
    }
}
