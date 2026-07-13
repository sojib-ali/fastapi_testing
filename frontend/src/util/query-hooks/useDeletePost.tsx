import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../http";


export default function useDeletePost() {
    const queryClient = useQueryClient();

    const queryResult = useMutation({
        mutationFn: (postId: number) => deletePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        }
    });

    return queryResult;
}