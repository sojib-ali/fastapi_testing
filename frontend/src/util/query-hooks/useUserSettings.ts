// src/util/query-hooks/useUserSettings.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, deleteUser } from "@/util/authApi";
import { useRouter } from "next/navigation";
import { useLogout } from "./useAuthHooks";

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: number; data: { username?: string; email?: string } }) =>
            updateUser(userId, data),
        onSuccess: (updatedUser) => {
            // Update the cached user in AuthContext immediately — no need to refetch!
            queryClient.setQueryData(["authUser"], updatedUser);
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { mutate: logout } = useLogout();

    return useMutation({
        mutationFn: (userId: number) => deleteUser(userId),
        onSuccess: () => {
            // Clear everything and redirect to home
            queryClient.clear();
            router.push("/");
        },
    });
}
