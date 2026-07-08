import styles from "./sidebar.module.css";

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.card}>
                <h2 className={styles.title}>Our sidebar</h2>
                <p className={styles.description}>You can put any information here you&apos;d like</p>
                <ul className={styles.list}>
                    <li>Latest Posts</li>
                    <li>Announcements</li>
                    <li>Calenders</li>
                    <li>etc</li>
                </ul>
            </div>
        </aside>
    )
}