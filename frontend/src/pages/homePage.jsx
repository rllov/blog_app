import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts, fetchProtectedHome } from "../services/api";
import NewPostForm from "../components/NewPostForm";
const HomePage = () => {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handlePostCreated = () => {
    const token = localStorage.getItem("access_token");
    fetchPosts(token).then(setPosts);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You are not logged in. Please log in to access this page.");
      navigate("/login");
      return;
    }

    fetchProtectedHome(token)
      .then((data) => setMessage(data.message || "Welcome!"))
      .then(() => {
        return fetchPosts(token).then(setPosts);
      })
      .catch(() => {
        setError("Failed to fetch protected home data. Please try again.");
        navigate("/login");
      });

    //set up interval to fetch posts every second
    // const interval = setInterval(() => {
    //   fetchPosts(token)
    //     .then((data) => setPosts(data))
    //     .catch((err) => {
    //       console.error("Error fetching posts:", err);
    //       setError("Failed to fetch posts. Please try again.");
    //     });
    // }, 1000);
    // return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div>
      <h1>Backend Connection Test</h1>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <p>Backend says: {message || "Loading..."}</p>
      )}
      <div class="justify-center items-center flex flex-col">
        <NewPostForm onPostCreated={handlePostCreated} />
        {posts.map((post) => (
          <>
            <div class="p-4 border-b-2 border-gray-500 text-left w-screen m-4 flex flex-col justify-between items-start">
              <div key={post.post_id} class="w-fit">
                <div class="pb-4">
                  <strong>{post.username}</strong>: {post.text}
                </div>
                {post.image_filename && (
                  <div>
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL || "http://localhost:8000"
                      }/images/${post.image_filename}`}
                      alt="post"
                      style={{ maxWidth: "200px" }}
                      onClick={() => {
                        window.open(
                          `${
                            import.meta.env.VITE_API_URL ||
                            "http://localhost:8000"
                          }/images/${post.image_filename}`,
                          "_blank"
                        );
                      }}
                    />
                  </div>
                )}
              </div>
              <div class="flex flex-col justify-center text-sm">
                <div>
                  <p class=" ">{new Date(post.created_at).toLocaleString()}</p>
                </div>
                <div class="flex flex-row justify-between items-center">
                  <p class="pr-4">Likes: {post.likes_count}</p>
                  <p class="pr-4">Comments: {post.comments_count}</p>
                  <p class="pr-4">Shares: {post.shares_count}</p>
                  <p class="pr-4">Views: {post.views_count}</p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
