import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; // Update import
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
  `${BASE_URL}/api/v1/user/signup`,
  {
    firstName,
    lastName,
    email,
    password,
  },
  {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }
);

      toast.success("Signup successful!");
      // Wait for toast to show before navigating
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Signup failed!";

      toast.error(msg);
      setErrorMessage(msg);
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 ">
      <Toaster position="top-center" /> {/* Add Toaster component */}
      <div className="h-screen container mx-auto flex  items-center justify-center text-white">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5  ">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to={"/"} className="text-xl font-bold text-orange-500">
              <span className="text-orange-500">Gyaan</span>
              <span className="text-white">Setu</span>{" "}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={"/login"}
              className="bg-transparent border border-gray-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md"
            >
              Login
            </Link>
            <Link
              to={"/courses"}
              className="bg-orange-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* Signup Form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] m-8 md:m-0 mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to   <span className="text-orange-500">Gyaan</span>
              <span className="text-white">Setu</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Just Signup To Join Us!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstname" className=" text-gray-400 mb-2">
                Firstname
              </label>
              <input
                type="text"
                id="firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your firstname"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastname" className=" text-gray-400 mb-2">
                Lastname
              </label>
              <input
                type="text"
                id="lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your lastname"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className=" text-gray-400 mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // 👈 toggle between text and password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
                <span
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer select-none"
                  onClick={() => setShowPassword(!showPassword)} // 👈 toggles password visibility
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            {errorMessage && (
              <div className="mb-4 text-red-500 text-center">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;











