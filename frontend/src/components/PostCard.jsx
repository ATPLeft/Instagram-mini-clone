import styles from "../styles/post.module.css";
import LikeButton from "./LikeButton";

export default function PostCard({ post }) {
  return (
    <div className="card">
      <div className={styles.postHeader}>{post.User.username}</div>
      <img src={post.imageUrl} className={styles.postImage} />
      <div className={styles.postBody}>
        <p>{post.caption}</p>
        <LikeButton postId={post.id} />
      </div>
    </div>
  );
}
