'use client'

import usePosts from "@/util/query-hooks/usePosts";
import PostItem from "../postitem/PostItem";
import styles from "./postlist.module.css";
import Link from "next/link";



export default function PostList() {
    const { 
        data, 
        isLoading, 
        isError, 
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = usePosts();

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
            {data?.pages.map((page, i) => (
                <div key={i}>
                    {page.posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
            ))}
            
            {hasNextPage && (
                <div className={styles.loadMoreContainer} style={{ textAlign: "center", margin: "20px 0" }}>
                    <button 
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#4f46e5",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: isFetchingNextPage ? "not-allowed" : "pointer",
                            opacity: isFetchingNextPage ? 0.7 : 1
                        }}
                    >
                        {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    )
}