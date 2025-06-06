import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchMessage = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
