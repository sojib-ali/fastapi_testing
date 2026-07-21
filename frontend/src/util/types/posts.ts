export interface User {
    id: number;
    username: string;
    email: string;
    image_file: string | null;
    image_path: string;
}

export interface Post {
    id: number;
    user_id: number;
    author: User;
    title: string;
    content: string;
    date_posted: string;
}

export interface PaginatedPostsResponse {
    posts: Post[];
    total: number;
    skip: number;
    limit: number;
    has_more: boolean;
}