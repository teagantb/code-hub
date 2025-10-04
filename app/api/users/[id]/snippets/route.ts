import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const language = searchParams.get("language");
        const search = searchParams.get("search");
        const skip = (page - 1) * limit;

        const userId = params.id;

        // Check if user exists
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ id: userId }, { username: userId }],
            },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Build where clause
        const where: any = {
            authorId: user.id,
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

        // Get snippets with pagination
        const [snippets, total] = await Promise.all([
            prisma.snippet.findMany({
                where,
                include: {
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
        console.error("Get user snippets error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
