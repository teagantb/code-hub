export interface Tag {
    id: string;
    name: string;
    _count: {
        snippets: number;
    };
}

export interface TagSnippet {
    id: string;
    title: string;
    code: string;
    language: string;
    description?: string | null;
    topic?: string | null;
    complexity?: string | null;
    createdAt: string;
    author: {
        id: string;
        name: string;
        username?: string | null;
        image?: string | null;
    };
    tags: Array<{
        tag: {
            id: string;
            name: string;
        };
    }>;
}

export interface TagData {
    tag: {
        id: string;
        name: string;
    };
    snippets: TagSnippet[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface TagsResponse {
    tags: Tag[];
    error?: string;
}

export interface TagSnippetsResponse extends TagData {
    error?: string;
}
