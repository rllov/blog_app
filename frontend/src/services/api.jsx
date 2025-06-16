import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000", // Default to FastAPI port
  headers: {
    "Content-Type": "application/json",
  },
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

export const signupUser = (formData) => api.post("/signup", formData);
export const loginUser = (credentials) => api.post("/login", credentials);
