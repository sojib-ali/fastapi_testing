import Link from "next/link";
import styles from "./postitem.module.css";
import { Post } from "@/util/types/posts";



export default function PostItem({ post }: { post: Post }) {
    const initials = post.author
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <article className={styles.card}>
            <div className={styles.header}>
                <div className={styles.avatar}>{initials}</div>
                <div className={styles.meta}>
                    <Link href="#">{post.author}</Link>
                    <span className={styles.date}>{post.date_posted}</span>
                </div>
            </div>
            <h2 className={styles.title}>
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <p className={styles.content}>{post.content}</p>
        </article>
    )
}