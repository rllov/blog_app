import { useEffect, useState } from "react";

const HomePage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
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
