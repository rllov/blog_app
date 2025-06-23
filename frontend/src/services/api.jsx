import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000", // Default to FastAPI port
});

export const fetchProtectedHome = async (token) => {
  try {
    const response = await api.get("/auth/home", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchPosts = async (token) => {
  try {
    const response = await api.get("/auth/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const createPost = async (token, formData) => {
  try {
    const response = await api.post("/auth/posts", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

//add a comment to a post
export const createComment = async (token, postId, text) => {
  const formData = new FormData();
  formData.append("text", text);
  try {
    const response = await api.post(
      `/auth/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

//fetch comments for a post
export const fetchComments = async (token, postId) => {
  try {
    const response = await api.get(`/auth/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// like a post
export const toggleLike = async (token, postId) => {
  try {
    const response = await api.post(`/auth/posts/${postId}/like`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchLikes = async (token, postId) => {
  try {
    const response = await api.get(`/auth/posts/${postId}/likes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const signupUser = (formData) => api.post("/signup", formData);
export const loginUser = (credentials) => api.post("/login", credentials);
