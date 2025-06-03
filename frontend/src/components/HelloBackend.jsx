// src/components/HelloBackend.js
import React, { useState, useEffect } from "react";
import { fetchMessage } from "../services/api";

function HelloBackend() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchMessage();
        setMessage(data.message);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Message from Backend:</h1>
      <p>{message}</p>
    </div>
  );
}

export default HelloBackend;
