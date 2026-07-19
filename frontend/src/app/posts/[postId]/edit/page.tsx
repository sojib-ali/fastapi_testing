'use client'

import PostForm from "@/components/postform/PostForm";
import usePost from "@/util/query-hooks/usePost";
import useUpdatePost from "@/util/query-hooks/useUpdatePost"
import useRequireAuth from "@/util/query-hooks/useRequireAuth";
import { useParams, useRouter } from "next/navigation";

export default function EditPostPage() {
    const params = useParams();
    const postId = Number(params.postId);
    const router = useRouter();

    const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
    const { data: post, isLoading, isError } = usePost(postId);

    const { mutate, isPending } = useUpdatePost();

    if (authLoading || !isAuthenticated)
        return <div>Loading...</div>

    if (isLoading)
        return <div> Loading form.... </div>

    if (isError || !post)
        return <div>Failed to load post</div>

    return (
        <div>
            <h2>Edit post</h2>
            <PostForm
                initialData={{ title: post.title, content: post.content }}
                onSubmit={(data) => {
                    mutate({ id: postId, postData: data }, {
                        onSuccess: () => {
                            router.push(`/posts/${postId}`);
                        }
                    })
                }}
                isLoading={isPending}
            />
        </div>
    )
}