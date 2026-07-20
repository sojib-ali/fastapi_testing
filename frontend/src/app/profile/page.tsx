"use client";

import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/util/query-hooks/useAuthHooks";
import useRequireAuth from "@/util/query-hooks/useRequireAuth";
import { useUpdateUser, useDeleteUser } from "@/util/query-hooks/useUserSettings";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./profile.module.css";
import { getMediaUrl } from "@/util/mediaUrl";

type ProfileFormData = {
    username: string;
    email: string;
};

export default function ProfilePage() {
    const { user, isLoading: authLoading, isAuthenticated } = useRequireAuth();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const { mutate: updateUser, isPending: isUpdating, error: updateError, isSuccess: updateSuccess } = useUpdateUser();
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>();

    // Pre-fill the form once user data is available
    useEffect(() => {
        if (user) {
            reset({ username: user.username, email: user.email });
        }
    }, [user, reset]);

    if (authLoading || !isAuthenticated || !user) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const onSubmit = (data: ProfileFormData) => {
        updateUser({ userId: user.id, data });
    };

    const handleDeleteAccount = () => {
        deleteUser(user.id);
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h2 className={styles.pageTitle}>Account Settings</h2>

                {/* ── Profile Header ── */}
                <div className={styles.profileHeader}>
                    <div className={styles.avatarWrapper}>
                        {user.image_path ? (
                            <img
                                src={getMediaUrl(user.image_path)}
                                alt={`${user.username}'s profile picture`}
                                className={styles.avatarImg}
                                onError={(e) => {
                                    // If image fails to load, hide it and show initials fallback
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.nextElementSibling?.removeAttribute("style");
                                }}
                            />
                        ) : null}
                        <div
                            className={styles.avatarInitials}
                            style={user.image_path ? { display: "none" } : undefined}
                        >
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <h3 className={styles.displayName}>{user.username}</h3>
                        <p className={styles.displayEmail}>{user.email}</p>
                        <span className={styles.badge}>ID #{user.id}</span>
                    </div>
                </div>

                <div className={styles.divider} />

                {/* ── Update Profile Form ── */}
                <section className={styles.section}>
                    <h4 className={styles.sectionTitle}>Update Profile</h4>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label}>Username</label>
                            <input
                                className={styles.input}
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: { value: 1, message: "Too short" },
                                    maxLength: { value: 50, message: "Max 50 characters" },
                                })}
                            />
                            {errors.username && <span className={styles.error}>{errors.username.message}</span>}
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input
                                className={styles.input}
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                })}
                            />
                            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                        </div>
                        {updateError && <p className={styles.errorMsg}>{updateError.message}</p>}
                        {updateSuccess && <p className={styles.successMsg}>Profile updated successfully!</p>}
                        <button type="submit" disabled={isUpdating} className={styles.btnPrimary}>
                            {isUpdating ? "Saving..." : "Update Profile"}
                        </button>
                    </form>
                </section>

                <div className={styles.divider} />

                {/* ── Profile Picture (Placeholder) ── */}
                <section className={styles.section}>
                    <h4 className={styles.sectionTitle}>Profile Picture</h4>
                    <p className={styles.muted}>File upload coming in a future update.</p>
                    <input type="file" className={styles.input} disabled />
                </section>

                <div className={styles.divider} />

                {/* ── Change Password (Placeholder) ── */}
                <section className={styles.section}>
                    <h4 className={styles.sectionTitle}>Change Password</h4>
                    <p className={styles.muted}>Password reset coming in a future update.</p>
                    <div className={styles.field}>
                        <label className={styles.label}>Current Password</label>
                        <input type="password" className={styles.input} disabled placeholder="••••••••" />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>New Password</label>
                        <input type="password" className={styles.input} disabled placeholder="••••••••" />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Confirm New Password</label>
                        <input type="password" className={styles.input} disabled placeholder="••••••••" />
                    </div>
                    <button className={styles.btnPrimary} disabled>Change Password</button>
                </section>

                <div className={styles.divider} />

                {/* ── Logout ── */}
                <section className={styles.section}>
                    <button
                        onClick={() => logout()}
                        disabled={isLoggingOut}
                        className={styles.btnSecondary}
                    >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                </section>

                <div className={styles.divider} />

                {/* ── Danger Zone ── */}
                <section className={styles.section}>
                    <h4 className={styles.dangerTitle}>Danger Zone</h4>
                    <p className={styles.muted}>
                        Once you delete your account, there is no going back. All your posts will also be deleted.
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className={styles.btnDanger}
                    >
                        Delete Account
                    </button>
                </section>
            </div>

            {/* ── Delete Confirmation Modal ── */}
            {showDeleteModal && (
                <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h5>Delete Account?</h5>
                            <button className={styles.modalClose} onClick={() => setShowDeleteModal(false)}>✕</button>
                        </div>
                        <div className={styles.modalBody}>
                            <p>
                                Are you sure you want to delete your account? This action <strong>cannot be undone</strong>.
                                All your posts will be permanently deleted.
                            </p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowDeleteModal(false)} className={styles.btnSecondary}>
                                Cancel
                            </button>
                            <button onClick={handleDeleteAccount} disabled={isDeleting} className={styles.btnDanger}>
                                {isDeleting ? "Deleting..." : "Delete Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
