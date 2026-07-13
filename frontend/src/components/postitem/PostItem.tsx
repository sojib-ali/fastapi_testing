'use client'

import Link from "next/link";
import styles from "./postitem.module.css";
import { Post } from "@/util/types/posts";
import useDeletePost from "@/util/query-hooks/useDeletePost";
import { useRouter } from "next/navigation";



export default function PostItem({ post }: { post: Post }) {
    const initials = post.author.username
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    const router = useRouter();
    const { mutate, isPending } = useDeletePost();

    return (
        <article className={styles.card}>
            <div className={styles.header}>
                <div className={styles.avatar}>{initials}</div>
                <div className={styles.meta}>
                    <Link href="#">{post.author.username}</Link>
                    <span className={styles.date}>{post.date_posted}</span>
                </div>
            </div>
            <h2 className={styles.title}>
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <p className={styles.content}>{post.content}</p>
            <div className={styles.actions}>
                <button
                    className={`${styles.btnAction} ${styles.btnEdit}`}
                    onClick={() => router.push(`/posts/${post.id}/edit`)}
                >
                    Edit Post
                </button>
                <button
                    className={`${styles.btnAction} ${styles.btnDelete}`}
                    onClick={() => mutate(
                        post.id, {
                        onSuccess: () => {
                            router.push("/");
                        }
                    }
                    )}
                    disabled={isPending}

                >{isPending ? "Deleting.." : "Delete Post"}</button>
            </div>
        </article>
    )
}