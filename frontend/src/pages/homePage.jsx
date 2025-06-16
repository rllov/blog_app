import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProtectedHome } from "../services/api";

const HomePage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You are not logged in. Please log in to access this page.");
      navigate("/login");
      return;
    }

    fetchProtectedHome(token)
      .then((data) => setMessage(data.message || "Welcome!"))
      .catch(() => {
        setError("Failed to fetch protected home data. Please try again.");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div>
      <h1>Backend Connection Test</h1>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <p>Backend says: {message || "Loading..."}</p>
      )}
    </div>
  );
};

export default HomePage;
