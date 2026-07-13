import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createPost } from "../http";
import { FormData } from "../types/formdata";
import { Post } from "../types/posts";


export default function useCreatepost() {
    const queryClient = useQueryClient();


    const queryResult = useMutation<Post, Error, FormData>({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        }
    });

    return queryResult;

}