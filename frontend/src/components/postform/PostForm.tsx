'use client'
import { FormData } from '@/util/types/formdata';
import { useForm } from 'react-hook-form';
import styles from './postform.module.css';

export default function PostForm({ initialData, onSubmit, isLoading }: {
    initialData?: FormData,
    onSubmit: (data: FormData) => void,
    isLoading: boolean
}) {
    // If initialData is passed, it pre-fills. Otherwise it's blank.
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: initialData || { title: "", content: "", user_id: 1 }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <input className={styles.input} {...register("title", { required: "Title is required" })} />
                {errors.title && <span className={styles.error}>{errors.title.message}</span>}
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Content</label>
                <textarea className={styles.textarea} {...register("content", { required: "content is required" })} />
                {errors.content && <span className={styles.error}>{errors.content.message}</span>}
            </div>

            <div className={styles.field}>
                <label className={styles.label}>User ID</label>
                <input type="number" className={styles.input} {...register("user_id", { valueAsNumber: true, required: "User ID is required" })} />
                {errors.user_id && <span className={styles.error}>{errors.user_id.message}</span>}
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                {isLoading ? "Saving..." : "Save Post"}
            </button>
        </form>
    );
}
