import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        const { name } = await params;
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const tagName = decodeURIComponent(name);

        // Check if tag exists
        const tag = await prisma.tag.findUnique({
            where: { name: tagName.toLowerCase() },
        });

        if (!tag) {
            return NextResponse.json(
                { error: "Tag not found" },
                { status: 404 }
            );
        }

        // Get snippets with this tag
        const [snippets, total] = await Promise.all([
            prisma.snippet.findMany({
                where: {
                    isPublic: true,
                    tags: {
                        some: {
                            tag: {
                                name: tagName.toLowerCase(),
                            },
                        },
                    },
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
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.snippet.count({
                where: {
                    isPublic: true,
                    tags: {
                        some: {
                            tag: {
                                name: tagName.toLowerCase(),
                            },
                        },
                    },
                },
            }),
        ]);

        return NextResponse.json({
            tag,
            snippets,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get tag snippets error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
