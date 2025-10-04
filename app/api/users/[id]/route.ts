import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        // Try to find user by ID first, then by username
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ id: userId }, { username: userId }],
            },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                image: true,
                bio: true,
                createdAt: true,
                _count: {
                    select: {
                        snippets: {
                            where: {
                                isPublic: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get user's most used languages
        const languageStats = await prisma.snippet.groupBy({
            by: ["language"],
            where: {
                authorId: user.id,
                isPublic: true,
            },
            _count: {
                language: true,
            },
            orderBy: {
                _count: {
                    language: "desc",
                },
            },
            take: 5,
        });

        // Get user's most used tags
        const tagStats = await prisma.snippetTag.groupBy({
            by: ["tagId"],
            where: {
                snippet: {
                    authorId: user.id,
                    isPublic: true,
                },
            },
            _count: {
                tagId: true,
            },
            orderBy: {
                _count: {
                    tagId: "desc",
                },
            },
            take: 10,
        });

        // Get tag names for the most used tags
        const tagIds = tagStats.map((stat) => stat.tagId);
        const tags = await prisma.tag.findMany({
            where: {
                id: {
                    in: tagIds,
                },
            },
            select: {
                id: true,
                name: true,
            },
        });

        const tagStatsWithNames = tagStats
            .map((stat) => {
                const tag = tags.find((t) => t.id === stat.tagId);
                return {
                    tag: tag,
                    count: stat._count.tagId,
                };
            })
            .filter((stat) => stat.tag);

        return NextResponse.json({
            user: {
                ...user,
                stats: {
                    totalSnippets: user._count.snippets,
                    languages: languageStats,
                    tags: tagStatsWithNames,
                },
            },
        });
    } catch (error) {
        console.error("Get user profile error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
