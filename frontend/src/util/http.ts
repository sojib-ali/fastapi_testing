const apiUrl = "http://localhost:8000/api/posts/";

export async function fetchPosts() {
    const response = await fetch(`${apiUrl}`);

    if (!response.ok) {
        const error = new Error("An error occured while fetching the list of posts");
        throw error;
    }

    const data = await response.json();
    return data;
}