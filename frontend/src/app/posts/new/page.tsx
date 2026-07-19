'use client'

import PostForm from "@/components/postform/PostForm"
import useCreatepost from "@/util/query-hooks/useCreatePost";
import useRequireAuth from "@/util/query-hooks/useRequireAuth";
import { useRouter } from "next/navigation"


export default function NewPostPage() {
    const router = useRouter();
    const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
    const { mutate, isPending } = useCreatepost();

    // Show loading while auth is being checked
    if (authLoading || !isAuthenticated) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2> create a new post </h2>
            <PostForm
                onSubmit={(data) => {
                    mutate(data, {
                        onSuccess: () => {
                            router.push("/");
                        },
                        onError: (error) => {
                            console.error("Error adding post:", error);
                        }
                    })
                }}
                isLoading={isPending}
            />
        </div>
    )
}