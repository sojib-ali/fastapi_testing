"use client";

import { useLogout } from "@/util/query-hooks/useAuthHooks";
import useRequireAuth from "@/util/query-hooks/useRequireAuth";
import { useUpdateUser, useDeleteUser, useUploadProfilePicture, useDeleteProfilePicture, useChangePassword } from "@/util/query-hooks/useUserSettings";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./profile.module.css";
import { getMediaUrl } from "@/util/mediaUrl";

type ProfileFormData = {
    username: string;
    email: string;
};

type PasswordFormData = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};

export default function ProfilePage() {
    const { user, isLoading: authLoading, isAuthenticated } = useRequireAuth();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const { mutate: updateUser, isPending: isUpdating, error: updateError, isSuccess: updateSuccess } = useUpdateUser();
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
    const { mutate: uploadPicture, isPending: isUploading, error: uploadError } = useUploadProfilePicture();
    const { mutate: deletePicture, isPending: isDeletingPicture } = useDeleteProfilePicture();
    const { mutate: changePassword, isPending: isChangingPassword, error: changePasswordError, isSuccess: changePasswordSuccess } = useChangePassword();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Image upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>();
    
    const { 
        register: registerPassword, 
        handleSubmit: handleSubmitPassword, 
        reset: resetPasswordForm, 
        formState: { errors: errorsPassword } 
    } = useForm<PasswordFormData>();

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

    const onPasswordSubmit = (data: PasswordFormData) => {
        if (data.new_password !== data.confirm_password) {
            return;
        }
        changePassword({ 
            current_password: data.current_password, 
            new_password: data.new_password 
        }, {
            onSuccess: () => {
                resetPasswordForm();
            }
        });
    };

    const handleDeleteAccount = () => {
        deleteUser(user.id);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPreviewUrl(null);
            setSelectedFile(null);
            return;
        }
        setSelectedFile(file);
        // Generate a local preview URL using FileReader (no upload yet)
        const reader = new FileReader();
        reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleUpload = () => {
        if (!selectedFile) return;
        uploadPicture(
            { userId: user.id, file: selectedFile },
            {
                onSuccess: () => {
                    // Reset the file input after successful upload
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                },
            }
        );
    };

    const handleDeletePicture = () => {
        deletePicture(user.id);
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

                {/* ── Profile Picture ── */}
                <section className={styles.section}>
                    <h4 className={styles.sectionTitle}>Profile Picture</h4>

                    {/* Live preview — shown as soon as a file is selected */}
                    {previewUrl && (
                        <div className={styles.previewWrapper}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className={styles.previewImg}
                            />
                            <span className={styles.previewLabel}>Preview</span>
                        </div>
                    )}

                    <div className={styles.uploadRow}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className={styles.fileInput}
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            className={styles.btnPrimary}
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>

                    <p className={styles.muted} style={{ marginTop: "8px" }}>
                        Max 5 MB · JPEG, PNG, GIF, WebP
                    </p>

                    {uploadError && (
                        <p className={styles.errorMsg}>{uploadError.message}</p>
                    )}

                    {/* Only show remove button if user currently has a custom picture */}
                    {user.image_file && (
                        <button
                            type="button"
                            className={styles.btnDanger}
                            onClick={handleDeletePicture}
                            disabled={isDeletingPicture}
                            style={{ marginTop: "12px" }}
                        >
                            {isDeletingPicture ? "Removing..." : "Remove Picture"}
                        </button>
                    )}
                </section>

                <div className={styles.divider} />

                {/* ── Change Password ── */}
                <section className={styles.section}>
                    <h4 className={styles.sectionTitle}>Change Password</h4>
                    <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label}>Current Password</label>
                            <input 
                                type="password" 
                                className={styles.input} 
                                {...registerPassword("current_password", { required: "Current password is required" })}
                                placeholder="••••••••" 
                            />
                            {errorsPassword.current_password && <span className={styles.error}>{errorsPassword.current_password.message}</span>}
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>New Password</label>
                            <input 
                                type="password" 
                                className={styles.input} 
                                {...registerPassword("new_password", { 
                                    required: "New password is required",
                                    minLength: { value: 8, message: "Must be at least 8 characters" }
                                })}
                                placeholder="••••••••" 
                            />
                            {errorsPassword.new_password && <span className={styles.error}>{errorsPassword.new_password.message}</span>}
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Confirm New Password</label>
                            <input 
                                type="password" 
                                className={styles.input} 
                                {...registerPassword("confirm_password", { 
                                    required: "Confirm your new password",
                                    validate: (val, formValues) => val === formValues.new_password || "Passwords do not match"
                                })}
                                placeholder="••••••••" 
                            />
                            {errorsPassword.confirm_password && <span className={styles.error}>{errorsPassword.confirm_password.message}</span>}
                        </div>
                        {changePasswordError && <p className={styles.errorMsg}>{changePasswordError.message}</p>}
                        {changePasswordSuccess && <p className={styles.successMsg}>Password changed successfully!</p>}
                        <button type="submit" className={styles.btnPrimary} disabled={isChangingPassword}>
                            {isChangingPassword ? "Changing..." : "Change Password"}
                        </button>
                    </form>
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
