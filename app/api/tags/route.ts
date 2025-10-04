import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const limit = parseInt(searchParams.get("limit") || "50");

        // Build where clause
        const where: any = {};
        if (search) {
            where.name = {
                contains: search,
                mode: "insensitive",
            };
        }

        // Get tags with snippet counts
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
            take: limit,
        });

        return NextResponse.json({ tags });
    } catch (error) {
        console.error("Get tags error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
