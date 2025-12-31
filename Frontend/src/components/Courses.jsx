import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API call
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi"; // Import menu and close icons
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
  const [searchTerm, setSearchTerm] = useState(""); // ✅ new state for search

  console.log("courses: ", courses);

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/course/courses`, {
  withCredentials: true,
});

        console.log(response.data.courses);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/user/logout`, {
  withCredentials: true,
});

      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };
  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ✅ Filter courses by search
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-r from-black to-blue-950">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-white hover:text-orange-500"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-r from-black to-blue-950  w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src={logo} alt="Profile" className="rounded-full h-12 w-12" />
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a
                href="/"
                className="flex items-center text-white hover:text-orange-500 duration-300"
              >
                <RiHome2Fill className="mr-2" /> Home
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-orange-500"
              >
                <FaDiscourse className="mr-2" /> Courses
              </a>
            </li>
            <li className="mb-4">
              <a
                href="/purchases"
                className="flex items-center text-white hover:text-orange-500 duration-300"
              >
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-white hover:text-orange-500 duration-300"
              >
                <IoMdSettings className="mr-2" /> Settings
              </a>
            </li>
            <li>
              {isLoggedIn ? (
                <Link
                  to={"/"}
                  className="flex items-center text-white hover:text-orange-500 duration-300"
                  onClick={handleLogout}
                >
                  <IoLogOut className="mr-2" /> Logout
                </Link>
              ) : (
                <Link
                  to={"/login"}
                  className="flex items-center text-white hover:text-orange-500 duration-300"
                >
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gradient-to-r from-blue-950 to-black min-h-screen md:ml-4 p-4 md:p-16 text-white">
        <header className="flex justify-end items-center mb-6 ">
          {/* Right side: Search + Profile */}
          <div className="flex items-center space-x-3">
            {/* Search bar */}
            <div className="flex items-center border border-gray-500 rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Type here to search..."
                className="bg-transparent text-white placeholder-gray-300 px-4 py-2 h-10 focus:outline-none w-40 md:w-60"
                value={searchTerm} // ✅ updates state for searching
                onChange={(e) => setSearchTerm(e.target.value)} // ✅ updates state for searching
              />
              <button className="h-10 px-4 flex items-center justify-center bg-orange-500 hover:bg-orange-600 duration-300">
                <FiSearch className="text-xl text-white" />
              </button>
            </div>

            {/* Profile icon */}
            <FaCircleUser className="text-4xl text-orange-500 hover:text-white cursor-pointer duration-300" />
          </div>
        </header>

        {/* Vertically Scrollable Courses Section */}
<div className="overflow-y-auto md:h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredCourses.length === 0 ? (
            // Check if courses array is empty
            <p className="text-center text-gray-500 text-lg mt-15">
              Sorry, there is no course related to this search. Please try
              again.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9 px-2">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-700 bg-gray-900/70 rounded-lg p-8 shadow-md hover:scale-[1.02] transition-transform duration-300"
                >
                  <img
                    src={course.image?.url}
                    alt={course.title}
                    className="rounded mb-4"
                  />
                  <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                 <div className="flex justify-between items-center mb-4">
  <span className="font-bold text-xl">
    ₹{course.price}{" "}
    <span className="text-gray-500 line-through pl-2">
      ₹{Math.round(course.price * 1.2)}
    </span>
  </span>
  <span className="text-green-600">20% off</span>
</div>

                  {/* Buy page */}
                  <Link
                    to={`/buy/${course._id}`} // Pass courseId in URL
                    className="bg-orange-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
