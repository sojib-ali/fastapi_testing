import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.brand}>
                <h1>FastAPI Blog</h1>
                <Link href="/">Home</Link>
                <Link href="/posts">Posts</Link>

            </div>
            <div className={styles.actions}>
                <Link href="/login" className={styles.btnLogin}>Login</Link>
                <Link href="/register" className={styles.btnRegister}>Register</Link>
                <Link href="/posts/new" className={styles.btnRegister}>New Post</Link>
            </div>
        </nav>
    )
}