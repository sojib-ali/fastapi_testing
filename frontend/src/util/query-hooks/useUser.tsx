'use client';

import { useQuery } from "@tanstack/react-query";
import { getUser } from "../authApi";

export default function useUser(userId: number) {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId),
        enabled: !!userId,
    });
}
