// src/query-hooks/useAuthHooks.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, registerUser } from "@/util/authApi";

import { useRouter } from "next/navigation";

export function useLogin() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            // Tell React Query to refetch the "authUser" so our AuthContext updates!
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            router.push("/"); // Redirect to home page
        },
    });
}

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            // Usually, we redirect them to login after successful registration
            router.push("/login");
        },
    });
}




export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            // Clear the user from React Query cache
            queryClient.setQueryData(["authUser"], null);
        }
    });
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: (email: string) =>
            import("@/util/authApi").then(mod => mod.forgotPassword(email)),
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: (data: { token: string; new_password: string }) =>
            import("@/util/authApi").then(mod => mod.resetPassword(data)),
    });
}

