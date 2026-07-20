/**
 * Resolves a backend-relative image path to a full URL.
 *
 * Usage:
 *   <img src={getMediaUrl(user.image_path)} />
 *
 * Why this exists:
 *   - In development, image_path is a relative path like "/static/.../default.jpg"
 *     that needs the backend base URL prepended.
 *   - In production with S3, your backend will return a full URL like
 *     "https://your-bucket.s3.amazonaws.com/..." so no prepending is needed.
 *   - This function handles both cases transparently.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function getMediaUrl(path: string | null | undefined): string | undefined {
    if (!path) return undefined;

    // If the backend already returns a full URL (S3, CDN, etc.), use it as-is
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    // Otherwise, prepend the backend base URL (local file serving)
    return `${API_BASE_URL}${path}`;
}
