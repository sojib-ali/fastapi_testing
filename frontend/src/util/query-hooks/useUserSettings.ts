// src/util/query-hooks/useUserSettings.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, deleteUser, uploadProfilePicture, deleteProfilePicture } from "@/util/authApi";
import { useRouter } from "next/navigation";

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

    return useMutation({
        mutationFn: (userId: number) => deleteUser(userId),
        onSuccess: () => {
            queryClient.clear();
            router.push("/");
        },
    });
}

export function useUploadProfilePicture() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, file }: { userId: number; file: File }) =>
            uploadProfilePicture(userId, file),
        onSuccess: (updatedUser) => {
            // Instantly update the avatar everywhere — navbar, profile header, post cards
            queryClient.setQueryData(["authUser"], updatedUser);
        },
    });
}

export function useDeleteProfilePicture() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => deleteProfilePicture(userId),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["authUser"], updatedUser);
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: { current_password: string; new_password: string }) =>
            import("@/util/authApi").then(mod => mod.changePassword(data)),
    });
}
