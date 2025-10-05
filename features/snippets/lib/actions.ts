"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CreateSnippetData, UpdateSnippetData } from "../types";

export async function createSnippet(data: CreateSnippetData) {
    try {
        // Check authentication
        const token = await getTokenFromCookies();
        if (!token) {
            throw new Error("Authentication required");
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw new Error("Invalid token");
        }

        // Validate input
        if (!data.title || !data.code || !data.language) {
            throw new Error("Title, code, and language are required");
        }

        // Create snippet
        const snippet = await prisma.snippet.create({
            data: {
                title: data.title,
                code: data.code,
                language: data.language,
                description: data.description || null,
                topic: data.topic || null,
                authorId: payload.userId,
            },
        });

        // Handle tags if provided
        if (data.tags && data.tags.length > 0) {
            for (const tagName of data.tags) {
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

        // Revalidate the snippets page
        revalidatePath("/snippets");

        // Redirect to the new snippet
        redirect(`/snippets/${snippet.id}`);
    } catch (error) {
        console.error("Create snippet error:", error);
        throw error;
    }
}

export async function updateSnippet(data: UpdateSnippetData) {
    try {
        // Check authentication
        const token = await getTokenFromCookies();
        if (!token) {
            throw new Error("Authentication required");
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw new Error("Invalid token");
        }

        // Check if snippet exists and user is the author
        const existingSnippet = await prisma.snippet.findUnique({
            where: { id: data.id },
        });

        if (!existingSnippet) {
            throw new Error("Snippet not found");
        }

        if (existingSnippet.authorId !== payload.userId) {
            throw new Error("Access denied");
        }

        // Validate input
        if (!data.title || !data.code || !data.language) {
            throw new Error("Title, code, and language are required");
        }

        // Update snippet
        await prisma.snippet.update({
            where: { id: data.id },
            data: {
                title: data.title,
                code: data.code,
                language: data.language,
                description: data.description || null,
                topic: data.topic || null,
            },
        });

        // Handle tags if provided
        if (data.tags !== undefined) {
            // Remove existing tags
            await prisma.snippetTag.deleteMany({
                where: { snippetId: data.id },
            });

            // Add new tags
            if (data.tags && data.tags.length > 0) {
                for (const tagName of data.tags) {
                    const tag = await prisma.tag.upsert({
                        where: { name: tagName.toLowerCase() },
                        update: {},
                        create: { name: tagName.toLowerCase() },
                    });

                    await prisma.snippetTag.create({
                        data: {
                            snippetId: data.id,
                            tagId: tag.id,
                        },
                    });
                }
            }
        }

        // Revalidate the snippets page and current snippet
        revalidatePath("/snippets");
        revalidatePath(`/snippets/${data.id}`);

        // Redirect to the updated snippet
        redirect(`/snippets/${data.id}`);
    } catch (error) {
        console.error("Update snippet error:", error);
        throw error;
    }
}

export async function deleteSnippet(snippetId: string) {
    try {
        // Check authentication
        const token = await getTokenFromCookies();
        if (!token) {
            throw new Error("Authentication required");
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw new Error("Invalid token");
        }

        // Check if snippet exists and user is the author
        const existingSnippet = await prisma.snippet.findUnique({
            where: { id: snippetId },
        });

        if (!existingSnippet) {
            throw new Error("Snippet not found");
        }

        if (existingSnippet.authorId !== payload.userId) {
            throw new Error("Access denied");
        }

        // Delete snippet (cascade will handle related records)
        await prisma.snippet.delete({
            where: { id: snippetId },
        });

        // Revalidate the snippets page
        revalidatePath("/snippets");

        // Redirect to snippets list
        redirect("/snippets");
    } catch (error) {
        console.error("Delete snippet error:", error);
        throw error;
    }
}
