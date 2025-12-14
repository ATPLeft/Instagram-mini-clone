import api from "../api/axios";
import { useState } from "react";

export default function CommentBox({ postId }) {
  const [text, setText] = useState("");

  const submit = async () => {
    await api.post(`/posts/${postId}/comment`, { text });
    setText("");
  };

  return (
    <>
      <input placeholder="Add comment..." onChange={e => setText(e.target.value)} />
      <button onClick={submit}>Post</button>
    </>
  );
}
