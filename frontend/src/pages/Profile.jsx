import { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import styles from "../styles/profile.module.css";
import layout from "../styles/layout.module.css";

export default function Profile() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts/feed").then(res => setPosts(res.data));
  }, []);

  return (
    <div className={layout.container}>
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <h2>My Profile</h2>
          <div className={styles.stats}>
            <span>Posts: {posts.length}</span>
            <span>Followers: —</span>
            <span>Following: —</span>
          </div>
        </div>
        <button className={styles.followButtonSecondary}>
          Edit Profile
        </button>
      </div>

      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
