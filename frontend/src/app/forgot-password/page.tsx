'use client';

import { useForgotPassword } from "@/util/query-hooks/useAuthHooks";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ email: string }>();
    const { mutate: forgotPassword, isPending, isSuccess, error } = useForgotPassword();

    const onSubmit = (data: { email: string }) => {
        forgotPassword(data.email, {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <div style={{ maxWidth: "450px", margin: "50px auto", padding: "30px", backgroundColor: "#1a202c", borderRadius: "10px", border: "1px solid #2d3748" }}>
            <h2 style={{ marginBottom: "10px", color: "white" }}>Forgot Password</h2>
            <p style={{ color: "#a0aec0", marginBottom: "20px" }}>
                Enter your email address and we'll send you a link to reset your password.
            </p>

            {isSuccess && (
                <div style={{ backgroundColor: "#2f855a44", color: "#68d391", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #2f855a" }}>
                    If an account exists with this email, you will receive password reset instructions shortly.
                </div>
            )}

            {error && (
                <div style={{ backgroundColor: "#e53e3e44", color: "#fc8181", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #e53e3e" }}>
                    {error.message || "Something went wrong. Please try again."}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", color: "#cbd5e0" }}>Email</label>
                    <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #4a5568", backgroundColor: "#2d3748", color: "white" }}
                        autoFocus
                    />
                    {errors.email && <span style={{ color: "#fc8181", fontSize: "0.85rem", marginTop: "5px", display: "block" }}>{errors.email.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    style={{ 
                        padding: "12px", 
                        backgroundColor: "#4f46e5", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "6px", 
                        cursor: isPending ? "not-allowed" : "pointer",
                        fontWeight: "600",
                        marginTop: "10px",
                        opacity: isPending ? 0.7 : 1
                    }}
                >
                    {isPending ? "Sending..." : "Send Reset Link"}
                </button>
            </form>

            <p style={{ marginTop: "20px", color: "#a0aec0", textAlign: "center", fontSize: "0.95rem" }}>
                Remember your password? <Link href="/login" style={{ color: "#4f46e5", textDecoration: "none" }}>Login here</Link>
            </p>
        </div>
    );
}
