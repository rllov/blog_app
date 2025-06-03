// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // FastAPI default port
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
