export interface User {
    id: string;
    name: string;
    username?: string;
    image?: string;
    bio?: string;
    createdAt: string;
    stats: {
        totalSnippets: number;
        languages: Array<{
            language: string;
            _count: { language: number };
        }>;
        tags: Array<{
            tag: { id: string; name: string };
            count: number;
        }>;
    };
}

export interface UserSnippet {
    id: string;
    title: string;
    code: string;
    language: string;
    description?: string | null;
    topic?: string | null;
    complexity?: string | null;
    createdAt: string;
    tags: Array<{
        tag: {
            id: string;
            name: string;
        };
    }>;
}

export interface UserSnippetsResponse {
    snippets: UserSnippet[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    error?: string;
}

export interface UserResponse {
    user: User;
    error?: string;
}
