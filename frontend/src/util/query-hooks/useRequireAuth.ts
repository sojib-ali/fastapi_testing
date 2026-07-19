// src/util/query-hooks/useRequireAuth.ts
// Reusable hook for protected pages.
// Drop this into any page that requires login — it handles the redirect for you.

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useRequireAuth() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait until loading is done before deciding
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    return { user, isAuthenticated, isLoading };
}
