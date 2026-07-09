import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "../http";
import { Post } from "../types/posts";

export default function usePost(postId: number) {
    const queryResult = useQuery<Post, Error>({
        queryKey: ["post", postId],
        queryFn: ({ signal }) => fetchPost({ signal, id: postId }),
    });

    return queryResult;
}