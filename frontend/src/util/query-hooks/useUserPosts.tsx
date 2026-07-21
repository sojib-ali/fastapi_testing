'use client';

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserPosts } from "../http";
import { PaginatedPostsResponse } from "../types/posts";

export default function useUserPosts(userId: number) {
    return useInfiniteQuery<PaginatedPostsResponse>({
        queryKey: ["posts", "user", userId],
        queryFn: ({ pageParam = 0 }) => fetchUserPosts({ userId, pageParam: pageParam as number }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.has_more) {
                return lastPage.skip + lastPage.limit;
            }
            return undefined; // No more pages
        },
    });
}
