import { useEffect, useState } from "react";
import { fetchMessage } from "../services/api"; // Use your API service

const HomePage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessage()
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, []);

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
