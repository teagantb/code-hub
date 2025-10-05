import { notFound } from "next/navigation";
import { getSnippetForEdit } from "@/features/snippets/lib/data";
import { EditSnippetForm } from "@/features/snippets/components/EditSnippetForm";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";

interface EditSnippetPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSnippetPage({
    params,
}: EditSnippetPageProps) {
    const { id } = await params;

    // Get current user
    const token = await getTokenFromCookies();
    if (!token) {
        notFound();
    }

    const payload = verifyToken(token);
    if (!payload) {
        notFound();
    }

    const snippet = await getSnippetForEdit(id, payload.userId);

    if (!snippet) {
        notFound();
    }

    return <EditSnippetForm snippet={snippet} />;
}
