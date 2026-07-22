'use client';

import { useResetPassword } from "@/util/query-hooks/useAuthHooks";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

// The referrer policy is handled safely in layout.tsx

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { mutate: resetPassword, isPending, isSuccess, error } = useResetPassword();
    
    const [tokenError, setTokenError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setTokenError("Invalid or missing reset token. Please request a new password reset.");
        }
    }, [token]);

    const onSubmit = (data: any) => {
        if (!token) return;
        
        resetPassword({
            token: token,
            new_password: data.new_password
        });
    };

    if (tokenError) {
        return (
            <div style={{ maxWidth: "450px", margin: "50px auto", padding: "30px", backgroundColor: "#1a202c", borderRadius: "10px", border: "1px solid #2d3748" }}>
                <h2 style={{ marginBottom: "20px", color: "white" }}>Reset Password</h2>
                <div style={{ backgroundColor: "#e53e3e44", color: "#fc8181", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #e53e3e" }}>
                    {tokenError}
                </div>
                <p style={{ marginTop: "20px", color: "#a0aec0", textAlign: "center", fontSize: "0.95rem" }}>
                    <Link href="/forgot-password" style={{ color: "#4f46e5", textDecoration: "none" }}>Request a new reset link</Link>
                </p>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div style={{ maxWidth: "450px", margin: "50px auto", padding: "30px", backgroundColor: "#1a202c", borderRadius: "10px", border: "1px solid #2d3748", textAlign: "center" }}>
                <h2 style={{ marginBottom: "20px", color: "white" }}>Password Reset Complete</h2>
                <div style={{ backgroundColor: "#2f855a44", color: "#68d391", padding: "20px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #2f855a" }}>
                    Your password has been reset successfully! You can now log in with your new password.
                </div>
                <Link 
                    href="/login" 
                    style={{ 
                        display: "inline-block",
                        padding: "12px 24px", 
                        backgroundColor: "#4f46e5", 
                        color: "white", 
                        textDecoration: "none", 
                        borderRadius: "6px",
                        fontWeight: "600"
                    }}
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "450px", margin: "50px auto", padding: "30px", backgroundColor: "#1a202c", borderRadius: "10px", border: "1px solid #2d3748" }}>
            <h2 style={{ marginBottom: "10px", color: "white" }}>Reset Password</h2>
            <p style={{ color: "#a0aec0", marginBottom: "20px" }}>
                Enter your new password below.
            </p>

            {error && (
                <div style={{ backgroundColor: "#e53e3e44", color: "#fc8181", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #e53e3e" }}>
                    {error.message || "Something went wrong. Please try again."}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", color: "#cbd5e0" }}>New Password</label>
                    <input
                        type="password"
                        {...register("new_password", { 
                            required: "New password is required",
                            minLength: { value: 8, message: "Password must be at least 8 characters" }
                        })}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #4a5568", backgroundColor: "#2d3748", color: "white" }}
                        autoFocus
                    />
                    {errors.new_password && <span style={{ color: "#fc8181", fontSize: "0.85rem", marginTop: "5px", display: "block" }}>{errors.new_password.message as string}</span>}
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px", color: "#cbd5e0" }}>Confirm New Password</label>
                    <input
                        type="password"
                        {...register("confirm_password", { 
                            required: "Please confirm your new password",
                            validate: (val) => {
                                if (watch('new_password') != val) {
                                    return "Passwords do not match";
                                }
                            }
                        })}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #4a5568", backgroundColor: "#2d3748", color: "white" }}
                    />
                    {errors.confirm_password && <span style={{ color: "#fc8181", fontSize: "0.85rem", marginTop: "5px", display: "block" }}>{errors.confirm_password.message as string}</span>}
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
                    {isPending ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
