import PostItem from "../postitem/PostItem";
import styles from "./postlist.module.css";

const posts = [
    {
        id: 1,
        author: "Sojib",
        title: "FastAPI is Awesome",
        content: "This framework is really easy to use and super fast",
        date_posted: "April 20, 2025",
    },
    {
        id: 2,
        author: "Jane Doe",
        title: "Javascript sucks",
        content: "Nothing to do",
        date_posted: "April 21, 2025",
    },
];

export default function PostList() {
    return (
        <div className={styles.list}>
            {posts.map((post) => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    )
}