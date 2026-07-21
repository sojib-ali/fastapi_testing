
import { apiFetch } from "@/lib/api";

// Assuming you have schemas/types for these based on your FastAPI backend
export interface User {
    id: number;
    username: string;
    email: string;
    image_file?: string | null;
    image_path: string;  // Always set by backend: /media/... or /static/.../default.jpg
}

export async function loginUser(data: { email: string; password: string }) {
    const response = await apiFetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Login failed");
    }
    return response.json();
}

export async function registerUser(data: { username: string; email: string; password: string }) {
    const response = await apiFetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Registration failed");
    }
    return response.json();
}

export async function logoutUser() {
    const response = await apiFetch("/api/users/logout", {
        method: "POST",
    });
    return response.json();
}

export async function getMe(): Promise<User> {
    const response = await apiFetch("/api/users/me");

    if (!response.ok) {
        throw new Error("Not authenticated");
    }
    return response.json();
}

export async function updateUser(userId: number, data: { username?: string; email?: string }): Promise<User> {
    const response = await apiFetch(`/api/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to update profile");
    }
    return response.json();
}

export async function deleteUser(userId: number): Promise<void> {
    const response = await apiFetch(`/api/users/${userId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to delete account");
    }
}

export async function uploadProfilePicture(userId: number, file: File): Promise<User> {
    // FormData is required for file uploads — NOT JSON.
    // apiFetch detects FormData and skips setting Content-Type so the browser
    // can set the correct multipart/form-data boundary automatically.
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiFetch(`/api/users/${userId}/picture`, {
        method: "PATCH",
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to upload profile picture");
    }
    return response.json();
}

export async function deleteProfilePicture(userId: number): Promise<User> {
    const response = await apiFetch(`/api/users/${userId}/picture`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to delete profile picture");
    }
    return response.json();
}

export async function getUser(userId: number): Promise<User> {
    const response = await apiFetch(`/api/users/${userId}`);

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to fetch user");
    }
    return response.json();
}
