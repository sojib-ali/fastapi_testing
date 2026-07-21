'use client'

import Link from "next/link";
import styles from "./postitem.module.css";
import { Post } from "@/util/types/posts";
import useDeletePost from "@/util/query-hooks/useDeletePost";
import { useRouter } from "next/navigation";
import { getMediaUrl } from "@/util/mediaUrl";

export default function PostItem({ post }: { post: Post }) {
    const initial = post.author.username.charAt(0).toUpperCase();
    const router = useRouter();
    const { mutate, isPending } = useDeletePost();

    return (
        <article className={styles.card}>
            <div className={styles.header}>
                <Link href={`/user/${post.author.id}`} className={styles.avatarWrapper}>
                    {post.author.image_path && (
                        <img
                            src={getMediaUrl(post.author.image_path)}
                            alt={post.author.username}
                            className={styles.avatarImg}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.removeAttribute("style");
                            }}
                        />
                    )}
                    <div
                        className={styles.avatar}
                        style={post.author.image_path ? { display: "none" } : undefined}
                    >
                        {initial}
                    </div>
                </Link>
                <div className={styles.meta}>
                    <Link href={`/user/${post.author.id}`}>{post.author.username}</Link>
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