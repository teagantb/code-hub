export interface Snippet {
    id: string;
    title: string;
    code: string;
    language: string;
    description?: string;
    topic?: string;
    complexity?: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string;
        username?: string;
        image?: string;
    };
    tags: Array<{
        tag: {
            id: string;
            name: string;
        };
    }>;
}

export interface SnippetsResponse {
    snippets: Snippet[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    error?: string;
}

export interface CreateSnippetData {
    title: string;
    code: string;
    language: string;
    description?: string;
    topic?: string;
    tags?: string[];
}

export interface UpdateSnippetData extends CreateSnippetData {
    id: string;
}
