import { useState } from "react";
import { createComment } from "../services/api";

const CommentForm = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      await createComment(token, postId, text);
      setText("");
      setError(null);
      onCommentAdded();
    } catch (err) {
      setError("Failed to create comment.");
      console.error(err);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} class="flex flex-row items-center mt-2">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          placeholder="Add a comment..."
          class="flex-grow bg-gray-200 rounded-full border-gray-500 border-2 p-2 "
          required
        />
        <button
          type="submit"
          class="bg-[#008FE7] text-white font-bold text-lg rounded-full p-2 m-2 cursor-pointer"
        >
          Comment
        </button>
        {error && <p class="text-red-500">{error}</p>}
      </form>
    </>
  );
};

export default CommentForm;
