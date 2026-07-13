'use client'

import PostForm from "@/components/postform/PostForm"
import useCreatepost from "@/util/query-hooks/useCreatePost";
import { useRouter } from "next/navigation"


export default function NewPostPage() {
    const router = useRouter();
    const { mutate, isPending } = useCreatepost();



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