import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcCollaboration } from "react-icons/fc";
import { Link } from "react-router-dom";
import { loginUser } from "../services/api";

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    try {
      const response = await loginUser({
        username_or_email: usernameOrEmail,
        password,
      });
      console.log("Login successful:", response.data);
      navigate("/home"); // Redirect to the success page
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="login-container"
      class="flex justify-center items-center w-screen h-screen bg-linear-to-r from-[#008FE7] to-[#005589]"
    >
      <div class="flex flex-col justify-center items-center bg-white rounded-3xl max-w-80 w-[100%] min-h-[75%] ">
        <FcCollaboration size={50} />
        <h2 class="text-center text-5xl text-blue-400 w-fit h-20 self-center p-3">
          Blog(in)
        </h2>
        <form
          onSubmit={handleSubmit}
          class=" flex flex-col justify-between m-6 p-4 w-fit"
        >
          <div class="pb-2 ">
            <input
              type="text"
              id="usernameOrEmail"
              value={usernameOrEmail}
              placeholder="Username or Email"
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              class="w-full bg-white p-3 rounded-[8px] border-gray-500 border-2"
            />
          </div>
          <div class="pb-2">
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              class="w-full bg-white p-3 rounded-[8px] border-gray-500 border-2"
            />
          </div>
          <button
            type="submit"
            class="text-white font-bold text-lg bg-[#008FE7] rounded-full p-2"
          >
            Login
          </button>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
