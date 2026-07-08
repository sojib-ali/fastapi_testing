import Navbar from "@/components/navbar/Navbar";
import PostList from "@/components/postlist/PostList";
import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={styles.mainLayout}>
        <PostList />
        <Sidebar />
      </div>

      <footer className={styles.footer}>
        © 2026 Sojib
      </footer>
    </>
  );
}
