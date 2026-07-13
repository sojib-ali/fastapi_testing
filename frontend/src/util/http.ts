const apiUrl = "http://localhost:8000/api/posts";

export async function fetchPosts() {
    const response = await fetch(`${apiUrl}`);

    if (!response.ok) {
        const error = new Error("An error occured while fetching the list of posts");
        throw error;
    }

    const data = await response.json();
    return data;
}

export async function fetchPost({ id, signal }: { id: number; signal?: AbortSignal }) {
    const response = await fetch(`${apiUrl}/${id}`, { signal })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        const errorMessage = errorData?.detail || "An error occured while fetching a single post";

        throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
}


export async function createPost(postData: {
    title: string, content: string, user_id: number
}) {
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
    });
    if (!response.ok)
        throw new Error("Failed to create post");

    return response.json();
}

export async function updatePost({ id, postData }:
    { id: number; postData: { title: string; content: string; user_id: number } }
) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error("Failed to update post");
    return response.json()
}

export async function deletePost(id: number) {
    const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete post");
    return true;
}