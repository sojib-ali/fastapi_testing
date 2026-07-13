import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../http";
import PostForm from "@/components/postform/PostForm";

export default function useUpdatePost() {
    const queryClient = useQueryClient();

    const queryResult = useMutation({
        mutationFn: ({ id, postData }: { id: number, postData: any }) => updatePost({ id, postData }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts', variables.id] });
        }
    })

    return queryResult;
}