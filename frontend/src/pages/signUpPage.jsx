import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Signup successful:", response.data);
      navigate("/login"); // Redirect to login after successful signup
    } catch (err) {
      setError(
        err.response?.data?.detail || "Signup failed. Please try again."
      );
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center">
      <h1 className="m-4 p-2 bg-blue-500 rounded-2xl">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-lime-600 p-4 text-left rounded-4xl"
      >
        <div className="p-2 bg-amber-400">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="ml-2 p-1"
          />
        </div>
        <div className="p-2 bg-amber-400">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="ml-2 p-1"
          />
        </div>
        <div className="p-2 bg-blue-400">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="ml-2 p-1"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-amber-500 p-2 rounded-2xl border-2 border-black hover:bg-amber-200 self-center mt-4 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
