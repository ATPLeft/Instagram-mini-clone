import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import LikeButton from "../components/LikeButton";
import CommentBox from "../components/CommentBox";
import styles from "../styles/post.module.css";
import layout from "../styles/layout.module.css";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`).then(res => setPost(res.data));
  }, [id]);

  if (!post) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className={layout.container}>
      <div className={layout.card}>
        <div className={styles.postHeader}>
          {post.User.username}
        </div>

        <img
          src={post.imageUrl}
          alt="post"
          className={styles.postImage}
        />

        <div className={styles.postBody}>
          <p>{post.caption}</p>
          <LikeButton postId={post.id} />
        </div>

        <div className={styles.postBody}>
          <h4>Comments</h4>
          {post.Comments?.map(c => (
            <p key={c.id}>
              <strong>{c.User.username}:</strong> {c.text}
            </p>
          ))}
          <CommentBox postId={post.id} />
        </div>
      </div>
    </div>
  );
}
