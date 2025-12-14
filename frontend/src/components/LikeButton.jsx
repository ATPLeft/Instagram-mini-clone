import api from "../api/axios";
import { useState } from "react";

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);

  const toggleLike = async () => {
    await api.post(`/posts/${postId}/${liked ? "unlike" : "like"}`);
    setLiked(!liked);
  };

  return <button onClick={toggleLike}>{liked ? "♥ Liked" : "♡ Like"}</button>;
}
