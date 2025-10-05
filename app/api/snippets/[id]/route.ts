import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        if (!snippet) {
            return NextResponse.json(
                { error: "Snippet not found" },
                { status: 404 }
            );
        }

        // Check if snippet is public or user is the author
        if (!snippet.isPublic) {
            const token = await getTokenFromCookies();
            if (!token) {
                return NextResponse.json(
                    { error: "Authentication required" },
                    { status: 401 }
                );
            }

            const payload = verifyToken(token);
            if (!payload || payload.userId !== snippet.authorId) {
                return NextResponse.json(
                    { error: "Access denied" },
                    { status: 403 }
                );
            }
        }

        return NextResponse.json({ snippet });
    } catch (error) {
        console.error("Get snippet error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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

        // Check if snippet exists and user is the author
        const existingSnippet = await prisma.snippet.findUnique({
            where: { id },
        });

        if (!existingSnippet) {
            return NextResponse.json(
                { error: "Snippet not found" },
                { status: 404 }
            );
        }

        if (existingSnippet.authorId !== payload.userId) {
            return NextResponse.json(
                { error: "Access denied" },
                { status: 403 }
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

        // Update snippet
        const updatedSnippet = await prisma.snippet.update({
            where: { id },
            data: {
                title,
                code,
                language,
                description: description || null,
                topic: topic || null,
            },
        });

        // Handle tags if provided
        if (tags !== undefined) {
            // Remove existing tags
            await prisma.snippetTag.deleteMany({
                where: { snippetId: id },
            });

            // Add new tags
            if (tags && tags.length > 0) {
                for (const tagName of tags) {
                    const tag = await prisma.tag.upsert({
                        where: { name: tagName.toLowerCase() },
                        update: {},
                        create: { name: tagName.toLowerCase() },
                    });

                    await prisma.snippetTag.create({
                        data: {
                            snippetId: id,
                            tagId: tag.id,
                        },
                    });
                }
            }
        }

        // Fetch updated snippet with author and tags
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

        return NextResponse.json({
            message: "Snippet updated successfully",
            snippet,
        });
    } catch (error) {
        console.error("Update snippet error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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

        // Check if snippet exists and user is the author
        const existingSnippet = await prisma.snippet.findUnique({
            where: { id },
        });

        if (!existingSnippet) {
            return NextResponse.json(
                { error: "Snippet not found" },
                { status: 404 }
            );
        }

        if (existingSnippet.authorId !== payload.userId) {
            return NextResponse.json(
                { error: "Access denied" },
                { status: 403 }
            );
        }

        // Delete snippet (cascade will handle related records)
        await prisma.snippet.delete({
            where: { id },
        });

        return NextResponse.json({
            message: "Snippet deleted successfully",
        });
    } catch (error) {
        console.error("Delete snippet error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
