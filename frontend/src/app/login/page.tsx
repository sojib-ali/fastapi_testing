// src/app/login/page.tsx
"use client";

import { useLogin } from "@/util/query-hooks/useAuthHooks";
import { useForm } from "react-hook-form";


export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Destructure our custom hook!
    const { mutate: login, isPending, error } = useLogin();

    const onSubmit = (data: any) => {
        login(data);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
            <h2>Login</h2>
            {/* If the mutation threw an error, it will be available here */}
            {error && <p style={{ color: "red" }}>{error.message}</p>}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        style={{ width: "100%", padding: "8px" }}
                    />
                    {errors.email && <span style={{ color: "red" }}>{errors.email.message as string}</span>}
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        {...register("password", { required: "Password is required" })}
                        style={{ width: "100%", padding: "8px" }}
                    />
                    {errors.password && <span style={{ color: "red" }}>{errors.password.message as string}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    style={{ padding: "10px", backgroundColor: "#0070f3", color: "white", border: "none", cursor: "pointer" }}
                >
                    {isPending ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
