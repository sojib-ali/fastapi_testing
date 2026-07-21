import { apiFetch } from "@/lib/api";

const apiUrl = "/api/posts";

export async function fetchPosts({ pageParam = 0 }: { pageParam?: number }) {
    // API returns PaginatedPostsResponse now
    const response = await apiFetch(`${apiUrl}?skip=${pageParam}&limit=10`);

    if (!response.ok) {
        const error = new Error("An error occured while fetching the list of posts");
        throw error;
    }

    const data = await response.json();
    return data;
}

export async function fetchUserPosts({ userId, pageParam = 0 }: { userId: number; pageParam?: number }) {
    const response = await apiFetch(`/api/users/${userId}/posts?skip=${pageParam}&limit=10`);

    if (!response.ok) {
        const error = new Error("An error occured while fetching the user's posts");
        throw error;
    }

    const data = await response.json();
    return data;
}

export async function fetchPost({ id, signal }: { id: number; signal?: AbortSignal }) {
    const response = await apiFetch(`${apiUrl}/${id}`, { signal })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        const errorMessage = errorData?.detail || "An error occured while fetching a single post";

        throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
}


export async function createPost(postData: {
    title: string, content: string
}) {
    const response = await apiFetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(postData),
    });
    if (!response.ok)
        throw new Error("Failed to create post");

    return response.json();
}

export async function updatePost({ id, postData }:
    { id: number; postData: { title: string; content: string } }
) {
    const response = await apiFetch(`${apiUrl}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error("Failed to update post");
    return response.json()
}

export async function deletePost(id: number) {
    const response = await apiFetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete post");
    return true;
}