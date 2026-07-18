// src/app/register/page.tsx
"use client";

import { useRegister } from "@/util/query-hooks/useAuthHooks";
import { useForm } from "react-hook-form";


export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Destructure our custom hook!
    const { mutate: registerAccount, isPending, error } = useRegister();

    const onSubmit = (data: any) => {
        registerAccount(data);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
            <h2>Create an Account</h2>
            {error && <p style={{ color: "red" }}>{error.message}</p>}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        {...register("username", { required: "Username is required" })}
                        style={{ width: "100%", padding: "8px" }}
                    />
                    {errors.username && <span style={{ color: "red" }}>{errors.username.message as string}</span>}
                </div>

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
                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                        style={{ width: "100%", padding: "8px" }}
                    />
                    {errors.password && <span style={{ color: "red" }}>{errors.password.message as string}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    style={{ padding: "10px", backgroundColor: "#0070f3", color: "white", border: "none", cursor: "pointer" }}
                >
                    {isPending ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}
