import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    await api.post("/posts", { imageUrl, caption });
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Create Post</h2>
      <input placeholder="Image URL" onChange={e => setImageUrl(e.target.value)} />
      <textarea placeholder="Caption" onChange={e => setCaption(e.target.value)} />
      <button onClick={submit}>Post</button>
    </div>
  );
};

export default CreatePost;
