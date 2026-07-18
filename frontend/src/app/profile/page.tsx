"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
    // We already have the current user globally in our AuthContext!
    // Industry practice is to reuse this context rather than fetching /me on every single page.
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
                <p>Loading profile...</p>
            </div>
        );
    }

    // Unauthenticated State
    if (!isAuthenticated || !user) {
        return (
            <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <h2>Access Denied</h2>
                <p>You must be logged in to view your profile.</p>
                <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "15px" }}>
                    <Link href="/login" style={{ padding: "10px 20px", background: "#0070f3", color: "white", textDecoration: "none", borderRadius: "5px" }}>
                        Login
                    </Link>
                    <Link href="/register" style={{ padding: "10px 20px", background: "#eaeaea", color: "#333", textDecoration: "none", borderRadius: "5px" }}>
                        Register
                    </Link>
                </div>
            </div>
        );
    }

    // Authenticated State
    return (
        <div style={{ color: "#333", maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#fafafa" }}>
            <h2>My Profile</h2>
            
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                    <strong>Username:</strong> {user.username}
                </div>
                <div>
                    <strong>Email:</strong> {user.email}
                </div>
                <div>
                    <strong>User ID:</strong> {user.id}
                </div>
                {/* If you have image_file, you could render an <img /> here too! */}
                {user.image_file && (
                    <div>
                        <strong>Avatar:</strong> {user.image_file}
                    </div>
                )}
            </div>
        </div>
    );
}
