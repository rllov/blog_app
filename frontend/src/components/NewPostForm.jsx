import { useState } from "react";
import { createPost } from "../services/api";
import { FcStackOfPhotos } from "react-icons/fc";

const NewPostForm = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      await createPost(token, formData);
      setText("");
      setImage(null);
      setError(null);
      onPostCreated(); // Refresh posts
    } catch (err) {
      setError("Failed to create post.", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      class=" w-full bg-white rounded-2xl border-gray-500 border-2 m-3 justify-center items-center flex flex-col"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        class="w-[90%] resize-y min-h-16 h-16 bg-gray-200 rounded-4xl border-gray-500 border-2 m-4 p-4 justify-center items-center self-center"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent default Enter key behavior
            handleSubmit(e); // Submit the form
          }
        }}
        required
      />

      <div class="flex flex-row justify-center items-center">
        <label
          for="image-upload"
          class="bg-[#008FE7] text-white font-bold text-lg rounded-[8px] p-2 m-2 cursor-pointer flex items-center"
        >
          <FcStackOfPhotos size={28} />
          Upload Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          class="w-fit text-center hidden"
        />
        {image && <p>Selected Image: {image.name}</p>}
        <button
          type="submit"
          class="text-white font-bold text-lg bg-[#008FE7] rounded-[8px] p-2 m-2 cursor-pointer"
        >
          Post
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default NewPostForm;
