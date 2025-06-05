import React, { useState } from "react";
import { signupUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
      const response = await signupUser(formData);
      console.log("Signup successful:", response.data);
      navigate("/login");
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
    <div class="flex justify-center items-center w-screen h-screen bg-linear-to-r from-[#008FE7] to-[#005589]">
      <div class="flex flex-col justify-center items-center bg-white rounded-3xl max-w-80 w-[100%] min-h-[75%] ">
        <h1 class="text-center text-5xl text-blue-400 w-full h-20 self-center p-3">
          Sign Up
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          onSubmit={handleSubmit}
          class=" flex flex-col justify-center p-4 m-6 w-fit"
        >
          <div class="pb-2 ">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              placeholder="Username"
              onChange={handleChange}
              required
              class="w-full bg-white p-3 rounded-[8px] border-gray-500 border-2"
            />
          </div>
          <div className="pb-2">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              class="w-full bg-white p-3 rounded-[8px] border-gray-500 border-2"
            />
          </div>
          <div className="pb-2">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Password"
              class="w-full bg-white p-3 rounded-[8px] border-gray-500 border-2"
            />
          </div>
          <div class=" flex flex-col justify-between items-center w-full ">
            <button
              type="submit"
              disabled={isLoading}
              class="text-white font-bold text-lg bg-[#008FE7] rounded-full p-2 self-center w-full"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </div>
          <p className="mt-4 text-center">
            Already have an account?
            <Link to="/login" className="text-blue-500 underline">
              Blog(in)
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
