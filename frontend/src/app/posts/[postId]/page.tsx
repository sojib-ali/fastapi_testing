'use client'

import PostItem from "@/components/postitem/PostItem";
import usePost from "@/util/query-hooks/usePost";
import { useParams } from "next/navigation";

export default function Post() {
    const params = useParams();
    const postId = Number(params.postId);

    const { data: post, isLoading, isError, error } = usePost(postId)

    if (isLoading) {
        return (
            <div style={{ padding: "3rem", textAlign: "center", color: "#a0aec0" }}>
                <p>Loading post...</p>
            </div>
        );
    }
    if (isError) {
        return (
            <div style={{ padding: "3rem", textAlign: "center", color: "#fc8181" }}>
                <h3>Error</h3>
                <p>{error?.message || "Failed to fetch post."}</p>
            </div>
        );
    }
    if (!post) {
        return <div style={{ padding: "3rem", textAlign: "center", color: "#a0aec0" }}>Post not found</div>;
    }

    return (
        <PostItem post={post} />
    )
}