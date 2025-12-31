import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Detect scroll to make navbar sticky
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect login status from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);

    toast.success("Logged out successfully!");

    // Navigate after small delay so toast shows
    setTimeout(() => {
      navigate("/"); // SPA navigation
    }, 1500);
  };

  return (
    <>
      {/* Global Toaster for Navbar */}
      <Toaster position="top-center" />

      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all ${
          sticky
            ? "bg-gray-900/90 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4 px-6 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to="/" className="text-2xl font-bold">
              <span className="text-orange-500">Gyaan</span>
              <span className="text-white">Setu</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 font-medium">
            <li>
              <Link
                to="/"
                className="pb-1 border-b-2 border-transparent hover:border-orange-500 transition-all duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className="pb-1 border-b-2 border-transparent hover:border-orange-500 transition-all duration-300"
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="pb-1 border-b-2 border-transparent hover:border-orange-500 transition-all duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="pb-1 border-b-2 border-transparent hover:border-orange-500 transition-all duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-transparent text-white text-xs md:text-sm p-2 border border-white rounded hover:bg-orange-500 transition-all duration-300"
                >
                  Logout
                </button>
                <Link
                  to="/profile"
                  className="bg-orange-500 py-2 px-4 rounded-md hover:bg-orange-600 transition"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-transparent border border-gray-500 py-2 px-4 rounded-md hover:bg-orange-500 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-transparent border border-gray-500 py-2 px-4 rounded-md hover:bg-orange-500 transition"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div
            className="md:hidden cursor-pointer text-2xl text-white hover:text-orange-500 transition-all duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "X" : "☰"}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900/95 text-white py-4">
            <ul className="flex flex-col items-center space-y-4 font-medium">
              <li>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="hover:border-orange-500 transition-all duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  onClick={() => setMenuOpen(false)}
                  className="hover:border-orange-500 transition-all duration-300"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className="hover:border-orange-500 transition-all duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="hover:border-orange-500 transition-all duration-300"
                >
                  Contact
                </Link>
              </li>

              {/* Auth Buttons for Mobile */}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="bg-transparent border border-gray-500 py-2 px-6 rounded-md hover:bg-orange-500 transition"
                  >
                    Logout
                  </button>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="bg-orange-500 py-2 px-6 rounded-md hover:bg-orange-600 transition"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="bg-transparent border border-gray-500 py-2 px-6 rounded-md hover:bg-orange-500 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="bg-orange-500 py-2 px-6 rounded-md hover:bg-orange-600 transition"
                  >
                    Signup
                  </Link>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
