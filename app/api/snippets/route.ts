import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const token = await getTokenFromCookies();
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        const { title, code, language, description, topic, tags } =
            await request.json();

        // Validate input
        if (!title || !code || !language) {
            return NextResponse.json(
                { error: "Title, code, and language are required" },
                { status: 400 }
            );
        }

        // Create snippet
        const snippet = await prisma.snippet.create({
            data: {
                title,
                code,
                language,
                description: description || null,
                topic: topic || null,
                authorId: payload.userId,
            },
        });

        // Handle tags if provided
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                // Find or create tag
                const tag = await prisma.tag.upsert({
                    where: { name: tagName.toLowerCase() },
                    update: {},
                    create: { name: tagName.toLowerCase() },
                });

                // Create snippet-tag relationship
                await prisma.snippetTag.create({
                    data: {
                        snippetId: snippet.id,
                        tagId: tag.id,
                    },
                });
            }
        }

        // Fetch the created snippet with author and tags
        const createdSnippet = await prisma.snippet.findUnique({
            where: { id: snippet.id },
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

        return NextResponse.json({
            message: "Snippet created successfully",
            snippet: createdSnippet,
        });
    } catch (error) {
        console.error("Create snippet error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const language = searchParams.get("language");
        const tag = searchParams.get("tag");
        const search = searchParams.get("search");

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
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
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

        return NextResponse.json({
            snippets,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get snippets error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
