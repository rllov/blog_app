import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchPosts,
  fetchProtectedHome,
  toggleLike,
  fetchComments,
} from "../services/api";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import NewPostForm from "../components/NewPostForm";
import CommentForm from "../components/CommentForm";
const HomePage = () => {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});

  const navigate = useNavigate();

  const handlePostCreated = () => {
    const token = localStorage.getItem("access_token");
    fetchPosts(token).then(setPosts);
  };
  const handleShowComments = (postId) => {
    const token = localStorage.getItem("access_token");
    if (showComments[postId]) {
      setShowComments((prev) => ({ ...prev, [postId]: false }));
      setComments((prev) => ({ ...prev, [postId]: [] }));
    } else {
      setShowComments((prev) => ({ ...prev, [postId]: true }));
      fetchComments(token, postId)
        .then((data) => {
          setComments((prev) => ({ ...prev, [postId]: data }));
        })
        .catch((err) => {
          console.error("Error fetching comments:", err);
          setError("Failed to fetch comments. Please try again.");
        });
    }
  };
  const handleCommentAdded = (postId) => {
    const token = localStorage.getItem("access_token");
    fetchComments(token, postId)
      .then((data) => {
        setComments((prev) => ({ ...prev, [postId]: data }));
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setError("Failed to fetch comments. Please try again.");
      });
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
      <div class="w-screen justify-center items-center flex flex-col">
        <NewPostForm onPostCreated={handlePostCreated} />
        {posts.map((post) => (
          <>
            <div class="w-screen p-4 border-b-2 border-gray-500 text-left m-4 flex flex-col justify-between items-start">
              <div key={post.post_id} class="w-fit break-words">
                <div class="pb-4 break-all whitespace-pre-line">
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
                <div class="flex flex-row items-center w-fit">
                  <p class="pr-4 flex flex-row items-center text-xl">
                    <FaThumbsUp
                      class="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const token = localStorage.getItem("access_token");
                        toggleLike(token, post.post_id)
                          .then(() => {
                            fetchPosts(token).then(setPosts);
                          })
                          .catch((err) => {
                            console.error("Error toggling like:", err);
                            setError(
                              "Failed to toggle like. Please try again."
                            );
                          });
                      }}
                    />
                    Likes: {post.likes_count}
                  </p>
                  <p class="pr-4 flex flex-row items-center text-xl ">
                    <FaComment
                      class="cursor-pointer"
                      onClick={() => handleShowComments(post.post_id)}
                    />
                    Comments:{post.comments_count}
                  </p>
                </div>
                {showComments[post.post_id] && (
                  <div class="flex flex-col">
                    <CommentForm
                      postId={post.post_id}
                      onCommentAdded={() => handleCommentAdded(post.post_id)}
                    />
                    <ul>
                      {(comments[post.post_id] || []).map((comment) => (
                        <>
                          <li
                            key={comment.comment_id}
                            class=" pr-4 text-wrap w-fit break-all whitespace-pre-line"
                          >
                            <strong>{comment.username}</strong>: {comment.text}{" "}
                          </li>
                          <span class="text-xs">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
