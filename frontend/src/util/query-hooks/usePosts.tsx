'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../http";
import { Post } from "../types/posts";

export default function usePosts() {
    const queryResult = useQuery<Post[]>({
        queryKey: ["posts"],
        queryFn: fetchPosts,
    });

    return queryResult;
}