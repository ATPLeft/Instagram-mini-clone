import { useEffect, useState } from "react";
import api from "../api/axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts/feed").then(res => setPosts(res.data));
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      {posts.map(p => (
        <div key={p.id} style={styles.card}>
          <h4>{p.User.username}</h4>
          <img src={p.imageUrl} width="100%" />
          <p>{p.caption}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  card: { border: "1px solid #ddd", padding: 10, marginBottom: 20 }
};

export default Feed;
