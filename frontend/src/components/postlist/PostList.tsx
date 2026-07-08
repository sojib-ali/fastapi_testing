'use client'

import usePosts from "@/util/query-hooks/usePosts";
import PostItem from "../postitem/PostItem";
import styles from "./postlist.module.css";



export default function PostList() {
    const { data: posts = [], isLoading, isError, error } = usePosts();

    if (isLoading) {
        return (
            <div className={styles.list}>
                <div className={styles.status}>
                    <div className={styles.spinner}></div>
                    <p>Loading posts...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.list}>
                <div className={styles.error}>
                    <h3>Something went wrong</h3>
                    <p>{error?.message || "Failed to fetch posts. Please try again later."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.list}>
            {posts.map((post) => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    )
}