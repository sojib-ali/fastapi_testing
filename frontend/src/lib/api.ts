// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// We use a flag to prevent multiple refresh calls from firing simultaneously
// if several requests fail with 401 at the exact same time.
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/refresh`, {
            method: "POST",
            // This is crucial: it sends the HttpOnly refresh token cookie
            credentials: "include",
        });

        if (response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        return false;
    }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

    // Don't set Content-Type for FormData — the browser sets it automatically
    // (including the multipart boundary), which is required for file uploads.
    const isFormData = options.body instanceof FormData;
    const baseHeaders = isFormData ? {} : { "Content-Type": "application/json" };

    // 1. Initial Request
    let response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            ...baseHeaders,
            ...options.headers,
        },
    });

    // 2. If it's not a 401, return the response normally
    if (response.status !== 401) {
        return response;
    }

    // 3. We got a 401. Let's try to refresh the token.
    if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken().finally(() => {
            isRefreshing = false;
        });
    }

    // Wait for the refresh attempt to finish
    const refreshed = await refreshPromise;

    if (!refreshed) {
        // Don't redirect here! Let the calling code decide what to do.
        // - AuthProvider will just set user to null (guest mode).
        // - Protected pages/components can redirect on their own.
        return response;
    }

    // 4. Refresh succeeded! Retry the original request
    response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            ...baseHeaders,
            ...options.headers,
        },
    });

    return response;
}
