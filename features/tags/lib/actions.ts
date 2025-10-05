"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function searchTags(formData: FormData) {
    const search = formData.get("search") as string;
    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    redirect(`/tags?${params.toString()}`);
}

export async function navigateToTag(tagName: string) {
    redirect(`/tags/${encodeURIComponent(tagName)}`);
}
