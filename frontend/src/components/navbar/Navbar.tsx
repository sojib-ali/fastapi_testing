"use client";

import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/util/query-hooks/useAuthHooks";
import Link from "next/link";
import styles from "./navbar.module.css"; // Bring back your styles!

export default function Navbar() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    return (
        <nav className={styles.navbar}>
            <div className={styles.brand}>
                <h1>FastAPI Blog</h1>
                <Link href="/">Home</Link>
                <Link href="/posts">Posts</Link>
            </div>

            <div className={styles.actions}>
                {isLoading ? (
                    <span>Loading...</span>
                ) : isAuthenticated ? (
                    <>
                        <Link href="/posts/new" className={styles.btnRegister}>New Post</Link>
                        <Link href="/profile" style={{ color: "white", marginRight: "10px", textDecoration: "none" }}>
                            Hi, {user?.username}
                        </Link>
                        <button
                            onClick={() => logout()}
                            disabled={isLoggingOut}
                            className={styles.btnLogin} // Reusing your login button style for logout
                            style={{ cursor: "pointer" }}
                        >
                            {isLoggingOut ? "..." : "Logout"}
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className={styles.btnLogin}>Login</Link>
                        <Link href="/register" className={styles.btnRegister}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
