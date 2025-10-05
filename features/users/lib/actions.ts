"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function searchUserSnippets(userId: string, formData: FormData) {
    const search = formData.get("search") as string;
    const language = formData.get("language") as string;
    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    if (language) {
        params.set("language", language);
    }

    redirect(`/users/${userId}?${params.toString()}`);
}
