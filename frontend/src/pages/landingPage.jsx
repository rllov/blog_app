import React from "react";
import { useNavigate } from "react-router-dom";

// landing page component

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    // <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-r from-blue-400 to-blue-900">
    <div class="h-screen flex flex-col items-center-safe justify-center bg-gradient-to-r from-blue-400 to-blue-900 text-white">
      <h1>Welcome to the Blog App</h1>
      <p>Share your thoughts and connect with others.</p>
      <button
        onClick={handleLogin}
        class="text-6xl bg-white text-[#007bff] rounded-lg px-4 py-2 hover:bg-gradient-to-r from-blue-400 to-blue-900 hover:text-white transition duration-300"
      >
        Login
      </button>
    </div>
    // </div>
  );
};

export default LandingPage;
